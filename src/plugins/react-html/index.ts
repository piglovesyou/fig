import { join } from 'path';
import Piscina from 'piscina';
import { ComponentInfo, GenContext } from '../../types/gen';
import { FigPlugin } from '../../types/plugin';
import { RenderHtmlArgType } from '../react/render-html';
import { ReactCursorType } from '../react/types';

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
    filename: join(__dirname, '../../../dist/plugins/react/render-html.js'),
    env: {
      NODE_PATH: findReactResolvablePath(),
    },
  });
  return {
    async renderHtml(componentInfo: ComponentInfo): Promise<string> {
      const { name } = componentInfo;
      let { pagesFullDir } = genContext;

      return await renderHtmlThread.run({
        pagesFullDir,
        name,
      } as RenderHtmlArgType);
    },

    dispose(): Promise<void> {
      return renderHtmlThread.destroy();
    },
  };
}
