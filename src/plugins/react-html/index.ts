import { transformFromAstSync } from '@babel/core';
import { NodePath } from '@babel/traverse';
import { isProgram, Program } from '@babel/types';
import { join } from 'path';
import Piscina from 'piscina';
import { format } from 'prettier';
import { GenContext } from '../../types/gen';
import { FigPlugin } from '../../types/plugin';
import { ReactCursorType } from '../react/types';
import { RenderHtmlArgType } from './render-html';

function findReactResolvablePath(): string | never {
  const reactPath = require.resolve('react');
  for (const nodePath of require.resolve.paths('react') || [])
    if (reactPath.startsWith(nodePath)) return nodePath;
  throw new Error(`Never. Couldn't find react resolvable path.`);
}

export function createPlugin(
  genContext: GenContext
): FigPlugin<ReactCursorType> {
  // The reason using thread is to set NODE_PATH value, otherwise
  // components can't resolve "react" and "react-dom".
  const renderHtmlThread = new Piscina({
    maxQueue: 'auto',
    filename: join(
      __dirname,
      '../../../dist/plugins/react-html/render-html.js'
    ),
    env: {
      NODE_PATH: findReactResolvablePath(),
    },
  });
  return {
    componentFileExtension: 'js',

    renderComponent(rootCursor) {
      const program = rootCursor.findParent((path) =>
        isProgram(path.node)
      )! as NodePath<Program>;

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

      return format(jsCode!, { parser: 'babel' });
    },

    async renderHtml(componentInfo) {
      const { name } = componentInfo;
      let { pagesFullDir } = genContext;

      return await renderHtmlThread.run({
        pagesFullDir,
        name,
      } as RenderHtmlArgType);
    },

    dispose() {
      return renderHtmlThread.destroy();
    },
  };
}
