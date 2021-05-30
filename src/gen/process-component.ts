import { NodePath } from '@babel/traverse';
import { File, JSXElement } from '@babel/types';
import { readFile, writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import { join } from 'path';
import { isValidComponentNode, walkNodeTree } from '../core/node-utils';
import { parseAsRoot } from '../strategies/react/ast-utils';
import { ComponentInfo, GenContext } from '../types/gen';
import { StrategyInterface } from '../types/strategy';
import { EmptyVisitContext } from '../types/visit';
import { visitNode } from '../visit/visit';

export async function processComponent(
  strategy: StrategyInterface,
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (!isValidComponentNode(node)) throw new Error('never');

  const { baseFullDir } = genContext;
  const componetsDir = join(
    baseFullDir,
    node.type === 'FRAME'
      ? genContext.config.pagesDir
      : genContext.config.componentsDir
  );
  await makeDir(componetsDir);
  const fullBasePath = join(componetsDir, name);

  let rootAst: File;
  let placeholderCursor: NodePath<JSXElement>;

  if (false /*existsSync(fullBasePath)*/) {
    // TODO: Update mode.
    // 1. Parse and get the File ast
    // 2. Find the root element to update
    // 3. Repeat update and traverse
    const content = await readFile(fullBasePath + '.tsx', 'utf-8');
    rootAst = parseAsRoot(content);
    throw new Error('Implement');
  } else {
    // Create mode.
    placeholderCursor = strategy.makeLayout();

    const parentContext: EmptyVisitContext = { cursor: placeholderCursor };
    walkNodeTree(
      node,
      (node, parentContext) => {
        return visitNode(node, parentContext, strategy, genContext);
      },
      parentContext
    );
    strategy.postWalk();
  }

  await writeFile(fullBasePath + '.tsx', strategy.render());
}

// // TODO: Similar to preprocess. Refactor
// export async function processCanvas(
//   canvas: Canvas,
//   genContext: GenContext
// ): Promise<void> {
//   for (const screen of canvas.children) {
//     if (isValidComponentNode(screen))
//       await processComponent(screen, genContext);
//   }
// }
