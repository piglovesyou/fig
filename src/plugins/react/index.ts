import generate from '@babel/generator';
import { NodePath } from '@babel/traverse';
import { isProgram, Program } from '@babel/types';
import { format } from 'prettier';
import { GenContext } from '../../types/gen';
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

export function createPlugin(
  genContext: GenContext
): FigPlugin<ReactCursorType> {
  return {
    createLayout(_, componentInfo, genContext) {
      return makeLayout(componentInfo, genContext);
    },

    postWalkTree(rootCursor) {
      // if (!rootCursor)
      //   throw new Error(`Never. placeholderCursor must be set on postWalk() `);
      erasePlaceholderElement(rootCursor);
    },

    componentFileExtension: '.tsx',

    renderComponent(rootCursor) {
      // if (!rootCursor)
      //   throw new Error(`Never. cursor must be set on render().`);
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
