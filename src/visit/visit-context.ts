import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { CSSProperties } from 'react';
import { GenContext } from '../make-gen-context';
import { Bound } from '../types';
import { ComposableNode, Rectangle } from '../types/ast';

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
  let outFullDir: string;
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
