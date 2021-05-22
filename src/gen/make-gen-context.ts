import { isAbsolute, join } from 'path';
import { FigConfig } from '../core/config';
import { isValidComponentNode, walkNodeTree } from '../core/node-utils';
import { Canvas, FigmaFile } from '../types/fig';
import { appendComponentsMap, ComponentsMap } from './components-map';
import { makeImagesMap } from './images-map';
import { appendVectorListIfNecessary, appendVectorsMap } from './vectors-map';

export type GenContext = {
  componentsMap: ComponentsMap;
  imagesMap: Map<string, string>;
  vectorsMap: Map<string, string>;
  config: FigConfig;

  baseFullDir: string;
  componentsFullDir: string;
  pagesFullDir: string;
  htmlFullDir: string;
  imagesFullDir: string;
  // mode: 'generate' | 'edit'
};

function makePaths(config: FigConfig) {
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
  config: FigConfig
): Promise<GenContext> {
  const paths = makePaths(config);

  const componentsMap: ComponentsMap = new Map();
  const vectorsMap = new Map<string, string>();
  const imagesMap = await makeImagesMap(paths, fileKey);

  const vectorList: string[] = []; // TODO: Use Set

  for (const canvas of figmaFile.document.children as Canvas[])
    for (const screen of canvas.children)
      if (isValidComponentNode(screen)) {
        walkNodeTree(
          screen,
          (node) => {
            appendComponentsMap(node, componentsMap);
            appendVectorListIfNecessary(node, vectorList);
          },
          undefined
        );
      }

  await appendVectorsMap(vectorsMap, vectorList, fileKey);

  return {
    componentsMap,
    imagesMap,
    vectorsMap,
    config,
    ...paths,
  };
}
