import { ComposableNode } from '../types/ast';
import { makeComponentName } from './utils';

function testValidJsVarName(name: string): void | never {
  eval(`var ${name} = 0`);
}

describe('utils.test.ts', () => {
  test('makeComponentName Semi colons', async () => {
    const actual = makeComponentName({
      type: 'FRAME',
      id: '11:11;00:00;22:22',
      name: 'name',
    } as ComposableNode);
    expect(actual).toMatchInlineSnapshot(`"Name_11$11$00$00$22$22"`);
    testValidJsVarName(actual);
  });

  test('makeComponentName Name with symbols', async () => {
    const actual = makeComponentName({
      type: 'FRAME',
      id: ")%}9_[<28@$6$5##]]{',$6[3/%]><`@}=1~.*1`:|(1#^<}4{",
      name: ")%}9_[<28@$6$5##]]{',$6[3/%]><`@}=1~.*1`:|(1#^<}4{",
    } as ComposableNode);
    expect(actual).toMatchInlineSnapshot(
      `"C92865631114_$9_$28$6$5$6$3$1$1$1$4$"`
    );
    testValidJsVarName(actual);
  });

  test('makeComponentName Name with symbols 2', async () => {
    const actual = makeComponentName({
      type: 'FRAME',
      id: ',W1x2Q.pPglfb^y{<N=}i;W+a?qSbZ39T9o_#tOrfZaePb^Oz@',
      name: ',W1x2Q.pPglfb^y{<N=}i;W+a?qSbZ39T9o_#tOrfZaePb^Oz@',
    } as ComposableNode);
    expect(actual).toMatchInlineSnapshot(
      `"W1X2QPPglfbYNIWAQSbZ39T9OTOrfZaePbOz_$W1x2Q$pPglfb$y$N$i$W$a$qSbZ39T9o_$tOrfZaePb$Oz$"`
    );
    testValidJsVarName(actual);
  });
});
