import { writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import pMap from 'p-map';
import { join } from 'path';
import { requestFile } from '../core/api';
import { FigConfig } from '../core/config';
import { FigmaFile } from '../types/fig';
import { ComponentInfo, GenContext } from '../types/gen';
import { StrategyInterface } from '../types/strategy';
import { makeGenContext } from './make-gen-context';
import { processComponent } from './process-component';

// async function registerTsNodeIfPossible() {
//   try {
//     const tsNode = await import('ts-node');
//     tsNode.register({ transpileOnly: true });
//     return true;
//   } catch (e) {}
//   return false;
// }

export async function processHtml(
  strategy: StrategyInterface,
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (node.type !== 'FRAME') return;
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
    const {
      componentsMap,
      config: {
        strategy: { createStrategy },
      },
      strategy,
    } = genContext;

    // Generate components to "components" and "pages"
    const result = await pMap(componentsMap, async ([, componentInfo]) => {
      // TODO: Strategy for genContext, not for components. Are you crazy?
      await processComponent(componentInfo, genContext);
      return [componentInfo, strategy] as [ComponentInfo, StrategyInterface];
    });

    // Generate html to "./public"
    await makeDir(genContext.htmlFullDir);
    await pMap(result, async ([componentInfo, strategy]) => {
      await processHtml(strategy, componentInfo, genContext);
    });
  }
}
