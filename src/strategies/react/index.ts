import { transformFromAstSync } from '@babel/core';
import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, JSXElement, Program } from '@babel/types';
import { createHash } from 'crypto';
import { join } from 'path';
import piscina from 'piscina';
import { format } from 'prettier';
import { ComponentInfo, GenContext } from '../../types/gen';
import { StrategyInterface } from '../../types/strategy';
import {
  ParentVisitContext,
  VisitContext,
  VisitContextWithCursor,
} from '../../types/visit';
import { RenderHtmlArgType } from './render-html';
import {
  appendComponentInstanceElement,
  appendElement,
  appendSvgContent,
  appendTextContext,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';
const { Piscina } = piscina;

// new StaticPool({});

function makeHash(s: string | Buffer): string {
  return createHash('sha1').digest('hex');
}

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
      cwd: __dirname,
      babelrc: false,
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-react-jsx',
        '@babel/plugin-transform-typescript',
        // babelPluginTransformReactJsx,
        // babelPluginTransformModulesCommonjs,
        // babelPluginTransformTypescript,
      ],
    })!;

    return [
      [format(tsxCode, { parser: 'babel' }), '.tsx'],
      [format(jsCode!, { parser: 'babel' }), '.js'],
    ];
  }

  async renderHtml(genContext: GenContext, name: string): Promise<string> {
    let {
      pagesFullDir,
      cwd,
      libDir,
      config: { pagesDir },
    } = genContext;

    const thread = new Piscina({
      filename: join(__dirname, 'render-html.js'),
      env: {
        NODE_PATH: join(libDir, 'node_modules'),
      },
    });

    const x = await thread.run({
      pagesFullDir,
      name: this.name,
    } as RenderHtmlArgType);

    return x;

    //     const isLocalModule = libDir.startsWith(cwd);
    //     if (!isLocalModule) {
    //       // If user installs fig with "--global", generated
    //       // react components cannot import "react" and "react-dom".
    //       // To solve it, we force change the import target paths to
    //       // our libDir's subdirectory.
    //       const symlinkFullPath = join(libDir, '.' + makeHash(cwd));
    //       await symlinkDir(cwd, symlinkFullPath);
    //       pagesFullDir = join(symlinkFullPath, pagesDir);
    //     }
    //
    //     const pageComponentModule = await import(
    //       join(pagesFullDir, this.name + '.js')
    //     );
    //     const {
    //       [this.name]: PageComponent,
    //     }: { [key: string]: ComponentType<any> } = pageComponentModule;
    //
    //     const pageHtml = renderToStaticMarkup(
    //       React.createElement(PageComponent, null)
    //     );
    //
    //     const html = `<html>
    // <head>
    // <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    // <style>
    //
    // body {
    //   margin: 0;
    //   padding: 0;
    //   font-family: sans-serif;
    //   position: absolute;
    //   width: 100vw;
    //   min-height: 100vh;
    // }
    //
    // body > * {
    //   overflow: hidden;
    //   min-width: 100vw;
    //   min-height: 100vh;
    // }
    //
    // </style>
    // </head>
    // <body>${pageHtml}</body>
    // </html>`;
    //
    //     return format(html, { parser: 'html' });
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
