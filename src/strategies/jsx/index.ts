import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, JSXElement, Program } from '@babel/types';
import { format } from 'prettier';
import { GenContext } from '../../make-gen-context';
import { ComponentInfo } from '../../utils';
import {
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../../visit/visit-context';
import { Strategy } from '../types';
import {
  appendComponentInstanceElement,
  appendElement,
  appendSvgContent,
  appendTextContext,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';

export class JsxStrategy implements Strategy {
  fid: string;
  name: string;

  // rootNode: Node | undefined;
  cursor: NodePath<JSXElement> | undefined;

  constructor({ node, name }: ComponentInfo) {
    this.fid = node.id;
    this.name = name;
  }

  makeLayout() {
    const cursor = makeLayout(this.name);
    if (!cursor) throw new Error('should be found');
    this.cursor = cursor;
    return cursor;
  }

  postWalk() {
    if (!this.cursor)
      throw new Error(`Never. placeholderCursor must be set on postWalk() `);
    erasePlaceholderElement(this.cursor);
  }

  render() {
    if (!this.cursor) throw new Error(`Never. cursor must be set on render().`);
    const program: NodePath<Program> = this.cursor.findParent((path) =>
      isProgram(path.node)
    )! as NodePath<Program>;
    return format(generate(program.node).code, { parser: 'babel' });
  }

  appendComponentInstanceElement(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    genContext: GenContext
  ): void {
    appendComponentInstanceElement(context, parentContext, genContext);
  }

  appendElement(
    context: VisitContext,
    parentContext: ParentVisitContext,
    tagName: string = 'div'
  ): NodePath<JSXElement> {
    return appendElement(context, parentContext, tagName);
  }

  appendSvgElement(
    context: VisitContext,
    parentContext: ParentVisitContext,
    svgHtml: string
  ): void {
    appendSvgContent(context, parentContext, svgHtml);
  }

  appendTextElement(
    context: VisitContext,
    parentContext: ParentVisitContext
  ): void {
    const { node } = context;
    if (node.type !== 'TEXT')
      throw new Error(`Never. This function is supposed to emit on TEXT node.`);
    appendTextContext(context, parentContext);
  }
}

export {};
