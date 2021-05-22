import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { ComposableNode } from './ast';
import { Bound } from './fig';

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

export type ParentVisitContext = VisitContextWithCursor | EmptyVisitContext;
