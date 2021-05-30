import { transformFromAstSync } from '@babel/core';
import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, JSXElement, Program } from '@babel/types';
import { join } from 'path';
import { format } from 'prettier';
import React, { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ComponentInfo, GenContext } from '../../types/gen';
import { StrategyInterface } from '../../types/strategy';
import {
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../../types/visit';
import {
  appendComponentInstanceElement,
  appendElement,
  appendSvgContent,
  appendTextContext,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';

class ReactStrategy implements StrategyInterface {
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

  render(): [content: string, ext: string][] {
    if (!this.cursor) throw new Error(`Never. cursor must be set on render().`);
    const program: NodePath<Program> = this.cursor.findParent((path) =>
      isProgram(path.node)
    )! as NodePath<Program>;

    const { code: tsxCode } = generate(program.node);
    const { code: jsCode } = transformFromAstSync(program.node, undefined, {
      filename: 'a.tsx',
      babelrc: false,
      plugins: ['@babel/plugin-transform-typescript'],
    })!;

    return [
      [format(tsxCode, { parser: 'babel' }), '.tsx'],
      [format(jsCode!, { parser: 'babel' }), '.js'],
    ];
  }

  async renderHtml(genContext: GenContext): Promise<string> {
    const { pagesFullDir } = genContext;
    const pageComponentModule = await import(join(pagesFullDir, this.name));
    const {
      [this.name]: PageComponent,
    }: { [key: string]: ComponentType<any> } = pageComponentModule;

    const pageHtml = renderToStaticMarkup(
      React.createElement(PageComponent, null)
    );

    return `<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<style>
  
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  position: absolute;
  width: 100vw;
  min-height: 100vh;
}

body > * {
  overflow: hidden;
  min-width: 100vw;
  min-height: 100vh;
}

</style>
</head>
<body>${pageHtml}</body>
</html>`;
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

export function createStrategy(componentInfo: ComponentInfo): ReactStrategy {
  return new ReactStrategy(componentInfo);
}
