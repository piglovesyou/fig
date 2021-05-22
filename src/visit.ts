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
import { relative } from 'path';
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
  EffectShadow,
  isLayoutableNode,
  LayoutConstraintHorizontal,
  LayoutConstraintVertical,
  Rectangle,
  TypeStyle,
} from './types';
import { Node } from './types/ast';
import {
  backgroundSize,
  colorString,
  dropShadow,
  getLastVisible,
  innerShadow,
  paintToLinearGradient,
  paintToRadialGradient,
} from './utils';

function applyAutolayoutConstraintsStyle({ node, styles }: VisitContext) {
  if (!isLayoutableNode(node) || !node.layoutMode)
    throw new Error('This function is for frame having autolayout');

  styles.display = 'flex';
  styles.flexDirection = node.layoutMode === 'VERTICAL' ? 'column' : 'row';
  styles.paddingTop = node.paddingTop;
  styles.paddingRight = node.paddingRight;
  styles.paddingBottom = node.paddingBottom;
  styles.paddingLeft = node.paddingLeft;
  styles.gap = node.itemSpacing;

  switch (node.primaryAxisAlignItems) {
    case 'MIN':
      styles.justifyContent = 'flex-start';
      break;
    case 'CENTER':
      styles.justifyContent = 'center';
      break;
    case 'MAX':
      styles.justifyContent = 'flex-end';
      break;
  }

  switch (node.counterAxisAlignItems) {
    case 'MIN':
      styles.alignItems = 'flex-start';
      break;
    case 'CENTER':
      styles.alignItems = 'center';
      break;
    case 'MAX':
      styles.alignItems = 'flex-end';
      break;
  }
}

function applyVerticalStyle({ styles, bounds, node }: VisitContext): void {
  if (!bounds) return;
  switch (node.constraints?.vertical) {
    case 'TOP':
      styles.top = bounds.top;
      styles.height = bounds.height;
      break;
    case 'CENTER':
      // outerStyle.alignItems = 'center';
      // if (bounds) {
      // TODO: Should use %?
      const sum = bounds.top + bounds.bottom;
      styles.top = Math.round((bounds.top / sum) * 100) + '%';
      styles.transform = `${styles.transform || ''} translateY(-50%)`;
      styles.height = bounds.height;
      // }
      break;
    case 'BOTTOM':
      styles.bottom = bounds.bottom;
      styles.height = bounds.height;
      break;
    case 'TOP_BOTTOM':
      styles.top = bounds.top;
      styles.bottom = bounds.bottom;
      styles.minHeight = bounds?.height;
      break;
    case 'SCALE':
      const parentHeight = bounds.top + bounds.height + bounds.bottom;
      styles.height = `${(bounds.height * 100) / parentHeight}%`;
      styles.top = `${(bounds.top * 100) / parentHeight}%`;
      break;
    default:
      throw new Error('what');
  }
}

function applyHorisontalStyle({ styles, bounds, node }: VisitContext) {
  if (!bounds) return;
  switch (node.constraints?.horizontal) {
    case 'LEFT':
      styles.left = bounds.left;
      styles.width = bounds.width;
      break;
    case 'CENTER':
      // outerStyle.justifyContent = 'center';
      const sum = bounds.left + bounds.right;
      // if (bounds.left && bounds.right) styles.left = bounds.left - bounds.right;
      styles.left = Math.round((bounds.left / sum) * 100) + '%';
      styles.transform = `${styles.transform || ''} translateX(-50%)`;
      // styles.right = Math.round((bounds.right / sum) * 100) + '%';
      styles.width = bounds.width;
      break;
    case 'RIGHT':
      // outerStyle.justifyContent = 'flex-end';
      styles.right = bounds.right;
      styles.width = bounds.width;
      break;
    case 'LEFT_RIGHT':
      styles.left = bounds.left;
      styles.right = bounds.right;
      // TODO: Do we want this?
      // styles.minWidth = bounds.width;
      break;
    case 'SCALE':
      const parentWidth = bounds.left + bounds.width + bounds.right;
      styles.width = `${(bounds.width * 100) / parentWidth}%`;
      styles.left = `${(bounds.left * 100) / parentWidth}%`;
      break;
    default:
      throw new Error('what');
  }
}

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

function getLayoutMode(node: ComposableNode | null) {
  return node && (node as Node<'FRAME'>).layoutMode;
}

function applyFontStyle(styles: CSSProperties, fontStyle: TypeStyle) {
  if (fontStyle) {
    styles.fontSize = fontStyle.fontSize;
    styles.fontWeight = fontStyle.fontWeight;
    styles.fontFamily = `"${fontStyle.fontFamily}"`;
    styles.fontStyle = fontStyle.italic ? 'italic' : 'normal';
    styles.lineHeight = `${fontStyle.lineHeightPercent * 1.25}%`;
    styles.letterSpacing = `${fontStyle.letterSpacing}px`;

    if (fontStyle.textAlignHorizontal === 'JUSTIFIED') {
      styles.textAlign = 'justify';
    } else {
      styles.textAlign = fontStyle.textAlignHorizontal.toLowerCase() as any;
    }
  }
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

function applyNodeTypeStyle(
  context: VisitContext,
  genContext: GenContext
): void {
  const { styles, node, outFullDir } = context;
  // if (node.name === 'Frame 2') debugger;
  // if (node.id === '1:46') debugger;
  const { imagesMap } = genContext;
  switch (node.type) {
    case 'FRAME':
    case 'INSTANCE':
    case 'COMPONENT':
      // This is needed to overwrite component style by instance
      // TODO: When node has ".backgroundColor" ?
      if (node.backgroundColor)
        styles.backgroundColor = colorString(node.backgroundColor);
    case 'RECTANGLE':
      {
        const lastFill = getLastVisible(node.fills);
        switch (lastFill?.type) {
          case 'SOLID':
            styles.backgroundColor = colorString(lastFill.color!);
            styles.opacity = lastFill.opacity;
            break;
          case 'IMAGE':
            const imageFullPath = imagesMap.get(lastFill.imageRef || '');
            if (!imageFullPath)
              throw new Error('Something wrong with Figma API');
            const imageRelPath = relative(
              genContext.htmlFullDir,
              imageFullPath
            );
            styles.backgroundImage = `url(${imageRelPath})`; // TODO: Sanitize
            styles.backgroundSize = backgroundSize(lastFill.scaleMode!);
            styles.backgroundPosition = 'center';
            break;
          case 'GRADIENT_LINEAR':
            styles.background = paintToLinearGradient(lastFill);
            break;
          case 'GRADIENT_RADIAL':
            styles.background = paintToRadialGradient(lastFill);
            break;
        }

        if (node.effects) {
          for (const effect of node.effects) {
            switch (effect.type) {
              case 'DROP_SHADOW':
                styles.boxShadow = dropShadow(effect as EffectShadow);
                break;
              case 'INNER_SHADOW':
                styles.boxShadow = innerShadow(effect as EffectShadow);
                break;
              case 'LAYER_BLUR':
                styles.filter = `blur(${effect.radius}px)`;
                break;
            }
          }
        }

        const lastStroke = getLastVisible(node.strokes);
        if (lastStroke?.type === 'SOLID') {
          const weight = node.strokeWeight || 1;
          styles.border = `${weight}px solid ${colorString(lastStroke.color)}`;
        }

        const cornerRadii = node.rectangleCornerRadii;
        if (
          cornerRadii &&
          cornerRadii.length === 4 &&
          cornerRadii[0] + cornerRadii[1] + cornerRadii[2] + cornerRadii[3] > 0
        ) {
          styles.borderRadius = `${cornerRadii[0]}px ${cornerRadii[1]}px ${cornerRadii[2]}px ${cornerRadii[3]}px`;
        }
      }
      break;

    case 'TEXT':
      {
        const lastFill = getLastVisible(node.fills);
        if (lastFill) {
          styles.color = colorString(lastFill.color);
        }

        const lastStroke = getLastVisible(node.strokes);
        if (lastStroke) {
          const weight = node.strokeWeight || 1;
          styles.WebkitTextStroke = `${weight}px ${colorString(
            lastStroke.color
          )}`;
        }

        applyFontStyle(styles, node.style);
      }
      break;
  }
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

  const classNameAttr = classNames.length
    ? `className="${classNames.join(' ')}"`
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

function applyLayoutStyles(context: VisitContext) {
  const { styles, bounds, node, parentNode } = context;

  styles.position = 'relative';
  styles.boxSizing = 'border-box';

  // if (node.name === 'header-text') debugger;

  const parentLayoutMode = getLayoutMode(parentNode);

  if (parentLayoutMode) {
    // if (node.name === 'TopTop') debugger;
    styles.flexGrow = node.layoutGrow;
    styles.alignSelf = node.layoutAlign.toLowerCase() as any;

    if (!bounds) throw new Error('parent must be there');
    if (node.layoutAlign === 'STRETCH' && node.layoutGrow === 0) {
      switch (parentLayoutMode) {
        case 'VERTICAL':
          styles.height = bounds.height;
          break;
        case 'HORIZONTAL':
          styles.width = bounds.width;
          break;
      }
    } else {
      styles.width = bounds.width;
      styles.height = bounds.height;
    }
  } else {
    styles.position = 'absolute';
    applyVerticalStyle(context);
    applyHorisontalStyle(context);
  }
}

function applyStyles(context: VisitContext, genContext: GenContext) {
  const { node } = context;
  if (isLayoutableNode(node) && node.layoutMode) {
    applyAutolayoutConstraintsStyle(context);
  }
  // applyHorisontalStyle(context, genContext);
  // applyVerticalStyle(context, genContext);
  applyLayoutStyles(context);

  applyNodeTypeStyle(context, genContext);
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
  const classNames: string[] = [];

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
  classNames: string[];
  // minChildren: ComposableNode[];
  // centerChildren: ComposableNode[];
  // maxChildren: ComposableNode[];
  outFullDir: string;
};

type _WithCursor = { cursor: NodePath<JSXElement> };

export type VisitContextWithCursor = VisitContext & _WithCursor;

// For parentContext of root node
export type EmptyVisitContext = Partial<VisitContext> & _WithCursor;

export function visitNode(
  node: ComposableNode,
  parentContext: VisitContextWithCursor | EmptyVisitContext,
  genContext: GenContext
): VisitContextWithCursor | null {
  const { vectorsMap } = genContext;
  const { node: parentNode, cursor: parentCursor } = parentContext;

  // const parentCursor = parentContext.cursor;
  const context = makeVisitContext(node, parentContext, genContext);

  // TODO: Rethink whether we want this.
  expandChildren(context, 0);

  // if (node?.order != null) {
  //   styles.zIndex = node.order;
  // }

  applyStyles(context, genContext);

  const shouldImportComponent =
    (parentNode &&
      node?.type === 'COMPONENT' &&
      genContext.componentsMap.has(node.id)) ||
    (node?.type === 'INSTANCE' &&
      genContext.componentsMap.has(node.componentId));

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
