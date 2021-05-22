import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { File, isReturnStatement, JSXElement } from '@babel/types';
import { readFile, writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import { join } from 'path';
import { format } from 'prettier';
import { findTempRefJsxElement, parseAsRoot, TEMP_REF_ATTR } from './make-ast';
import { GenContext } from './make-gen-context';
import { ComponentInfo, isValidComponentNode } from './utils';
import { EmptyVisitContext, visitNode } from './visit';

function makeLayoutForReact(
  fid: string,
  name: string
): [File, NodePath<JSXElement>] {
  const root = parseAsRoot(`
    import React, {FC, CSSProperties} from "react"
    
    export const ${name}: FC<{style: CSSProperties}> = (props) => {
      return (
        <__PLACEHOLDER__ ${TEMP_REF_ATTR}></__PLACEHOLDER__>
      )
    }
  `);
  const cursor = findTempRefJsxElement(root);
  if (!cursor) throw new Error('should be found');
  return [root, cursor];
}

export async function processComponent(
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
    [rootAst, placeholderCursor] = makeLayoutForReact(node.id, name);

    const parentContext: EmptyVisitContext = { cursor: placeholderCursor };
    visitNode(node, parentContext, genContext);

    // Merge attributes before removing the top placeholder element
    const placeholderElement = placeholderCursor.node;
    const componentRootElement = placeholderElement.children[0]! as JSXElement;

    // Remove placeholderElement
    const returnStatement = placeholderCursor.parent;
    if (!isReturnStatement(returnStatement)) throw new Error('never');
    returnStatement.argument = componentRootElement;
  }

  await writeFile(
    fullPath,
    format(generate(rootAst).code, { parser: 'babel' })
  );
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
