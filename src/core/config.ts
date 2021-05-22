import { cosmiconfig } from 'cosmiconfig';
import pMap from 'p-map';

const MODULE_NAME = 'fig';

export interface Plugin {}

interface FigConfigBase<PluginType> {
  baseDir?: string;
  componentsDir?: string;
  pagesDir?: string;
  htmlDir?: string;
  imagesDir?: string;
  plugins: PluginType[];
  fileKeys: string[];
}

export type FigUserConfig = FigConfigBase<string>;

export type FigConfig = Required<FigConfigBase<Plugin>>;

const DEFAULT_FIG_CONFIG: FigConfig = {
  baseDir: '.',
  componentsDir: 'components',
  pagesDir: 'pages',
  htmlDir: 'html',
  imagesDir: 'images',
  plugins: [],
  fileKeys: [],
};

export function applyDefaultConfig(c: FigUserConfig): FigConfig {
  return Object.assign({}, DEFAULT_FIG_CONFIG, c);
}

export function verifyConfig(config: FigConfig) {
  const { plugins } = config;
  if (!plugins.length) throw new Error('Specify at least one plugin.');
}

function loadPlugins(pluginNames: FigUserConfig['plugins']): Promise<Plugin[]> {
  return pMap(pluginNames, (name) => import(`./plugins/${name}`));
}

export async function loadConfig(): Promise<FigConfig | null> {
  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();
  if (!result) throw new Error(`.figrc is not found.`);
  const config: FigConfig = {
    ...DEFAULT_FIG_CONFIG,
    ...result.config,
    plugins: await loadPlugins(result.config.plugins),
  };
  verifyConfig(config);
  return config;
}
