import { ComponentInfo, GenContext } from './gen';
import {
  EmptyVisitContext,
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from './visit';

type Args<CursorType> = [
  context: VisitContext,
  parentContext: VisitContextWithCursor<CursorType>,
  genContext: GenContext
];

// XXX: Catastrophic. Refactor.
export interface FigPlugin<CursorType> {
  createLayout?(_: ComponentInfo, __: GenContext): CursorType;
  postWalkTree?(_: ComponentInfo, __: GenContext): void;
  render?(_: ComponentInfo, __: GenContext): [content: string, ext: string][];
  renderHtml?(_: ComponentInfo, __: GenContext): Promise<string>;

  appendComponentInstanceElement?(...args: Args<CursorType>): void;
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
  dispose?(): void | Promise<void>;
}

export interface PluginModule<CursorType = unknown> {
  createPlugin: (genContext: GenContext) => FigPlugin<CursorType>;
}
