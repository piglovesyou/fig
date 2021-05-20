import { writeFile } from 'fs/promises';
import { requestFile } from './api';
import { FigConfig } from './config';
import { makeGenContext } from './make-gen-context';
import { processCanvas } from './process-canvas';
import { Canvas, FigmaFile } from './types';

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

    for (const canvas of figmaFile.document.children as Canvas[])
      await processCanvas(canvas, genContext);
  }
}
