import { transformFromAstSync } from '@babel/core';
import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, JSXElement, Program } from '@babel/types';
import { join } from 'path';
import Piscina from 'piscina';
import { format } from 'prettier';
import { ComponentInfo, GenContext } from '../../types/gen';
import { FigPlugin } from '../../types/plugin';
import { RenderHtmlArgType } from './render-html';
import {
  appendComponentInstanceElement,
  appendElement,
  appendSvgElement,
  appendTextElement,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';

function findReactResolvablePath(): string | never {
  const reactPath = require.resolve('react');
  for (const nodePath of require.resolve.paths('react') || [])
    if (reactPath.startsWith(nodePath)) return nodePath;
  throw new Error(`Never. Couldn't find react resolvable path.`);
}

export function createPlugin(genContext: GenContext): FigPlugin {
  let cursor: NodePath<JSXElement> | null = null;

  // The reason using thread is to set NODE_PATH value, otherwise
  // components can't resolve "react" and "react-dom".
  const renderHtmlThread = new Piscina({
    maxQueue: 'auto',
    filename: join(__dirname, '../../../dist/plugins/react/render-html.js'),
    env: {
      NODE_PATH: findReactResolvablePath(),
    },
  });

  // return new ReactPlugin(genContext);
  return {
    makeLayout({ name }: ComponentInfo) {
      return (cursor = makeLayout(name));
    },

    postWalk() {
      if (!cursor)
        throw new Error(`Never. placeholderCursor must be set on postWalk() `);
      erasePlaceholderElement(cursor);
    },

    render(): [content: string, ext: string][] {
      if (!cursor) throw new Error(`Never. cursor must be set on render().`);
      const program: NodePath<Program> = cursor.findParent((path) =>
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
        ],
      })!;

      return [
        [format(tsxCode, { parser: 'babel' }), '.tsx'],
        [format(jsCode!, { parser: 'babel' }), '.js'],
      ];
    },

    async renderHtml(componentInfo: ComponentInfo): Promise<string> {
      const { name } = componentInfo;
      let { pagesFullDir } = genContext;

      return await renderHtmlThread.run({
        pagesFullDir,
        name,
      } as RenderHtmlArgType);
    },

    appendComponentInstanceElement,

    appendElement,

    appendSvgElement,

    appendTextElement,

    dispose(): Promise<void> {
      return renderHtmlThread.destroy();
    },
  } as FigPlugin;
}
