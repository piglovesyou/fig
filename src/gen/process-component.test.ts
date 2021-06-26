import { NodePath } from '@babel/traverse';
import { JSXElement } from '@babel/types';
import { join } from 'path';
import { createComponent } from './process-component';
import { getCode, makeCreateComponentArgs } from './__tools/utils';

const fileJsonFullPath = join(
  __dirname,
  './__fixtures/YiawDxsoqZYkiufOizx367.file.json'
);
const fileKey = process.env.TOKEN!;
const baseDir = join(__dirname, '__generated__');

describe('process-component.test.ts', () => {
  test('createComponent', async () => {
    const args = await makeCreateComponentArgs(
      fileJsonFullPath,
      fileKey,
      baseDir
    );
    const rootCursor = await createComponent<NodePath<JSXElement>>(...args);

    const code = getCode(rootCursor);
    expect(code).toMatchSnapshot();
  });
});
