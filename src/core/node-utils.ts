import { ComposableNode, Node } from '../types/ast';

export function isValidComponentNode(
  node: ComposableNode
): node is Node<'FRAME'> | Node<'COMPONENT'> | Node<'INSTANCE'> {
  return (
    (node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE') &&
    node.visible !== false
  );
}

export function walkNodeTree<T = void>(
  node: ComposableNode,
  fn: (node: ComposableNode, parentResult: T) => null | T,
  parentResult: T
): void {
  const result = fn(node, parentResult);
  if (result === null) return;
  for (const child of node.children || []) {
    walkNodeTree(child, fn, result);
  }
}
