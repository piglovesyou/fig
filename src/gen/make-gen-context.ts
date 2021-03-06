import { isAbsolute, join } from 'path';
import { FigConfig } from '../core/config';
import { Canvas, FigmaFile } from '../types/fig';
import { ComponentInfo, GenContext } from '../types/gen';
import { FigPlugin } from '../types/plugin';
import { isValidComponentNode, walkNodeTree } from '../utils/node-utils';
import { appendComponentsMap, ComponentsMap } from './components-map';
import { makeComponentName } from './utils';
import { appendVectorListIfNecessary } from './vectors-map';

export function makePaths(config: FigConfig) {
  const { baseDir } = config;
  const baseFullDir = isAbsolute(baseDir)
    ? baseDir
    : join(process.cwd(), baseDir);
  const componentsFullDir = join(baseFullDir, config.componentsDir);
  const pagesFullDir = join(baseFullDir, config.pagesDir);
  const htmlFullDir = join(baseFullDir, config.htmlDir);
  const imagesFullDir = join(baseFullDir, config.imagesDir);
  return {
    baseFullDir,
    componentsFullDir,
    pagesFullDir,
    htmlFullDir,
    imagesFullDir,
  };
}

export async function makeGenContext(
  figmaFile: FigmaFile,
  fileKey: string,
  config: FigConfig,
  cwd: string
): Promise<GenContext> {
  const paths = makePaths(config);
  const { imagesFullDir } = paths;
  const { token } = config;
  const libDir = join(__dirname, '../..');

  const componentsMap: ComponentsMap = new Map();
  const vectorsMap = new Map<string, string>();
  const imagesMap = new Map<string, string>();

  const vectorsList: string[] = []; // TODO: Use Set

  for (const canvas of figmaFile.document.children as Canvas[])
    for (const screen of canvas.children)
      if (isValidComponentNode(screen)) {
        const val: ComponentInfo = {
          name: makeComponentName(screen),
          node: screen,
        };
        componentsMap.set(screen.id, val);
        walkNodeTree(
          screen,
          (node) => {
            appendComponentsMap(node, componentsMap);
            appendVectorListIfNecessary(node, vectorsList);
          },
          undefined
        );
      }

  const plugins: FigPlugin<unknown>[] = [];

  const genContext: GenContext = {
    componentsMap,
    imagesMap,
    vectorsMap,
    vectorsList,
    config,
    cwd,
    libDir,
    plugins,
    ...paths,
  };

  for (const plugin of config.plugins)
    plugins.push(plugin.createPlugin(genContext));

  return genContext;
}
