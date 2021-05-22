import { NodePath } from '@babel/traverse';
import { File, JSXElement } from '@babel/types';
import {
  findTempRefJsxElement,
  parseAsRoot,
  TEMP_REF_ATTR,
} from '../../make-ast';

export interface Plugin {}

export function makeLayout(
  fid: string,
  name: string
): [File, NodePath<JSXElement>] {
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
  return [root, cursor];
}

export {};
