import { File } from '@babel/types';
import makeDir from 'make-dir';
import { join } from 'path';
import { isValidComponentNode, walkNodeTree } from '../core/node-utils';
import { ComponentInfo, GenContext } from '../types/gen';
import { EmptyVisitContext } from '../types/visit';
import { readFile, writeFile } from '../utils/fs';
import { visitNode } from '../visit/visit';

export async function processComponent<CursorType>(
  componentInfo: ComponentInfo,
  genContext: GenContext
) {
  const { node, name } = componentInfo;
  if (!isValidComponentNode(node)) throw new Error('never');
  const { plugins } = genContext;
  if (!plugins?.length)
    throw new Error('Never. Plugins should be instantiated.');

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
    // Create mode.
    for (const plugin of plugins)
      if (plugin.createLayout)
        rootCursor = plugin.createLayout(
          rootCursor,
          componentInfo,
          genContext
        ) as CursorType;
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
      plugin.postWalkTree?.(rootCursor, componentInfo, genContext);
  }

  for (const plugin of plugins)
    if (plugin.renderComponent) {
      const content = await plugin.renderComponent(
        rootCursor,
        componentInfo,
        genContext
      );
      await writeFile(fullBasePath + plugin.componentFileExtension, content);
    }

  // for (const plugin of plugins) {
  //   if (plugin.renderComponent)
  //     for (const [content, ext] of await plugin.renderComponent(
  //       rootCursor,
  //       componentInfo,
  //       genContext
  //     ))
  //       await writeFile(fullBasePath + ext, content);
  // }
}
