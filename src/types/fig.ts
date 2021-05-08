export * from './ast';
import { ComposableNode, Node as _Node } from './ast';

export interface FigmaFile {
  document: Document;
  components: Record<string, ComponentRef>;
  schemaVersion: number;
  styles: Styles;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
}

export type Document = _Node<'DOCUMENT'> & {
  children: Canvas[];
};

export type Canvas = _Node<'CANVAS'> & {
  children: ComposableNode[];
};

// type MetaProps = {
//   asVector?: boolean;
//   // children?: PrimitiveNode[];
// };

// export type ComposableNode =
//   MetaProps & {
//     children: ComposableNode;
//   };

// DOCUMENT
// CANVAS
// FRAME
// GROUP
// VECTOR
// BOOLEAN
// BOOLEAN_OPERATION
// STAR
// LINE
// ELLIPSE
// REGULAR_POLYGON
// RECTANGLE
// TEXT
// SLICE
// COMPONENT
// INSTANCE

export interface PrototypeDevice {
  type: string;
  rotation: string;
}

export interface ComponentRef {
  key: string;
  name: string;
  description: string;
}

export interface Styles {}

export interface Bound {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}
