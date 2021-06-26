import { File } from '@babel/types';
import makeDir from 'make-dir';
import { join } from 'path';
import { ComposableNode } from '../types/ast';
import { ComponentInfo, GenContext } from '../types/gen';
import { EmptyVisitContext } from '../types/visit';
import { readFile, writeFile } from '../utils/fs';
import { isValidComponentNode, walkNodeTree } from '../utils/node-utils';
import { visitNode } from '../visit/visit';

export async function createComponent<CursorType>(
  node: ComposableNode,
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  let rootCursor: CursorType | null = null;
  const { plugins } = genContext;
  // Create mode.
  for (const plugin of plugins)
    if (plugin.createLayout)
      rootCursor = (await plugin.createLayout(
        rootCursor,
        componentInfo,
        genContext
      )) as CursorType;
  if (!rootCursor) throw new Error('Never. Plugin must assign cursor');

  const parentContext: EmptyVisitContext<unknown> = {
    cursor: rootCursor,
  };
  walkNodeTree(
    node,
    (node, parentContext) => {
      return visitNode(node, parentContext, genContext);
    },
    parentContext
  );

  for (const plugin of plugins)
    await plugin.afterWalkTree?.(rootCursor, componentInfo, genContext);
  return rootCursor;
}

export async function processComponent<CursorType>(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (!isValidComponentNode(node)) throw new Error('never');
  const { plugins } = genContext;

  const { baseFullDir } = genContext;
  const outFullDir = join(
    baseFullDir,
    node.type === 'FRAME'
      ? genContext.config.pagesDir
      : genContext.config.componentsDir
  );
  await makeDir(outFullDir);
  const fullBasePath = join(outFullDir, name);

  let rootAst: File;
  let rootCursor: CursorType | null = null;

  if (false /*existsSync(fullBasePath)*/) {
    // TODO: Update mode.
    // 1. Parse and get the File ast
    // 2. Find the root element to update
    // 3. Repeat update and traverse
    const content = await readFile(fullBasePath + '.tsx', 'utf-8');
    // rootAst = parseAsRoot(content);
    throw new Error('Implement');
  } else {
    rootCursor = await createComponent(node, componentInfo, genContext);
  }

  for (const plugin of plugins)
    if (plugin.renderComponent) {
      const componentFullPath =
        fullBasePath + '.' + plugin.componentFileExtension;
      const content = await plugin.renderComponent(
        rootCursor,
        componentInfo,
        genContext
      );
      await writeFile(componentFullPath, content);
    }
}
