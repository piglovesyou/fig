import { JSXElement } from '@babel/types';
import { CSSProperties } from 'react';
import { parseExpression } from '../strategies/react/ast-utils';
import { Node } from '../types/ast';
import { applyFontStyle } from './styles';

export function makeTextContent(node: Node<'TEXT'>): JSXElement[] {
  if (node.name.startsWith('input:')) {
    return [
      parseExpression<JSXElement>(
        `<input key='${node.id}' type='text' placeholder='${
          node.characters
        }' name='${node.name.substring(7)}' />`
      ),
    ];
  }

  if (node.characterStyleOverrides) {
    let para = '';
    const ps: JSXElement[] = [];
    const styleCache: Record<number, CSSProperties> = {};
    let currStyle = 0;

    const commitParagraph = (key: number | string) => {
      if (para !== '') {
        if (styleCache[currStyle] == null && currStyle !== 0) {
          styleCache[currStyle] = {};
          // TODO: Do we need this?
          applyFontStyle(
            styleCache[currStyle],
            node.styleOverrideTable[currStyle]
          );
        }

        const styleOverride = styleCache[currStyle]
          ? JSON.stringify(styleCache[currStyle])
          : '{}';

        ps.push(
          parseExpression<JSXElement>(
            `<span style={${styleOverride}} key="${key}">${para}</span>`
          )
        );
        para = '';
      }
    };

    for (let i = 0; i < node.characters.length; i++) {
      let idx = node.characterStyleOverrides[i];

      if (node.characters[i] === '\n') {
        commitParagraph(i);
        ps.push(parseExpression<JSXElement>(`<br key='${`br${i}`}' />`));
        continue;
      }

      if (idx == null) idx = 0;
      if (idx !== currStyle) {
        commitParagraph(i);
        currStyle = idx;
      }

      para += node.characters[i];
    }
    commitParagraph('end');

    return ps;
  }

  return node.characters
    .split('\n')
    .map((line, idx) => parseExpression(`<div key='${idx}'>${line}</div>`));
}
