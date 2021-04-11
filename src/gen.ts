import { writeFile } from 'fs/promises';
import { requestFile } from './api';
import { makeGenContext } from './make-gen-context';
import { processCanvas } from './process-canvas';
import { Canvas, FigmaFile } from './types';

export async function gen(outDir: string, fileKey: string) {
  const figmaFile: FigmaFile = await requestFile(fileKey);

  // TODO: for dev
  await writeFile(
    `${__dirname}/__fixtures/${fileKey}.file.json`,
    JSON.stringify(figmaFile, undefined, 2)
  );
  const genContext = await makeGenContext(figmaFile, fileKey, outDir);

  for (const canvas of figmaFile.document.children as Canvas[])
    await processCanvas(canvas, genContext);
}
