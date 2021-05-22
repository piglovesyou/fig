import { NodePath } from '@babel/traverse';
import {
  identifier,
  importDeclaration,
  importSpecifier,
  isImportDeclaration,
  isProgram,
  JSXElement,
  Program,
  stringLiteral,
} from '@babel/types';
import { GenContext } from './make-gen-context';
import {
  findTempRefJsxElement,
  makeFidAttr,
  parseExpression,
  TEMP_REF_ATTR,
} from './strategies/jsx/make-ast';
import {
  ComposableNode,
  LayoutConstraintHorizontal,
  LayoutConstraintVertical,
} from './types';
import { appendJsxNode } from './visit/jsx';
import { applyStyles } from './visit/styles';
import { appendTextContent } from './visit/text';
import {
  EmptyVisitContext,
  makeVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from './visit/visit-context';

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

// // TODO: Not tested I guess
// function appendMaxerElement(
//   cursor: NodePath<JSXElement>
//   // context: VisitContext
// ) {
//   // const { outerStyle, styles } = context;
//   const wrapper = parseExpression<JSXElement>(`
//   <div className="maxer" ${TEMP_REF_ATTR}></div>
// `);
//   appendJsxNode(cursor, wrapper);
//   // Find the inner div element
//   return findTempRefJsxElement(cursor);
// }

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

// function applySizes(bounds: Bound | null, styles: React.CSSProperties) {
//   if (bounds) {
//     styles.minWidth = bounds.width;
//     styles.minHeight = bounds.height;
//   }
// }

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
