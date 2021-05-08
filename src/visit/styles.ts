import { relative } from 'path';
import { CSSProperties } from 'react';
import {
  backgroundSize,
  colorString,
  dropShadow,
  getLastVisible,
  innerShadow,
  paintToLinearGradient,
  paintToRadialGradient,
} from '../core/style-utils';
import {
  ComposableNode,
  EffectShadow,
  isLayoutableNode,
  Node,
  TypeStyle,
} from '../types/ast';
import { GenContext } from '../types/gen';
import { VisitContext } from '../types/visit';

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

function getLayoutMode(node: ComposableNode | null) {
  return node && (node as Node<'FRAME'>).layoutMode;
}

export function applyFontStyle(styles: CSSProperties, fontStyle: TypeStyle) {
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

export function applyStyles(context: VisitContext, genContext: GenContext) {
  const { node } = context;
  if (isLayoutableNode(node) && node.layoutMode) {
    applyAutolayoutConstraintsStyle(context);
  }

  applyLayoutStyles(context);

  applyNodeTypeStyle(context, genContext);
}
