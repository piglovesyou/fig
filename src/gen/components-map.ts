import { ComposableNode } from '../types/ast';
import { makeComponentName } from './utils';

export type ComponentInfo = {
  name: string;
  node: ComposableNode;
};

export type ComponentsMap = Map<string, ComponentInfo>;

export function appendComponentsMap(
  node: ComposableNode,
  componentsMap: ComponentsMap
) {
  switch (node.type) {
    case 'INSTANCE':
    case 'COMPONENT':
    case 'FRAME':
      const val: ComponentInfo = {
        name: makeComponentName(node),
        node: node,
      };
      switch (node.type) {
        case 'INSTANCE':
          // Note: There can be no COMPONENT for an INSTANCE.
          if (!componentsMap.has(node.componentId))
            componentsMap.set(node.componentId, val);
          break;
        case 'COMPONENT':
          if (
            !componentsMap.has(node.id) ||
            // We overwrite INSTANCE if it's held already
            componentsMap.get(node.id)!.node.type === 'INSTANCE'
          )
            componentsMap.set(node.id, val);
          break;
        case 'FRAME':
          if (!componentsMap.has(node.id)) componentsMap.set(node.id, val);
          break;
        default:
          break;
      }
  }
}
