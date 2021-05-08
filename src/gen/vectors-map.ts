import fetch from 'node-fetch';
import pMap from 'p-map';
import { requestVectors } from '../core/api';
import { ComposableNode, Node, Paint } from '../types/ast';
import { isVectorTypeNode } from '../types/fig';

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
  vectorsMap: Map<string, string>,
  vectorList: string[],
  fileKey: string
): Promise<void> {
  if (!vectorList.length) return;
  const vectorsJson = await requestVectors(fileKey, vectorList);
  if (vectorsJson.images) {
    await pMap(Object.entries(vectorsJson.images), async ([guid, url]) => {
      if (!url) return;
      const rawText = await fetch(url).then((r) => r.text());
      if (!rawText.startsWith('<svg '))
        throw new Error('Figma API is supposed to retgurn <svg>');
      const svgHtml = rawText.replace(
        '<svg ',
        '<svg preserveAspectRatio="none" '
      );
      vectorsMap.set(guid, svgHtml);
    });
  }
}
