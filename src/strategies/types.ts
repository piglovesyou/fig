import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { GenContext } from '../gen/make-gen-context';
import {
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../visit/visit-context';

export interface Strategy {
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
    parentContext: VisitContextWithCursor,
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
