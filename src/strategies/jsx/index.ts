import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import {
  isProgram,
  isReturnStatement,
  JSXElement,
  Program,
} from '@babel/types';
import { format } from 'prettier';
import { ComponentInfo } from '../../utils';
import { findTempRefJsxElement, parseAsRoot, TEMP_REF_ATTR } from './jsx-utils';

export interface Strategy {}

function erasePlaceholderElement(
  placeholderCursor: NodePath<JSXElement>
): void {
  // Merge attributes before removing the top placeholder element
  const placeholderElement = placeholderCursor.node;
  const componentRootElement = placeholderElement.children[0]! as JSXElement;

  // Remove placeholderElement
  const returnStatement = placeholderCursor.parent;
  if (!isReturnStatement(returnStatement)) throw new Error('never');
  returnStatement.argument = componentRootElement;
}

export class JsxStrategy implements Strategy {
  fid: string;
  name: string;

  // rootNode: Node | undefined;
  cursor: NodePath<JSXElement> | undefined;

  constructor({ node, name }: ComponentInfo) {
    this.fid = node.id;
    this.name = name;
  }

  makeLayout(): NodePath<JSXElement> {
    const root = parseAsRoot(`
import React, {FC, CSSProperties} from "react"

export const ${this.name}: FC<{style: CSSProperties}> = (props) => {
  return (
    <__PLACEHOLDER__ ${TEMP_REF_ATTR}></__PLACEHOLDER__>
  )
}
    `);
    const cursor = findTempRefJsxElement(root);
    if (!cursor) throw new Error('should be found');
    this.cursor = cursor;
    return cursor;
  }

  postWalk() {
    if (!this.cursor)
      throw new Error(`Never. placeholderCursor must be set on postWalk() `);
    erasePlaceholderElement(this.cursor);
  }

  render(): string {
    if (!this.cursor) throw new Error(`Never. cursor must be set on render().`);
    const program: NodePath<Program> = this.cursor.findParent((path) =>
      isProgram(path.node)
    )! as NodePath<Program>;
    return format(generate(program.node).code, { parser: 'babel' });
  }
}

export {};
