import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { ComponentInfo, GenContext } from './gen';
import {
  EmptyVisitContext,
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from './visit';

// XXX: Catastrophic. Refactor.
export interface FigPlugin {
  makeLayout(_: ComponentInfo, __: GenContext): NodePath<JSXElement>;
  postWalk(_: ComponentInfo, __: GenContext): void;
  render(_: ComponentInfo, __: GenContext): [content: string, ext: string][];
  renderHtml(_: ComponentInfo, __: GenContext): Promise<string>;

  appendComponentInstanceElement(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    genContext: GenContext
  ): void;
  appendElement(
    context: VisitContext,
    parentContext: EmptyVisitContext
  ): NodePath<JSXElement>;

  appendSvgElement(
    svgHtml: string,
    context: VisitContext,
    parentContext: ParentVisitContext,
    genContext: GenContext
  ): void;
  appendTextElement(
    context: VisitContext,
    parentContext: ParentVisitContext
  ): void;
  dispose(): void | Promise<void>;
}

export interface PluginModule {
  createPlugin: (genContext: GenContext) => FigPlugin;
}
