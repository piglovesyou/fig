import makeDir from 'make-dir';
import pMap from 'p-map';
import pReduce from 'p-reduce';
import { join } from 'path';
import { requestFile } from '../core/api';
import { FigConfig } from '../core/config';
import { updateLog, updateLogDone } from '../core/print';
import { FigmaFile } from '../types/fig';
import { ComponentInfo, GenContext } from '../types/gen';
import { FigPlugin } from '../types/plugin';
import { writeFile } from '../utils/fs';
import { appendImagesMap, makeExistingImagesMap } from './images-map';
import { makeGenContext, makePaths } from './make-gen-context';
import { processComponent } from './process-component';
import { appendVectorsMap } from './vectors-map';

export async function processHtml(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (node.type !== 'FRAME')
    throw new Error('Never. node.type should be FRAME');
  const { plugins } = genContext;
  if (!plugins) throw new Error('Never. Plugins should be instantiated.');

  const html = (await pReduce(
    plugins,
    (html, plugin) => {
      return plugin.renderHtml(componentInfo, genContext);
    },
    null as null | ReturnType<FigPlugin<unknown>['renderHtml']>
  ))!;

  await writeFile(join(genContext.htmlFullDir, name + '.html'), html);
}

export async function gen(
  config: FigConfig,
  cwd = process.cwd()
): Promise<void> {
  const { fileKeys, token } = config;
  for (const fileKey of fileKeys) {
    updateLog(`Fetching data of "${fileKey}"..`);
    const figmaFile: FigmaFile = await requestFile(fileKey, token);

    updateLog(`Fetching image resources..`);
    const genContext = await makeGenContext(figmaFile, fileKey, config, cwd);
    const { componentsMap, plugins } = genContext;
    if (!plugins) throw new Error('Never. Plugins should be instantiated.');

    const existingImagesMap = await makeExistingImagesMap(
      genContext.imagesFullDir
    );
    const paths = makePaths(config); // refactor
    await appendImagesMap(
      genContext.imagesMap,
      paths,
      fileKey,
      token,
      existingImagesMap
    );
    await appendVectorsMap(
      paths,
      genContext.vectorsMap,
      genContext.vectorsList,
      fileKey,
      token,
      existingImagesMap
    );

    const components: ComponentInfo[] = [];
    const frames: ComponentInfo[] = [];
    for (const [, componentInfo] of componentsMap) {
      const { node } = componentInfo;
      if (node.type === 'FRAME') frames.push(componentInfo);
      else components.push(componentInfo);
    }

    // Generate components to "./components"
    updateLog(`Generating ${components.length} components..`);
    await pMap(componentsMap, ([, componentInfo]) =>
      processComponent(componentInfo, genContext)
    );

    // Generate components to "./pages"
    updateLog(`Generating ${frames.length} page components..`);
    await pMap(componentsMap, ([, componentInfo]) =>
      processComponent(componentInfo, genContext)
    );

    // Generate html to "./public"
    updateLog(`Generating ${frames.length} HTMLs..`);
    await makeDir(genContext.htmlFullDir);
    await pMap(frames, (componentInfo) => {
      return processHtml(componentInfo, genContext);
    });

    for (const plugin of plugins) await plugin.dispose();

    figmaFile.name;
    updateLog(
      `"${figmaFile.name}" done. ${genContext.imagesMap.size} images, ${components.length} components, ${frames.length} pages and HTMLs are synchronized.`
    );
    updateLogDone();
  }
}
