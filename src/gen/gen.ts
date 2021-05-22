import { writeFile } from 'fs/promises';
import pMap from 'p-map';
import { requestFile } from '../core/api';
import { FigConfig } from '../core/config';
import { FigmaFile } from '../types/fig';
import { makeGenContext } from './make-gen-context';
import { processComponent } from './process-component';

export async function gen(config: FigConfig) {
  const { fileKeys } = config;
  for (const fileKey of fileKeys) {
    const figmaFile: FigmaFile = await requestFile(fileKey);

    // TODO: for dev
    await writeFile(
      `${process.cwd()}/__tests__/__fixtures/${fileKey}.file.json`,
      JSON.stringify(figmaFile, undefined, 2)
    );

    const genContext = await makeGenContext(figmaFile, fileKey, config);
    const { componentsMap } = genContext;

    await pMap(componentsMap, async ([, componentInfo]) => {
      await processComponent(componentInfo, genContext);
    });
  }
}
