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
import { appendJsxNode, parseExpression } from './jsx-utils';
import {
  appendElement,
  appendImportDeclaration,
  appendTextContext,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';

function appendSvgContent(
  context: VisitContext,
  parentContext: ParentVisitContext,
  svgHtml: string
) {
  const cursor = appendElement(context, parentContext, 'div');

  // Use dangerous SVG instead of building DOM
  appendJsxNode(
    cursor,
    parseExpression<JSXElement>(
      `<div className="vector" dangerouslySetInnerHTML={{__html: \`${svgHtml}\`}} />`
    )
  );
}

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

  appendComponentInstance(
    context: VisitContext,
    parentContext: VisitContextWithCursor,
    genContext: GenContext
  ): void {
    const { node } = context;
    const { cursor: parentCursor } = parentContext;
    const componentInfo = genContext.componentsMap.get(
      node.type === 'INSTANCE' ? node.componentId : node.id
    );
    if (!componentInfo)
      throw new Error('Never. It should appear in componentsMap.');
    const componentName = componentInfo.name;

    appendImportDeclaration(parentCursor, context, genContext, componentName);
    appendElement(context, parentContext, componentName);
  }

  appendElement(
    context: VisitContext,
    parentContext: ParentVisitContext,
    tagName: string = 'div'
  ): NodePath<JSXElement> {
    return appendElement(context, parentContext, tagName);
  }

  appendSvgContent(
    context: VisitContext,
    parentContext: ParentVisitContext,
    svgHtml: string
  ): void {
    appendSvgContent.call(this, context, parentContext, svgHtml);
  }

  appendTextContent(context: VisitContext, parentContext: ParentVisitContext) {
    const { node } = context;
    if (node.type !== 'TEXT')
      throw new Error(`Never. This function is supposed to emit on TEXT node.`);
    appendTextContext(context, parentContext);
  }
}

export {};
