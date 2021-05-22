import { NodePath } from '@babel/traverse';
import { JSXElement, JSXExpressionContainer } from '@babel/types';

export function appendJsxNode(
  cursor: NodePath<JSXElement>,
  child: JSXElement | JSXExpressionContainer
): void {
  cursor.node.children.push(child);
  return;
}
