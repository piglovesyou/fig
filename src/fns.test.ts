import { ComposableNode } from './types';
import { makeComponentName } from './utils';

describe('figma.test.ts', () => {
  test('makeComponentName()', async () => {
    const rv = makeComponentName({
      id: '1:1',
      name: 'a',
      type: 'COMPONENT',
    } as ComposableNode);
    expect(rv).toMatchSnapshot();
  });
});
