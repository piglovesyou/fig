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

type _WithCursor<CursorType> = { cursor: CursorType };

export type VisitContextWithCursor<CursorType> = VisitContext &
  _WithCursor<CursorType>;

// For parentContext of root node
export type EmptyVisitContext<CursorType> = Partial<VisitContext> &
  _WithCursor<CursorType>;

export type ParentVisitContext<CursorType> =
  | VisitContextWithCursor<CursorType>
  | EmptyVisitContext<CursorType>;
