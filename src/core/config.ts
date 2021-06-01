import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { cosmiconfig } from 'cosmiconfig';
import { dirname, join, relative } from 'path';
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
  token?: string;
  require?: string[];
}

export type FigUserConfig = _FigConfigBase<string>;

const DEFAULT_FIG_CONFIG: FigUserConfig = {
  baseDir: '.',
  componentsDir: 'components',
  pagesDir: 'pages',
  htmlDir: 'public',
  imagesDir: 'images',
  strategy: 'react',
  fileKeys: [],
  token: '',
};

export type FigConfig = Required<_FigConfigBase<StrategyModule>>;

export const commandLineOptions: OptionDefinition[] = Object.keys(
  DEFAULT_FIG_CONFIG
).map((prop) => {
  const o: OptionDefinition = { name: prop };
  switch (prop) {
    case 'fileKeys':
      return { ...o, multiple: true, defaultOption: true };
    default:
      return { ...o, type: String };
  }
});

// export async function applyDefaultConfig(
//   config: FigUserConfig,
//   configFullPath?: string
// ): Promise<FigConfig> {
//   return {
//     ...DEFAULT_FIG_CONFIG,
//     ...config,
//     strategy: await loadStrategy(config.strategy, configFullPath),
//   };
// }

export function verifyConfig(config: FigConfig) {
  const { strategy, fileKeys, token } = config;
  if (!fileKeys.length) throw new Error(`Specify a Figma file key.`);
  if (!token) throw new Error(`Specify a Figma token.`);
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

function loadCommandLineArgs() {
  const options = commandLineArgs(commandLineOptions);
  const contented = Object.entries(options).filter(([, v]) =>
    Array.isArray(v) ? v.length : v
  );
  return Object.fromEntries(contented);
}

function applyDefaultConfig(userConfig: FigUserConfig) {
  return {
    ...DEFAULT_FIG_CONFIG,
    token: process.env.TOKEN || '',
    ...userConfig,
  } as Required<FigUserConfig>;
}

export async function createConfig(
  userConfig: _FigConfigBase<string>,
  cwd: string = process.cwd()
): Promise<FigConfig> {
  const fullConfig: Required<FigUserConfig> = applyDefaultConfig(userConfig);

  return {
    ...fullConfig,
    strategy: await loadStrategy(fullConfig.strategy, cwd),
  };
}

export async function loadConfig(): Promise<FigConfig> {
  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();

  const rcConfig: FigUserConfig = result?.config || {};
  const cwd: string = result?.filepath
    ? dirname(result.filepath)
    : process.cwd();

  const config = await createConfig(
    {
      ...rcConfig,
      ...loadCommandLineArgs(),
    },
    // TODO: Return cwd for later use
    cwd
  );

  verifyConfig(config);
  return config;
}
