import commandLineArgs from 'command-line-args';
import commandLineUsage, { OptionDefinition } from 'command-line-usage';
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
  help?: boolean;
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
  help: false,
};

export type FigConfig = Required<_FigConfigBase<StrategyModule>>;

export const commandLineOptions: OptionDefinition[] = [
  {
    name: 'fileKeys',
    multiple: true,
    defaultOption: true,
    description: `{bold Required}. Pass one or more Figma file keys. You can get yours from browser location bar as "https://www.figma.com/file/{bold :FILE_KEY}/:TITLE".`,
    typeLabel: 'fileKey',
  },
  {
    name: 'token',
    typeLabel: 'token',
    description: `{bold Required}. Provide one valid Figma access token. It also accepts $TOKEN environment variable. See https://www.figma.com/developers/api#access-tokens.`,
  },
  {
    name: 'baseDir',
    description: `"." by default. If you specify "__generated__" as baseDir, it generates components in "__generated__/components" for example.`,
  },
  {
    name: 'componentsDir',
    description:
      '"components" by default. A directory to generate your component sources to.',
  },
  {
    name: 'pagesDir',
    description: `"pages" by default. A directory to generate your page component sources to.`,
  },
  {
    name: 'htmlDir',
    description: `"public" by default. A directory to generate your HTML sources to.`,
  },
  {
    name: 'imagesDir',
    description: `"images" by default. A directory to fetch your image resources to.`,
  },
  {
    name: 'strategy',
    description: `"react" by default, and is the only supported strategy for now.`,
  },
  { name: 'help', type: Boolean, description: `Show this message.` },
];

export function verifyConfig(config: FigConfig): void | never {
  const { strategy, fileKeys, token } = config;
  if (!fileKeys.length) {
    console.error(`Specify a Figma file key.`);
    showHelpAndExit(1);
  }
  if (!token) {
    console.error(`Specify a Figma token.`);
    showHelpAndExit(1);
  }
  if (!strategy) {
    console.error('Specify strategy.');
    showHelpAndExit(1);
  }
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

function showHelpAndExit(code: number) {
  const sections = [
    {
      header: 'Fig',
      content: `A CLI to generates HTML and Component sources from Figma file.`,
    },
    {
      header: 'Example',
      content: `$ fig {bold --token} token {bold fileKey} [fileKey ...]`,
    },
    {
      header: 'Options',
      optionList: commandLineOptions,
    },
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
  process.exit(code);
}

export async function loadConfig(): Promise<{
  config: FigConfig;
  cwd: string;
}> {
  const loadedCommandLineArgs = loadCommandLineArgs();
  if (loadedCommandLineArgs.help) showHelpAndExit(0);

  const explorer = await cosmiconfig(MODULE_NAME);
  const result = await explorer.search();

  const rcConfig: FigUserConfig = result?.config || {};
  const cwd: string = result?.filepath
    ? dirname(result.filepath)
    : process.cwd();

  const config = await createConfig(
    {
      ...rcConfig,
      ...loadedCommandLineArgs,
    },
    // TODO: Return cwd for later use
    cwd
  );

  verifyConfig(config);
  return { config, cwd };
}
