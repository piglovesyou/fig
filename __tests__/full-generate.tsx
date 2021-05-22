import { writeFile } from 'fs/promises';
import makeDir from 'make-dir';
import { join } from 'path';
import React from 'react';
import * as api from '../src/core/api';
import { applyDefaultConfig } from '../src/core/config';
import { shouldRefresh } from '../src/core/env';
import { gen } from '../src/gen/gen';
import { readJson, renderInHtml } from '../src/__tools/fns';

const outDir = join(__dirname, '__generated__');

type CaseArg = [name: string, componentName: string, fileKey: string];
const caseArgs: CaseArg[] = [
  ['mini', 'Home_1$2', 'MhB9ljAxaGlIk1IttXa09f'],
  ['basic', 'Home_2$2', 'QAIja81RKgYhQnIIJ0h9PJ'],
  ['patagonia', 'Home_1$4', 'pC6EOjjdZpS7PVsPTgjNLL'],
];

describe('Test full html', () => {
  test.concurrent.each(caseArgs)(
    'Test %s',
    async (name, componentName, fileKey: string) => {
      if (!shouldRefresh) {
        jest
          .spyOn(api, 'requestFile')
          .mockImplementation(() =>
            readJson(__dirname, `__fixtures/${fileKey}.file.json`)
          );
      }

      const baseDir = join(outDir, name);
      const config = applyDefaultConfig({
        fileKeys: [fileKey],
        baseDir,
        plugins: ['jsx'],
      });
      await gen(config);

      const { [componentName]: Home } = await import(
        `./__generated__/${name}/pages/${componentName}`
      );

      // TODO: use gen context
      await makeDir(join(baseDir, 'public'));
      await writeFile(
        join(baseDir, 'public/index.html'),
        renderInHtml(<Home />)
      );
    },
    1000 * 60 * 30
  );
});
