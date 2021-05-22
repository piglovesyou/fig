import { NodePath } from '@babel/traverse';
import { File, JSXElement } from '@babel/types';
import { readFile, writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import { join } from 'path';
import { GenContext } from './make-gen-context';
import { JsxComponentStrategy } from './strategies/jsx';
import { parseAsRoot } from './strategies/jsx/make-ast';
import { ComponentInfo, isValidComponentNode, walkNodeTree } from './utils';
import { visitNode } from './visit';
import { EmptyVisitContext } from './visit/visit-context';

export async function processComponent(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (!isValidComponentNode(node)) throw new Error('never');

  const strategy = new JsxComponentStrategy(componentInfo);

  const { baseFullDir } = genContext;
  const componetsDir = join(
    baseFullDir,
    node.type === 'FRAME'
      ? genContext.config.pagesDir
      : genContext.config.componentsDir
  );
  await makeDir(componetsDir);
  const fullPath = join(componetsDir, `${name}.tsx`);

  let rootAst: File;
  let placeholderCursor: NodePath<JSXElement>;

  if (false /*existsSync(fullPath)*/) {
    // TODO: Update mode.
    // 1. Parse and get the File ast
    // 2. Find the root element to update
    // 3. Repeat update and traverse
    const content = await readFile(fullPath, 'utf-8');
    rootAst = parseAsRoot(content);
    throw new Error('Implement');
  } else {
    // Create mode.
    placeholderCursor = strategy.makeLayout();

    const parentContext: EmptyVisitContext = { cursor: placeholderCursor };
    walkNodeTree(
      node,
      (node, parentContext) => {
        return visitNode(node, parentContext, genContext);
      },
      parentContext
    );
    strategy.postWalk();
  }

  await writeFile(fullPath, strategy.render(placeholderCursor));
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
