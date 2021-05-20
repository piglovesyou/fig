import { createWriteStream } from 'fs';
import globby from 'globby';
import makeDir from 'make-dir';
import { extension } from 'mime-types';
import fetch from 'node-fetch';
import pMap from 'p-map';
import { basename, extname, isAbsolute, join } from 'path';
import { pipeline } from 'stream/promises';
import { requestImages } from './api';
import { appendVectorsMap, isComplexPaintRequired } from './append-vectors-map';
import { FigConfig } from './config';
import { Canvas, FigmaFile } from './types';
import { ComposableNode, isVectorTypeNode } from './types/ast';
import {
  ComponentsMap,
  initComponentsMap,
  isValidComponentNode,
} from './utils';

// TODO: Use it for "visitNode" too
function walkNodeTree(
  node: ComposableNode,
  fn: (node: ComposableNode) => void
): void {
  fn(node);
  for (const child of node.children || []) {
    walkNodeTree(child, fn);
  }
}

function appendVectorList(node: ComposableNode, vectorList: string[]) {
  // If it's complex to draw by DOM, use SVG
  if (isVectorTypeNode(node) || isComplexPaintRequired(node)) {
    vectorList.push(node.id);
  }
}

function removeFromZombieCandidates(
  zombieComponentCandidates: Set<string>,
  node: ComposableNode
) {
  if (node.type === 'COMPONENT') zombieComponentCandidates.delete(node.id);
}

export type GenContext = {
  componentsMap: ComponentsMap;
  imagesMap: Map<string, string>;
  vectorsMap: Map<string, string>;
  config: FigConfig;

  baseFullDir: string;
  componentsFullDir: string;
  pagesFullDir: string;
  htmlFullDir: string;
  imagesFullDir: string;
  // mode: 'generate' | 'edit'
};

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

export async function makeGenContext(
  figmaFile: FigmaFile,
  fileKey: string,
  config: FigConfig
): Promise<GenContext> {
  const paths = makePaths(config);

  // TODO: We should collect all components first to avoid async in visit function.
  const componentsMap = initComponentsMap(figmaFile.components);

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
  // for (const [key, u] of ) {
  //   const imageUrl = new URL(u);
  //   const base = basename(imageUrl.pathname);
  //   // We need header to know file extension
  //   const res = await fetch(imageUrl.href);
  //   const ext = extension(res.headers.get('content-type') || 'bin');
  //   const imageFullPath = join(imagesFullDir, `${base}.${ext}`);
  //   imagesMap.set(key, imageFullPath);
  //   if (existsSync(imageFullPath)) continue;
  //   await pipeline(res.body, createWriteStream(imageFullPath));
  // }

  const vectorsMap = new Map<string, string>();

  const vectorList: string[] = []; // TODO: Use Set
  // Some component can be listed in figmaFile.components but no node in the tree.
  // To avoid making instance orphan, we clean them up first.
  const zombieComponentCandidates = new Set<string>(
    Array.from(componentsMap).map(([id]) => id)
  );

  for (const canvas of figmaFile.document.children as Canvas[])
    for (const screen of canvas.children)
      if (isValidComponentNode(screen)) {
        walkNodeTree(screen, (node) => {
          // if (node.name.includes('shopping-bag')) debugger;
          appendVectorList(node, vectorList);
          removeFromZombieCandidates(zombieComponentCandidates, node);
        });
      }

  await appendVectorsMap(vectorsMap, vectorList, fileKey);

  for (const zombieId of zombieComponentCandidates) {
    // We found zombies that should not appear in componentsMap. Clean them up.
    // Don't worry the components, the first instance will create the component file.
    componentsMap.delete(zombieId);
  }
  return {
    componentsMap,
    imagesMap,
    vectorsMap,
    config,
    ...paths,
  };
}
