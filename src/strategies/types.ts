import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { GenContext } from '../make-gen-context';
import {
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../visit/visit-context';

export interface Strategy {
  makeLayout(): NodePath<JSXElement>;
  postWalk(): void;
  render(): string;
  appendComponentInstance(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    genContext: GenContext
  ): void;
  appendElement(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    tagName?: string
  ): NodePath<JSXElement>;
  appendSvgContent(
    context: VisitContext,
    parentContext: ParentVisitContext,
    svgHtml: string
  ): void;
  appendTextContent(
    context: VisitContext,
    parentContext: ParentVisitContext
  ): void;
}
