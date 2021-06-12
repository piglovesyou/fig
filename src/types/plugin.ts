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
  makeLayout(_: ComponentInfo): NodePath<JSXElement>;
  postWalk(): void;
  render(_: ComponentInfo): [content: string, ext: string][];
  renderHtml(_: ComponentInfo): Promise<string>;
  appendComponentInstanceElement(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    genContext: GenContext
  ): void;
  appendElement(
    context: VisitContext,
    parentContext: EmptyVisitContext,
    tagName?: string
  ): NodePath<JSXElement>;
  appendSvgElement(
    context: VisitContext,
    parentContext: ParentVisitContext,
    svgHtml: string
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
