import { NodePath } from '@babel/traverse';
import { File, JSXElement } from '@babel/types';
import { readFile, writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import { join } from 'path';
import { isValidComponentNode, walkNodeTree } from '../core/node-utils';
import { parseAsRoot } from '../strategies/react/ast-utils';
import { ComponentInfo, GenContext } from '../types/gen';
import { EmptyVisitContext } from '../types/visit';
import { visitNode } from '../visit/visit';

export async function processComponent(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (!isValidComponentNode(node)) throw new Error('never');
  const { strategy } = genContext;
  if (!strategy) throw new Error('Never. Strategy should be instantiated.');

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
    placeholderCursor = strategy.makeLayout(componentInfo);

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

  for (const [content, ext] of strategy.render(componentInfo)) {
    await writeFile(fullBasePath + ext, content);
  }
}
