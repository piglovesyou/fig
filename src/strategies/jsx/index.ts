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
import { findTempRefJsxElement, parseAsRoot, TEMP_REF_ATTR } from './make-ast';

export interface ComponentStrategy {}

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

export class JsxComponentStrategy implements ComponentStrategy {
  fid: string;
  name: string;

  // rootNode: Node | undefined;
  placeholderCursor: NodePath<JSXElement> | undefined;

  constructor({ node, name }: ComponentInfo) {
    this.fid = node.id;
    this.name = name;
  }

  makeLayout(fid: string, name: string): NodePath<JSXElement> {
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
    this.placeholderCursor = cursor;
    return cursor;
  }

  postWalk() {
    if (!this.placeholderCursor)
      throw new Error(
        `Never. placeholderCursor must be set on postWalk() hook.`
      );
    erasePlaceholderElement(this.placeholderCursor);
  }

  render(cursor: NodePath<any>): string {
    const program: NodePath<Program> = cursor.findParent((path) =>
      isProgram(path.node)
    )! as NodePath<Program>;
    return format(generate(program.node).code, { parser: 'babel' });
  }
}

export {};
