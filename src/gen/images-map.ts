import { createWriteStream } from 'fs';
import globby from 'globby';
import makeDir from 'make-dir';
import { extension } from 'mime-types';
import fetch from 'node-fetch';
import pMap from 'p-map';
import { basename, extname, join } from 'path';
import { pipeline } from 'stream/promises';
import { requestImages } from '../core/api';

async function makeExistingFileMap(
  imagesFullDir: string
): Promise<Map<string, string>> {
  const fullPaths = await globby(join(imagesFullDir, '*'));
  const existingFiles = fullPaths.map((fullPath) => {
    const ext = extname(fullPath);
    const base = basename(fullPath, ext);
    return [base, fullPath] as [string, string];
  });
  return new Map(existingFiles);
}

export async function makeImagesMap(
  paths: {
    htmlFullDir: string;
    componentsFullDir: string;
    pagesFullDir: string;
    baseFullDir: string;
    imagesFullDir: string;
  },
  fileKey: string
) {
  // TODO: Refactor. Call them only if needed.
  const { imagesFullDir } = paths;
  const imagesMap = new Map<string, string>();
  await makeDir(imagesFullDir);
  const existingImagesMap = await makeExistingFileMap(imagesFullDir);
  const {
    meta: { images },
  } = await requestImages(fileKey);
  await pMap(Object.entries(images), async ([key, u]) => {
    const imageUrl = new URL(u);
    const base = basename(imageUrl.pathname);
    // When we have cache
    if (existingImagesMap.has(base)) {
      const imageFullPath = existingImagesMap.get(base)!;
      imagesMap.set(key, imageFullPath);
      return;
    }
    const res = await fetch(imageUrl.href);
    const ext = extension(res.headers.get('content-type') || 'bin');
    const imageFullPath = join(imagesFullDir, `${base}.${ext}`);
    imagesMap.set(key, imageFullPath);
    await pipeline(res.body, createWriteStream(imageFullPath));
  });
  return imagesMap;
}
