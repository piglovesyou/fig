import { FigConfig } from '../core/config';
import { ComponentsMap } from '../gen/components-map';
import { ComposableNode } from './ast';
import { FigPlugin } from './plugin';

export type ComponentInfo = {
  name: string;
  node: ComposableNode;
};

export type GenContext = {
  componentsMap: ComponentsMap;
  imagesMap: Map<string, string>;
  vectorsMap: Map<string, string>;
  vectorsList: string[];
  config: FigConfig;
  cwd: string;
  libDir: string;
  plugins: FigPlugin<unknown>[];
  baseFullDir: string;
  componentsFullDir: string;
  pagesFullDir: string;
  htmlFullDir: string;
  imagesFullDir: string;
  // mode: 'generate' | 'edit'
};
