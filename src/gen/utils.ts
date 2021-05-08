import camelCase from 'camelcase';
import { ComposableNode } from '../types/ast';

function makeComponentNameFromId(id: string, name: string) {
  id = id.replace(/;/g, '$$').replace(/\W/g, '$');
  name = camelCase(name, { pascalCase: true });
  return `${name}_${id}`;
}

export function makeComponentName(node: ComposableNode): string | never {
  switch (node.type) {
    case 'FRAME':
    case 'COMPONENT':
      return makeComponentNameFromId(node.id, node.name);
    case 'INSTANCE':
      // TODO: zombie component name can be resolved. Fix it.
      return makeComponentNameFromId(node.id, '__NOT_FOUND__');
    default:
      throw new Error('Component can only be FRAME, COMPONENT, INSTANCE.');
  }
}
