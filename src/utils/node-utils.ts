import { ComposableNode, Node } from '../types/ast';

export function isValidComponentNode(
  node: ComposableNode
): node is
  | Node<'FRAME'>
  | Node<'COMPONENT'>
  | Node<'COMPONENT_SET'>
  | Node<'INSTANCE'> {
  return (
    node.type === 'FRAME' ||
    node.type === 'COMPONENT' ||
    node.type === 'COMPONENT_SET' ||
    node.type === 'INSTANCE'
    // TODO: Consider this
    // && node.visible !== false
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
