import { join } from 'path';
import * as api from '../src/core/api';
import { createConfig } from '../src/core/config';
import { gen } from '../src/gen/gen';
import { readFile, writeFile } from '../src/utils/fs';
import { shouldRefresh } from '../src/__tools/env';
import { readJson } from '../src/__tools/fns';

const outDir = join(__dirname, '__generated__');

type CaseArg = [name: string, componentName: string, fileKey: string];
const caseArgs: CaseArg[] = [
  ['mini', 'Home_1$2', 'MhB9ljAxaGlIk1IttXa09f'],
  ['basic', 'Home_2$2', 'QAIja81RKgYhQnIIJ0h9PJ'],
  ['patagonia', 'Home_1$4', 'pC6EOjjdZpS7PVsPTgjNLL'],
  // ['something', 'Examples_455$10446', 'm4iAiVrBRqE5pAYXSTXvz7'],
];

const originalRequestFile = api.requestFile;

describe('Test full html', () => {
  // Caution: run the tests sequentially. Break down otherwise.
  test.each(caseArgs)(
    'Test %s',
    async (name, componentName, fileKey: string) => {
      // Spy to read cache by default or update it
      jest
        .spyOn(api, 'requestFile')
        .mockImplementation(async (fileKey: string, token: string) => {
          const cacheFullPath = join(
            __dirname,
            `__fixtures/${fileKey}.file.json`
          );
          if (shouldRefresh) {
            const figmaFile = await originalRequestFile(fileKey, token);
            await writeFile(
              cacheFullPath,
              JSON.stringify(figmaFile, undefined, 2)
            );
            return figmaFile;
          }
          return readJson(cacheFullPath);
        });

      const baseDir = join(outDir, name);
      const config = await createConfig({
        fileKeys: [fileKey],
        baseDir,
        plugins: ['react', 'react-html'],
      });
      await gen(config);

      const html = await readFile(
        join(baseDir, 'public', `${componentName}.html`),
        'utf-8'
      );
      expect(html).toMatchSnapshot();
    },
    1000 * 60 * 30
  );
});
