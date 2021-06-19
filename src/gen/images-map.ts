import { createWriteStream } from 'fs';
import globby from 'globby';
import makeDir from 'make-dir';
import { extension } from 'mime-types';
import fetch from 'node-fetch';
import pMap from 'p-map';
import { basename, extname, join } from 'path';
import { pipeline as _pipeline } from 'stream';
import { promisify } from 'util';
import { makeHeader, requestImages } from '../core/api';
import { updateLog } from '../core/print';

const pipeline = promisify(_pipeline);

export async function makeExistingImagesMap(
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

export async function appendImagesMap(
  imagesMap: Map<string, string>,
  paths: {
    htmlFullDir: string;
    componentsFullDir: string;
    pagesFullDir: string;
    baseFullDir: string;
    imagesFullDir: string;
  },
  fileKey: string,
  token: string,
  existingImagesMap: Map<string, string>
) {
  // TODO: Refactor. Call them only if needed.
  const { imagesFullDir } = paths;
  await makeDir(imagesFullDir);
  const {
    meta: { images },
  } = await requestImages(fileKey, token);
  const imageEntries = Object.entries(images);
  let doneCount = 0;

  await pMap(
    imageEntries,
    async ([key, u]) => {
      updateLog(`Fetching images ${++doneCount}/${imageEntries.length}..`);
      const imageUrl = new URL(u);
      const base = basename(imageUrl.pathname);
      if (existingImagesMap.has(base)) {
        const imageFullPath = existingImagesMap.get(base)!;
        imagesMap.set(key, imageFullPath);
        return;
      }
      const res = await fetch(imageUrl.href, { headers: makeHeader() }).catch(
        (reason) => {
          console.error(reason);
        }
      );
      if (!res) return;
      const ext = extension(res.headers.get('content-type') || 'bin');
      const imageFullPath = join(imagesFullDir, `${base}.${ext}`);
      imagesMap.set(key, imageFullPath);
      await pipeline(res.body, createWriteStream(imageFullPath));
    },
    // They return "read ECONNRESET" if we step on the gas pedal
    { concurrency: 50 }
  );
  return imagesMap;
}
