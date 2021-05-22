import { NodePath } from '@babel/traverse';
import {
  identifier,
  importDeclaration,
  importSpecifier,
  isImportDeclaration,
  isProgram,
  JSXElement,
  JSXExpressionContainer,
  jsxExpressionContainer,
  Program,
  stringLiteral,
} from '@babel/types';
import { CSSProperties } from 'react';
import {
  findTempRefJsxElement,
  getJsxCursor,
  makeFidAttr,
  parseExpression,
  TEMP_REF_ATTR,
} from './make-ast';
import { GenContext } from './make-gen-context';
import {
  Bound,
  ComposableNode,
  LayoutConstraintHorizontal,
  LayoutConstraintVertical,
  Rectangle,
} from './types';
import { Node } from './types/ast';
import { applyFontStyle, applyStyles } from './visit/styles';

function makeBounds(parentNode: ComposableNode, nodeBounds: Rectangle) {
  const nx2 = nodeBounds!.x + nodeBounds!.width;
  const ny2 = nodeBounds!.y + nodeBounds!.height;
  const parentBounds = parentNode.absoluteBoundingBox;
  const px = parentBounds.x;
  const py = parentBounds.y;

  return {
    left: nodeBounds!.x - px,
    right: px + parentBounds.width - nx2,
    // top:
    //   lastVertical == null ? nodeBounds!.y - py : nodeBounds!.y - lastVertical,
    top: nodeBounds!.y - py,
    bottom: py + parentBounds.height - ny2,
    width: nodeBounds!.width,
    height: nodeBounds!.height,
  };
}
function makeTextContent(node: Node<'TEXT'>): JSXElement[] {
  if (node.name.startsWith('input:')) {
    return [
      parseExpression<JSXElement>(
        `<input key='${node.id}' type='text' placeholder='${
          node.characters
        }' name='${node.name.substring(7)}' />`
      ),
    ];
  }

  if (node.characterStyleOverrides) {
    let para = '';
    const ps: JSXElement[] = [];
    const styleCache: Record<number, CSSProperties> = {};
    let currStyle = 0;

    const commitParagraph = (key: number | string) => {
      if (para !== '') {
        if (styleCache[currStyle] == null && currStyle !== 0) {
          styleCache[currStyle] = {};
          // TODO: Do we need this?
          applyFontStyle(
            styleCache[currStyle],
            node.styleOverrideTable[currStyle]
          );
        }

        const styleOverride = styleCache[currStyle]
          ? JSON.stringify(styleCache[currStyle])
          : '{}';

        ps.push(
          parseExpression<JSXElement>(
            `<span style={${styleOverride}} key="${key}">${para}</span>`
          )
        );
        para = '';
      }
    };

    for (let i = 0; i < node.characters.length; i++) {
      let idx = node.characterStyleOverrides[i];

      if (node.characters[i] === '\n') {
        commitParagraph(i);
        ps.push(parseExpression<JSXElement>(`<br key='${`br${i}`}' />`));
        continue;
      }

      if (idx == null) idx = 0;
      if (idx !== currStyle) {
        commitParagraph(i);
        currStyle = idx;
      }

      para += node.characters[i];
    }
    commitParagraph('end');

    return ps;
  }

  return node.characters
    .split('\n')
    .map((line, idx) => parseExpression(`<div key='${idx}'>${line}</div>`));
}

/**
 * TODO: Split into different responsibilities
 */
export function expandChildren(context: VisitContext, offset: number) {
  const {
    node,
    // minChildren,
    // maxChildren,
    // centerChildren,
    parentNode,
  } = context;
  const children = node.children;
  // let order = offset;

  if (!children) return;

  for (const child of children) {
    // TODO: Do we want this?
    if (parentNode && (node.type === 'COMPONENT' || node.type === 'INSTANCE')) {
      child.constraints = {
        vertical: LayoutConstraintVertical.TOP_BOTTOM,
        horizontal: LayoutConstraintHorizontal.LEFT_RIGHT,
      };
    }

    // child.order = i + order;

    // if (child.constraints?.vertical === 'TOP') {
    //   minChildren.push(child);
    // } else if (child.constraints?.vertical === 'BOTTOM') {
    //   maxChildren.push(child);
    // } else {
    // centerChildren.push(child);
    // }
  }

  // minChildren.sort(sortByYAxis);
  // maxChildren.sort(sortByYAxis);

  // return order + children.length - offset;
}

// TODO: Not tested I guess
function appendMaxerElement(
  cursor: NodePath<JSXElement>
  // context: VisitContext
) {
  // const { outerStyle, styles } = context;
  const wrapper = parseExpression<JSXElement>(`
  <div className="maxer" ${TEMP_REF_ATTR}></div>
`);
  appendJsxNode(cursor, wrapper);
  // Find the inner div element
  return findTempRefJsxElement(cursor);
}

function appendWrapperElement(
  cursor: NodePath<JSXElement>,
  context: VisitContext,
  tagName: string
) {
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
  appendJsxNode(cursor, wrapper);
  // Find the inner div element
  return findTempRefJsxElement(cursor);
}

function appendJsxNode(
  cursor: NodePath<JSXElement>,
  child: JSXElement | JSXExpressionContainer
): void {
  cursor.node.children.push(child);
  return;
}

function applySizes(bounds: Bound | null, styles: React.CSSProperties) {
  if (bounds) {
    styles.minWidth = bounds.width;
    styles.minHeight = bounds.height;
  }
}

export function makeVisitContext(
  node: ComposableNode,
  parentContext: VisitContext | EmptyVisitContext,
  genContext: GenContext
  // lastVertical: number | null
): VisitContext {
  const parentNode = parentContext?.node || null;
  // const centerChildren: ComposableNode[] = [];
  // Do we want these?? Probably not.
  // const minChildren: ComposableNode[] = [];
  // const maxChildren: ComposableNode[] = [];

  let bounds: Bound | null = null;
  let nodeBounds: Rectangle | null = null;

  if (parentNode) {
    nodeBounds = node.absoluteBoundingBox;
    bounds = makeBounds(parentNode, nodeBounds);
  }

  const styles: CSSProperties = {};
  const classNames = new Set<string>();

  // Get outFullDir
  let outFullDir: string | undefined;
  switch (node.type) {
    case 'FRAME':
      outFullDir = genContext.pagesFullDir;
      break;
    case 'COMPONENT':
    case 'INSTANCE':
      outFullDir = genContext.pagesFullDir;
      break;
    default:
      if (parentContext?.outFullDir) {
        outFullDir = parentContext?.outFullDir;
      } else {
        outFullDir = genContext.pagesFullDir;
      }
  }

  return {
    node,
    parentNode,
    // minChildren,
    // maxChildren,
    // centerChildren,
    bounds,
    nodeBounds,
    styles,
    classNames,
    outFullDir,
  };
}

function appendSvg(
  vectorsMap: Map<string, string>,
  node: ComposableNode,
  cursor: NodePath<JSXElement>
): void {
  // Use dangerous SVG instead of building DOM
  const svgHtml = vectorsMap.get(node.id);
  appendJsxNode(
    cursor,
    parseExpression<JSXElement>(
      `<div className="vector" dangerouslySetInnerHTML={{__html: \`${svgHtml}\`}} />`
    )
  );
}

function appendImportDeclaration(
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

function appendComponentInstance(
  genContext: GenContext,
  node: ComposableNode,
  cursor: NodePath<JSXElement>,
  context: VisitContext
): void {
  const componentInfo = genContext.componentsMap.get(
    node.type === 'INSTANCE' ? node.componentId : node.id
  );
  if (!componentInfo)
    throw new Error('Never. It should appear in componentsMap.');
  const componentName = componentInfo.name;

  appendImportDeclaration(cursor, context, genContext, componentName);
  appendWrapperElement(cursor, context, componentName);
}

function appendTextContent(node: Node<'TEXT'>, cursor: NodePath<JSXElement>) {
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
  return cursor;
}

export type VisitContext = {
  node: ComposableNode;
  parentNode: null | ComposableNode;
  bounds: null | Bound;
  nodeBounds: any;
  styles: React.CSSProperties;
  classNames: Set<string>;
  // minChildren: ComposableNode[];
  // centerChildren: ComposableNode[];
  // maxChildren: ComposableNode[];
  outFullDir: string;
};

type _WithCursor = { cursor: NodePath<JSXElement> };

export type VisitContextWithCursor = VisitContext & _WithCursor;

// For parentContext of root node
export type EmptyVisitContext = Partial<VisitContext> & _WithCursor;

function checkShouldImportComponent(
  context: VisitContext,
  parentContext: VisitContextWithCursor | EmptyVisitContext,
  genContext: GenContext
) {
  const { node: parentNode } = parentContext;
  const { node } = context;
  if (!parentNode) return false;

  if (node.type === 'COMPONENT' && genContext.componentsMap.has(node.id))
    return true;

  if (
    node.type === 'INSTANCE' &&
    genContext.componentsMap.has(node.componentId)
  )
    return true;

  return false;
}

export function visitNode(
  node: ComposableNode,
  parentContext: VisitContextWithCursor | EmptyVisitContext,
  genContext: GenContext
): VisitContextWithCursor | null {
  const { vectorsMap } = genContext;
  const { cursor: parentCursor } = parentContext;

  const context = makeVisitContext(node, parentContext, genContext);

  // TODO: Rethink whether we want this.
  expandChildren(context, 0);

  // if (node?.order != null) {
  //   styles.zIndex = node.order;
  // }

  applyStyles(context, genContext);

  const shouldImportComponent = checkShouldImportComponent(
    context,
    parentContext,
    genContext
  );
  if (shouldImportComponent) {
    appendComponentInstance(genContext, node!, parentCursor, context);
    return null;
  }

  const cursor = appendWrapperElement(parentCursor, context, 'div');

  if (node && vectorsMap.has(node.id)) {
    appendSvg(vectorsMap, node, cursor);
    return null;

    // TODO: Case to import another component
  }

  if (node?.type === 'TEXT') {
    appendTextContent(node, cursor);
    return null;
  }

  return { ...context, cursor };
  // for (const child of centerChildren) {
  //   visitNode(child, contextWithCursor, genContext);
  // }

  // if (maxChildren.length > 0) {
  //   // outerClass.push('maxer');
  //   // styles.width = '100%';
  //   // styles.pointerEvents = 'none';
  //   // delete styles.backgroundColor;
  //   parentCursor = appendMaxerElement(parentCursor);
  //   // first = true;
  //   for (const child of maxChildren) {
  //     visitNode(parentCursor, child, context, genContext);
  //     // first = false;
  //   }
  // }
}
