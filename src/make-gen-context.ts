import { appendVectorsMap, isComplexPaintRequired } from './append-vectors-map';
import { makeImagesMap } from './make-images-map';
import { Canvas, FigmaFile } from './types';
import { ComposableNode, isVectorTypeNode } from './types/ast';
import { initComponentsMap, isValidComponentNode } from './utils';

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

export async function makeGenContext(
  figmaFile: FigmaFile,
  fileKey: string,
  outDir: string
) {
  // TODO: We should collect all components first to avoid async in visit function.
  const componentsMap = initComponentsMap(figmaFile.components);
  // TODO: Refactor. Call them only if needed.
  const imagesMap = await makeImagesMap(fileKey);
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
    outDir,
  };
}
