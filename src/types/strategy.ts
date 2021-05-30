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
export interface StrategyInterface {
  makeLayout(): NodePath<JSXElement>;
  postWalk(): void;
  render(): [content: string, ext: string][];
  renderHtml(genContext: GenContext): Promise<string>;
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
}

export interface StrategyModule {
  createStrategy: (componentInfo: ComponentInfo) => StrategyInterface;
}
