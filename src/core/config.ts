import { cosmiconfig } from 'cosmiconfig';
import * as defaultStartegyModule from '../strategies/jsx';
import { StrategyModule } from '../types/strategy';

const MODULE_NAME = 'fig';

interface _FigConfigBase<StrategySpecifier> {
  baseDir?: string;
  componentsDir?: string;
  pagesDir?: string;
  htmlDir?: string;
  imagesDir?: string;
  strategy: StrategySpecifier;
  fileKeys: string[];
}

export type FigUserConfig = _FigConfigBase<string>;

export type FigConfig = Required<_FigConfigBase<StrategyModule>>;

const DEFAULT_FIG_CONFIG: FigConfig = {
  baseDir: '.',
  componentsDir: 'components',
  pagesDir: 'pages',
  htmlDir: 'html',
  imagesDir: 'images',
  strategy: defaultStartegyModule,
  fileKeys: [],
};

export async function applyDefaultConfig(
  config: FigUserConfig
): Promise<FigConfig> {
  return {
    ...DEFAULT_FIG_CONFIG,
    ...config,
    strategy: await loadStrategy(config.strategy),
  };
}

export function verifyConfig(config: FigConfig) {
  const { strategy } = config;
  if (!strategy) throw new Error('Specify strategy.');
}

async function loadStrategy(
  strategyName: FigUserConfig['strategy']
): Promise<StrategyModule> {
  return await import(`../strategies/${strategyName}`);
}

export async function loadConfig(): Promise<FigConfig> {
  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();
  if (!result) throw new Error(`.figrc is not found.`);
  const config: FigConfig = await applyDefaultConfig(result.config);
  verifyConfig(config);
  return config;
}
