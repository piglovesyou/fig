import { NodePath } from '@babel/traverse';
import {
  identifier,
  importDeclaration,
  importSpecifier,
  isImportDeclaration,
  isProgram,
  isReturnStatement,
  JSXElement,
  jsxExpressionContainer,
  Program,
  stringLiteral,
} from '@babel/types';
import { GenContext } from '../../types/gen';
import { ParentVisitContext, VisitContext } from '../../types/visit';
import { makeTextContent } from '../../visit/text';
import {
  appendJsxNode,
  findTempRefJsxElement,
  getJsxCursor,
  makeFidAttr,
  parseAsRoot,
  parseExpression,
  TEMP_REF_ATTR,
} from './ast-utils';

export function erasePlaceholderElement(
  placeholderCursor: NodePath<JSXElement>
): void {
  // Merge attributes before removing the top placeholder element
  const placeholderElement = placeholderCursor.node;
  const componentRootElement = placeholderElement.children[0]! as JSXElement;

  // Remove placeholderElement
  const returnStatement = placeholderCursor.parent;
  if (!isReturnStatement(returnStatement)) throw new Error('never');
  returnStatement.argument = componentRootElement;
}

export function appendImportDeclaration(
  cursor: NodePath<JSXElement>,
  context: VisitContext,
  genContext: GenContext,
  componentName: string
) {
  // Import component if not exists
  const program = cursor.findParent((path) =>
    isProgram(path.node)
  )! as NodePath<Program>;
  const importFromPage = context.parentNode?.type === 'FRAME';
  const importSource = `${
    importFromPage ? `../${genContext.config.componentsDir}` : '.'
  }/${componentName}`;
  const alreadyImported = program.node.body.some(
    (node) => isImportDeclaration(node) && node.source.value === importSource
  );
  if (!alreadyImported) {
    program.node.body.unshift(
      importDeclaration(
        [importSpecifier(identifier(componentName), identifier(componentName))],
        stringLiteral(importSource)
      )
    );
  }
}

export function appendElement(
  context: VisitContext,
  parentContext: ParentVisitContext,
  tagName: string
) {
  const { cursor: parentCursor } = parentContext;
  const { classNames, node, parentNode, styles } = context;

  const classNameAttr = classNames.size
    ? `className="${Array.prototype.join.call(classNames, ' ')}"`
    : '';

  // Component root element wants to merge external style passed from props
  const isComponentRoot = !Boolean(parentNode);
  const styleAttr = isComponentRoot
    ? `style={{...${JSON.stringify(styles)}, ...props.style}}`
    : `style={${JSON.stringify(styles)}}`;

  const template = `
<${tagName}
    ${makeFidAttr(node.id)}
    ${classNameAttr}
    ${styleAttr}
    data-fname="${node.name}"
    ${TEMP_REF_ATTR}
>
</${tagName}>
`;
  const wrapper = parseExpression<JSXElement>(template);
  appendJsxNode(parentCursor, wrapper);
  // Find the inner div element
  return findTempRefJsxElement(parentCursor);
}

export function makeLayout(name: string) {
  const root = parseAsRoot(`
import React, {FC, CSSProperties} from "react"

export const ${name}: FC<{style: CSSProperties}> = (props) => {
  return (
    <__PLACEHOLDER__ ${TEMP_REF_ATTR}></__PLACEHOLDER__>
  )
}
    `);
  return findTempRefJsxElement(root);
}

export function appendTextContext(
  context: VisitContext,
  parentContext: ParentVisitContext
) {
  const { node } = context;
  if (node.type !== 'TEXT')
    throw new Error(`Never. This function is supposed to emit on TEXT node.`);

  let cursor = appendElement(context, parentContext, 'div');
  const content = makeTextContent(node);
  if (node.name.startsWith('$')) {
    const varName = node.name.substring(1);
    // TODO: Handle variables.
    cursor.node.children.push(
      jsxExpressionContainer(
        parseExpression(
          `this.props.${varName} && this.props.${varName}.split("\\n").map((line, idx) => <div key={idx}>{line}</div>)`
        )
      )
    );
    cursor = getJsxCursor(cursor);
    appendJsxNode(
      cursor,
      jsxExpressionContainer(
        parseExpression(
          `!this.props.${varName} && (<div ${TEMP_REF_ATTR}></div>)`
        )
      )
    );
    cursor = getJsxCursor(cursor);
    cursor.node.children.push(...content);
  } else {
    cursor.node.children.push(...content);
  }
}

export function appendComponentInstanceElement(
  context: VisitContext,
  parentContext: ParentVisitContext,
  genContext: GenContext
) {
  const { node } = context;
  const { cursor: parentCursor } = parentContext;
  const componentInfo = genContext.componentsMap.get(
    node.type === 'INSTANCE' ? node.componentId : node.id
  );
  if (!componentInfo)
    throw new Error('Never. It should appear in componentsMap.');
  const componentName = componentInfo.name;

  appendImportDeclaration(parentCursor, context, genContext, componentName);
  appendElement(context, parentContext, componentName);
}

export function appendSvgContent(
  context: VisitContext,
  parentContext: ParentVisitContext,
  svgHtml: string
) {
  const cursor = appendElement(context, parentContext, 'div');

  // Use dangerous SVG instead of building DOM
  appendJsxNode(
    cursor,
    parseExpression<JSXElement>(
      `<div className="vector" dangerouslySetInnerHTML={{__html: \`${svgHtml}\`}} />`
    )
  );
}