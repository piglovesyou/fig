import { writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import pMap from 'p-map';
import { join } from 'path';
import { requestFile } from '../core/api';
import { FigConfig } from '../core/config';
import { FigmaFile } from '../types/fig';
import { ComponentInfo, GenContext } from '../types/gen';
import { makeGenContext } from './make-gen-context';
import { processComponent } from './process-component';

export async function processHtml(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (node.type !== 'FRAME') return;
  const { strategy } = genContext;
  if (!strategy) throw new Error('Never. Strategy should be instantiated.');

  const html = await strategy.renderHtml(componentInfo);

  await writeFile(join(genContext.htmlFullDir, name + '.html'), html);
}

export async function gen(
  config: FigConfig,
  cwd = process.cwd()
): Promise<void> {
  const { fileKeys, token } = config;
  for (const fileKey of fileKeys) {
    const figmaFile: FigmaFile = await requestFile(fileKey, token);

    const genContext = await makeGenContext(figmaFile, fileKey, config, cwd);
    const { componentsMap, strategy } = genContext;
    if (!strategy) throw new Error('Never. Strategy should be instantiated.');

    // Generate components to "./components" and "./pages"
    await pMap(componentsMap, ([, componentInfo]) =>
      processComponent(componentInfo, genContext)
    );

    // Generate html to "./public"
    await makeDir(genContext.htmlFullDir);
    await pMap(componentsMap, ([, componentInfo]) =>
      processHtml(componentInfo, genContext)
    );

    await strategy.dispose();
  }
}
