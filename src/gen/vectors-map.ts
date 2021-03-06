import fetch from 'node-fetch';
import pMap from 'p-map';
import { basename, join } from 'path';
import { Subscriber } from 'rxjs';
import { makeHeader, requestVectors } from '../core/api';
import { getCurr } from '../core/print';
import { ComposableNode, Node, Paint } from '../types/ast';
import { isVectorTypeNode } from '../types/fig';
import { GenContext } from '../types/gen';
import { readFile, writeFile } from '../utils/fs';

function paintsRequireRender(paints: Paint[]) {
  if (!paints) return false;
  let numPaints = 0;
  for (const paint of paints) {
    if (paint.visible === false) continue;
    numPaints++;
    if (paint.type === 'EMOJI') return true;
  }
  return numPaints > 1;
}

function isVisible(child: Node) {
  return child.visible;
}

export function isComplexPaintRequired(node: ComposableNode) {
  const v = node as Node<'VECTOR'>;
  if (paintsRequireRender(v.fills)) return true;
  if (paintsRequireRender(v.strokes)) return true;
  if (v.blendMode && !['PASS_THROUGH', 'NORMAL'].includes(v.blendMode))
    return true;
  return false;
}

export function appendVectorIds(
  vectorList: string[],
  node: ComposableNode
): void {
  // I don't understand when I need this.
  // let vectorsOnly = !node.name.startsWith('#');
  // let vectorVConstraint: null | ConstraintType = null;
  // let vectorHConstraint: null | ConstraintType = null;
  //
  // if (node.children) {
  //   const children = (node.children = node.children.filter(
  //     (child) => child.visible !== false
  //   ));
  //   for (const item of children) {
  //     if (isVectorLike(item)) {
  //       if (
  //         vectorVConstraint != null &&
  //         item.constraints.vertical != vectorVConstraint
  //       )
  //         vectorsOnly = false;
  //       if (
  //         vectorHConstraint != null &&
  //         item.constraints.horizontal != vectorHConstraint
  //       )
  //         vectorsOnly = false;
  //       vectorVConstraint = item.constraints.vertical;
  //       vectorHConstraint = item.constraints.horizontal;
  //     } else {
  //       vectorsOnly = false;
  //     }
  //   }
  //
  //   if (children.length && vectorsOnly) {
  //     node.type = 'VECTOR';
  //     if (vectorVConstraint && vectorHConstraint) {
  //       node.constraints = {
  //         vertical: vectorVConstraint,
  //         horizontal: vectorHConstraint,
  //       };
  //     }
  //   }
  // }

  // If it's complex to draw by DOM, use SVG
  if (isVectorTypeNode(node) || isComplexPaintRequired(node)) {
    vectorList.push(node.id);
    return;
  }

  if (node.children) {
    for (const child of node.children) {
      appendVectorIds(vectorList, child);
    }
  }
}

export function appendVectorListIfNecessary(
  node: ComposableNode,
  vectorList: string[]
) {
  // If it's complex to draw by DOM, use SVG
  if (isVectorTypeNode(node) || isComplexPaintRequired(node)) {
    vectorList.push(node.id);
  }
}

export async function appendVectorsMap(
  {
    htmlFullDir,
    componentsFullDir,
    pagesFullDir,
    baseFullDir,
    imagesFullDir,
    vectorsMap,
    vectorsList,
  }: GenContext,
  fileKey: string,
  token: string,
  existingImagesMap: Map<string, string>,
  progress: Subscriber<string>
): Promise<void> {
  if (!vectorsList.length) return;
  const vectors = await requestVectors(fileKey, vectorsList, token, progress);
  if (vectors) {
    let doneCount = 0;
    const vectorEntries = Object.entries(vectors);
    await pMap(
      vectorEntries,
      async ([guid, url]) => {
        if (!url) return;

        const base = basename(url);
        const fileName = `${base}.svg`;
        const inc = () =>
          progress.next(
            `${getCurr(++doneCount, vectorEntries.length)} ${fileName}`
          );

        if (existingImagesMap.has(base)) {
          const svgFullPath = existingImagesMap.get(base)!;
          const svgContent = await readFile(svgFullPath, 'utf-8');
          vectorsMap.set(guid, svgContent);
          inc();
          return;
        }
        const rawText = await fetch(url, { headers: makeHeader() })
          .then((r) => r.text())
          .catch((r) => {
            console.error(r);
            console.error(new Error(r.message));
            vectorsMap.set(guid, 'error');
          });
        if (!rawText) return;
        if (!rawText.length) {
          // It can be an empty string
          return vectorsMap.set(guid, rawText);
        }
        if (!rawText.startsWith('<svg '))
          throw new Error('Figma API is supposed to retgurn <svg>');
        const svgHtml = rawText.replace(
          '<svg ',
          '<svg preserveAspectRatio="none" '
        );
        const imageFullPath = join(imagesFullDir, fileName);
        await writeFile(imageFullPath, svgHtml);
        vectorsMap.set(guid, svgHtml);
        inc();
      },
      { concurrency: 40 }
    );
  }
}
