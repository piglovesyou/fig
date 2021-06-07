import { ComposableNode } from '../types/ast';
import { makeComponentName } from './utils';

function testValidForJsVarName(name: string): void | never {
  eval(`var ${name} = 0`);
}

describe('utils.test.ts', () => {
  test('makeComponentName', async () => {
    const r1 = makeComponentName({
      type: 'FRAME',
      id: 'id',
      name: 'name',
    } as ComposableNode);
    expect(r1).toMatchInlineSnapshot(`"Name_id"`);
    testValidForJsVarName(r1);

    const r2 = makeComponentName({
      type: 'FRAME',
      id: '11:11;00:00;22:22',
      name: 'name',
    } as ComposableNode);
    expect(r2).toMatchInlineSnapshot(`"Name_11$11$00$00$22$22"`);
    testValidForJsVarName(r2);

    const r3 = makeComponentName({
      type: 'FRAME',
      id: 'id',
      name: '[abc] :a/:b/:c',
    } as ComposableNode);
    expect(r3).toMatchInlineSnapshot(`"[abc] :a/:b/:c_id"`);
    testValidForJsVarName(r3);
  });
});
