import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { format } from 'prettier';
import { createConfig } from '../../core/config';
import { ComposableNode, FigmaFile } from '../../types/fig';
import { readFile } from '../../utils/fs';
import { makeGenContext } from '../make-gen-context';

export async function makeCreateComponentArgs(
  fileJsonFullPath: string,
  fileKey: string,
  baseDir: string
) {
  const figmaFileFixture = JSON.parse(
    await readFile(fileJsonFullPath, 'utf-8')
  );
  const node: ComposableNode =
    figmaFileFixture.document.children[0].children[0];
  expect(node.name).toBe('My Frame');

  const config = await createConfig({
    fileKeys: [fileKey],
    baseDir,
    plugins: ['react'],
  });
  const genContext = await makeGenContext(
    figmaFileFixture as FigmaFile,
    fileKey,
    config,
    baseDir
  );

  const { componentsMap } = genContext;
  const componentInfo = componentsMap.get('1:2');
  if (!componentInfo) throw new Error('Never');
  return [node, componentInfo, genContext] as const;
}

export function getCode(rootCursor: NodePath<JSXElement>) {
  const { code } = generate(rootCursor.node);
  return format(code, { parser: 'babel' });
}
