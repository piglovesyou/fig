import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import {
  identifier,
  importDeclaration,
  importSpecifier,
  isProgram,
  JSXIdentifier,
  Program,
  stringLiteral,
} from '@babel/types';
import { format } from 'prettier';
import {
  FID_ATTR_NAME,
  findJsxElementByFid,
  findTempRefJsxElement,
  getStatementCursor,
  parseAsRoot,
  TEMP_REF_ATTR,
} from './ast-utils';

let rootContent = `
import React, {PureComponent} from "react";

export class CFrame1 extends PureComponent {
  render() {
    // ${TEMP_REF_ATTR}
    return 'a';
  }
}
`;

describe('jsx-style-utils.test.ts', () => {
  test('getCursor()', async () => {
    const ast = parseAsRoot(rootContent);
    expect((getStatementCursor(ast).node as any).type).toEqual(
      'ReturnStatement'
    );
  });

  test('findJsxElementByFid()', () => {
    const root = parseAsRoot(`
import React, {PureComponent} from "react";

export class CFrame1 extends PureComponent {
  render() {
    return (
      <div ${FID_ATTR_NAME}="9:9">
        <span ${FID_ATTR_NAME}="10:10"></span>
      </div>
    );
  }
}
    `);
    const elPath = findJsxElementByFid(root, '10:10');
    expect((elPath?.node.openingElement.name as JSXIdentifier).name).toEqual(
      'span'
    );
  });

  test('append import', async () => {
    const root = parseAsRoot(`
import React, {PureComponent} from "react";

export class CFrame1 extends PureComponent {
  render() {
    return (
      <div ${TEMP_REF_ATTR}>
      </div>
    );
  }
}
    `);
    const cursor = findTempRefJsxElement(root);

    const program = cursor.findParent((path) =>
      isProgram(path.node)
    )! as NodePath<Program>;
    program.node.body.unshift(
      importDeclaration(
        [importSpecifier(identifier('a'), identifier('a'))],
        stringLiteral('./source')
      )
    );
    const code1 = format(generate(program.node).code, { parser: 'babel' });
    expect(code1).toMatchSnapshot();
  });
});
