import { cosmiconfig } from 'cosmiconfig';
import { dirname, join, relative } from 'path';
import * as defaultStartegyModule from '../strategies/react';
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
  htmlDir: 'public',
  imagesDir: 'images',
  strategy: defaultStartegyModule,
  fileKeys: [],
};

export async function applyDefaultConfig(
  config: FigUserConfig,
  configFullPath?: string
): Promise<FigConfig> {
  return {
    ...DEFAULT_FIG_CONFIG,
    ...config,
    strategy: await loadStrategy(config.strategy, configFullPath),
  };
}

export function verifyConfig(config: FigConfig) {
  const { strategy } = config;
  if (!strategy) throw new Error('Specify strategy.');
}

async function loadStrategy(
  strategyName: FigUserConfig['strategy'],
  configFullPath?: string
): Promise<StrategyModule> {
  if (strategyName.startsWith('./')) {
    if (!configFullPath) throw new Error(`Never`);
    const moduleFullPath = join(dirname(configFullPath), strategyName);
    const moduleRelPath = relative(__dirname, moduleFullPath);
    return await import(
      moduleRelPath.startsWith('.') ? moduleRelPath : './' + moduleRelPath
    );
  }
  return await import(`../strategies/${strategyName}`);
}

export async function loadConfig(): Promise<FigConfig> {
  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();
  if (!result) throw new Error(`.figrc is not found.`);
  const config: FigConfig = await applyDefaultConfig(
    result.config,
    result.filepath
  );
  verifyConfig(config);
  return config;
}
