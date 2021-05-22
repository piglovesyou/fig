import generate from '@babel/generator';
import {
  parse,
  parseExpression as _parseExpression,
  ParserOptions,
} from '@babel/parser';
import traverse, { NodePath, TraverseOptions, Visitor } from '@babel/traverse';
import {
  Expression,
  File,
  isFile,
  isJSXAttribute,
  isJSXIdentifier,
  isStringLiteral,
  JSXElement,
  Node,
} from '@babel/types';

export const parserOption: ParserOptions = {
  sourceType: 'module',
  plugins: ['typescript', 'jsx'],
  allowImportExportEverywhere: true,
};

export const TEMP_REF_ATTR = 'TEMP_REF_ATTR';

export function findTempRefAttrIndex(el: NodePath<JSXElement>): number {
  return el.node.openingElement.attributes.findIndex(
    (a) =>
      isJSXAttribute(a) &&
      isJSXIdentifier(a.name) &&
      a.name.name === TEMP_REF_ATTR
  );
}

export function hasTempRefAttr(el: NodePath<JSXElement>): boolean {
  return findTempRefAttrIndex(el) >= 0;
}

export function removeTempRefAttr(
  el: NodePath<JSXElement>,
  index: number
): void {
  if (index < 0) throw new Error(`${TEMP_REF_ATTR} not found.`);
  el.node.openingElement.attributes.splice(index, 1);
}

export const FID_ATTR_NAME = 'data-fid';

export function makeFidAttr(fid: string): string {
  return `${FID_ATTR_NAME}="${fid}"`;
}

export function findJsxElement(
  tree: File | NodePath,
  condition: (path: NodePath<JSXElement>) => boolean
): NodePath<JSXElement> | null {
  let el: null | NodePath<JSXElement> = null;
  const visitOption = {
    JSXElement(jsxElement: NodePath<JSXElement>) {
      const found = condition(jsxElement);
      if (found) {
        if (el)
          throw new Error('elements were found multiple times. Kidding me?');
        el = jsxElement;
      }
    },
  };
  if (isFile(tree)) {
    traverse(tree, visitOption as TraverseOptions);
  } else {
    tree.traverse(visitOption as Visitor);
  }
  return el;
}

export function findTempRefJsxElement(
  tree: File | NodePath
): NodePath<JSXElement> {
  const el = findJsxElement(tree, (el) => {
    const index = findTempRefAttrIndex(el);
    if (index >= 0) {
      removeTempRefAttr(el, index);
      return true;
    }
    return false;
  });
  if (!el)
    throw new Error(`There must be an element having attr "${TEMP_REF_ATTR}"`);
  return el;
}

export function findJsxElementByFid(tree: File | NodePath, fid: string) {
  return findJsxElement(tree, (el: NodePath<JSXElement>) => {
    const attrs = el.node.openingElement.attributes;
    return attrs.some(
      (a) =>
        isJSXAttribute(a) &&
        isJSXIdentifier(a.name) &&
        a.name.name === FID_ATTR_NAME &&
        isStringLiteral(a.value) &&
        a.value.value === fid
    );
  });
}

export function getJsxCursor(ast: File | NodePath): NodePath<JSXElement> {
  let cursor: NodePath<JSXElement>;
  const visitOption = {
    JSXElement(path: NodePath<JSXElement>) {
      let attrs = path.node.openingElement.attributes;
      const attrIndex = attrs.findIndex(
        (a) => isJSXAttribute(a) && String(a.name.name).includes(TEMP_REF_ATTR)
      );
      if (attrIndex >= 0) {
        if (cursor) throw new Error('"cursor" was found already. Kidding me?');
        cursor = path;
        Array.prototype.splice.call(attrs, attrIndex, 1);
      }
    },
  };
  if (isFile(ast)) {
    traverse(ast, visitOption as TraverseOptions);
  } else {
    ast.traverse(visitOption as Visitor);
  }
  if (!cursor!)
    throw new Error(`JSX Attribute "${TEMP_REF_ATTR}" is not found.`);
  return cursor;
}

// TODO: Find cursor by placeholder string, not comment for flexibility
export function getStatementCursor<T extends Node | unknown = unknown>(
  ast: Node
): NodePath<T> {
  let cursor: NodePath<T>;
  traverse(ast, {
    enter(path) {
      if (!path.node.leadingComments) return;
      let commentIndex = path.node.leadingComments.findIndex(({ value }) =>
        value.includes(TEMP_REF_ATTR)
      );
      if (commentIndex >= 0) {
        if (cursor) throw new Error('"cursor" was found already. Kidding me?');
        cursor = path as NodePath<T>;
        Array.prototype.splice.call(path.node.leadingComments, commentIndex, 1);
      }
    },
  });
  if (!cursor!)
    throw new Error(`Trailing comment "${TEMP_REF_ATTR}" is not found.`);
  return cursor;
}

export function parseAsRoot(codeWithCursor: string) {
  return parse(codeWithCursor, parserOption);
}

export function parseExpression<T extends Expression = Expression>(
  codeWithCursor: string
): T {
  return _parseExpression(codeWithCursor, parserOption) as T;
}

export function getRootPath(path: NodePath) {
  while (path.parentPath) {
    path = path.parentPath;
  }
  return path;
}

export function appendJsxChild(
  jsxCursor: NodePath<JSXElement>,
  jsxContent: JSXElement
) {
  if (!jsxCursor.node.closingElement) {
    throw new Error(
      `Don't pass self-closing JSX element that doesn't accept children: ${
        generate(jsxCursor.node).code
      }`
    );
  }
  jsxCursor.node.children.push(jsxContent);
}
