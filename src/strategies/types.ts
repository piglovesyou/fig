import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { ComponentInfo } from '../gen/components-map';
import { GenContext } from '../gen/make-gen-context';
import {
  EmptyVisitContext,
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../visit/visit-context';

export interface StrategyInterface {
  makeLayout(): NodePath<JSXElement>;
  postWalk(): void;
  render(): string;
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
