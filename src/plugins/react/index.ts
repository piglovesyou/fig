import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, Program } from '@babel/types';
import { format } from 'prettier';
import { FigPlugin } from '../../types/plugin';
import { ReactCursorType } from './types';
import {
  appendComponentInstanceElement,
  appendElement,
  appendSvgElement,
  appendTextElement,
  erasePlaceholderElement,
  makeLayout,
} from './visit-utils';

export function createPlugin(): FigPlugin<ReactCursorType> {
  return {
    createLayout(_, componentInfo, genContext) {
      return makeLayout(componentInfo, genContext);
    },

    afterWalkTree: erasePlaceholderElement,

    componentFileExtension: 'tsx',

    renderComponent(rootCursor) {
      const program = rootCursor.findParent((path) =>
        isProgram(path.node)
      )! as NodePath<Program>;

      const { code: tsxCode } = generate(program.node);
      return format(tsxCode, { parser: 'babel' });
    },

    appendComponentInstanceElement,

    appendElement(context, parentContext) {
      return appendElement(context, parentContext, 'div');
    },

    appendSvgElement,

    appendTextElement,
  };
}
