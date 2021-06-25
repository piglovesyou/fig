import { ComponentInfo, GenContext } from './gen';
import {
  EmptyVisitContext,
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from './visit';

type MaybeAsync<R> = R | Promise<R>;

type PerComponentArgs<CursorType> = [
  firstCursor: CursorType,
  componentInfo: ComponentInfo,
  GenContext: GenContext
];

// XXX: Catastrophic. Refactor.
export interface FigPlugin<CursorType> {
  // Per Figma file members and functions
  dispose?(): void | Promise<void>;
  componentFileExtension?: string;

  // Per Component functions
  createLayout?(...args: PerComponentArgs<CursorType>): MaybeAsync<CursorType>;
  postWalkTree?(...args: PerComponentArgs<CursorType>): MaybeAsync<void>;
  renderComponent?(...args: PerComponentArgs<CursorType>): MaybeAsync<string>;
  renderHtml?(
    componentInfo: ComponentInfo,
    GenContext: GenContext
  ): MaybeAsync<string>;

  // Per Node functions
  appendComponentInstanceElement?(
    context: VisitContext,
    parentContext: VisitContextWithCursor<CursorType>,
    genContext: GenContext
  ): void;
  appendElement?(
    context: VisitContext,
    parentContext: EmptyVisitContext<CursorType>,
    genContext: GenContext
  ): CursorType;
  appendSvgElement?(
    context: VisitContext,
    parentContext: ParentVisitContext<CursorType>,
    genContext: GenContext,
    svgHtml: string
  ): void;
  appendTextElement?(
    context: VisitContext,
    parentContext: ParentVisitContext<CursorType>,
    genContext: GenContext
  ): void;
}

export interface PluginModule<CursorType = unknown> {
  createPlugin: (genContext: GenContext) => FigPlugin<CursorType>;
}
