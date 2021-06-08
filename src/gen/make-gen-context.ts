import { isAbsolute, join } from 'path';
import { FigConfig } from '../core/config';
import { isValidComponentNode, walkNodeTree } from '../core/node-utils';
import { Canvas, FigmaFile } from '../types/fig';
import { ComponentInfo, GenContext } from '../types/gen';
import { appendComponentsMap, ComponentsMap } from './components-map';
import { makeExistingImagesMap, makeImagesMap } from './images-map';
import { makeComponentName } from './utils';
import { appendVectorListIfNecessary, appendVectorsMap } from './vectors-map';

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
  config: FigConfig,
  cwd: string
): Promise<GenContext> {
  const paths = makePaths(config);
  const { imagesFullDir } = paths;
  const { token } = config;
  const libDir = join(__dirname, '../..');

  const componentsMap: ComponentsMap = new Map();
  const vectorsMap = new Map<string, string>();

  const existingImagesMap = await makeExistingImagesMap(imagesFullDir);
  const imagesMap = await makeImagesMap(
    paths,
    fileKey,
    token,
    existingImagesMap
  );

  const vectorList: string[] = []; // TODO: Use Set

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
            appendVectorListIfNecessary(node, vectorList);
          },
          undefined
        );
      }

  await appendVectorsMap(
    paths,
    vectorsMap,
    vectorList,
    fileKey,
    token,
    existingImagesMap
  );

  const genContext: GenContext = {
    componentsMap,
    imagesMap,
    vectorsMap,
    config,
    cwd,
    libDir,
    ...paths,
  };
  const {
    strategy: { createStrategy },
  } = config;
  const strategy = createStrategy(genContext);

  return { ...genContext, strategy };
}
