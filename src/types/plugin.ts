import { ComponentInfo, GenContext } from './gen';
import {
  EmptyVisitContext,
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from './visit';

type MaybeAsync<R> = R | Promise<R>;

type PerComponentArgs = [componentInfo: ComponentInfo, GenContext: GenContext];

// XXX: Catastrophic. Refactor.
export interface FigPlugin<CursorType> {
  // Per Figma file functions
  dispose?(): void | Promise<void>;

  // Per Component functions
  createLayout?(...args: PerComponentArgs): MaybeAsync<CursorType>;
  postWalkTree?(...args: PerComponentArgs): MaybeAsync<void>;
  render?(
    ...args: PerComponentArgs
  ): MaybeAsync<[content: string, ext: string][]>;
  renderHtml?(...args: PerComponentArgs): MaybeAsync<string>;

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
