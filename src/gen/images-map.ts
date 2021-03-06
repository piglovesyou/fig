import { createWriteStream } from 'fs';
import globby from 'globby';
import makeDir from 'make-dir';
import { extension } from 'mime-types';
import fetch from 'node-fetch';
import pMap from 'p-map';
import { basename, extname, join } from 'path';
import { Subscriber } from 'rxjs';
import { pipeline as _pipeline } from 'stream';
import { promisify } from 'util';
import { makeHeader, requestImages } from '../core/api';
import { getCurr } from '../core/print';
import { GenContext } from '../types/gen';

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
  {
    imagesMap,
    htmlFullDir,
    componentsFullDir,
    pagesFullDir,
    baseFullDir,
    imagesFullDir,
  }: GenContext,
  fileKey: string,
  token: string,
  existingImagesMap: Map<string, string>,
  progress: Subscriber<string>
) {
  // TODO: Refactor. Call them only if needed.
  await makeDir(imagesFullDir);
  const {
    meta: { images },
  } = await requestImages(fileKey, token);
  const imageEntries = Object.entries(images);
  let doneCount = 0;

  await pMap(
    imageEntries,
    async ([key, u]) => {
      const imageUrl = new URL(u);
      const base = basename(imageUrl.pathname);
      const inc = () =>
        progress.next(`${getCurr(++doneCount, imageEntries.length)} ${base}`);

      if (existingImagesMap.has(base)) {
        const imageFullPath = existingImagesMap.get(base)!;
        imagesMap.set(key, imageFullPath);
        inc();
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
      inc();
    },
    // They return "read ECONNRESET" if we step on the gas pedal
    { concurrency: 40 }
  );
  return imagesMap;
}
