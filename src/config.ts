import { cosmiconfig } from 'cosmiconfig';

const MODULE_NAME = 'fig';

interface FigUserConfig {
  baseDir?: string;
  componentsDir?: string;
  pagesDir?: string;
  htmlDir?: string;
  fileKeys: string[];
}

export type FigConfig = Required<FigUserConfig>;

const DEFAULT_FIG_CONFIG: FigConfig = {
  baseDir: '.',
  componentsDir: 'components',
  pagesDir: 'pages',
  htmlDir: 'html',
  fileKeys: [],
};

export function applyDefaultConfig(c: FigUserConfig): FigConfig {
  return Object.assign({}, DEFAULT_FIG_CONFIG, c);
}

export async function loadConfig(): Promise<FigConfig | null> {
  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();
  return Object.assign({}, DEFAULT_FIG_CONFIG, result?.config || {});
}
