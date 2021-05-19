import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import React from 'react';
import * as api from '../src/api';
import { applyDefaultConfig } from '../src/config';
import { shouldRefresh } from '../src/env';
import { gen } from '../src/gen';
import { readJson, renderInHtml } from '../src/__tools/fns';

async function read(rel: string) {
  return JSON.parse(await readFile(join(__dirname, rel), 'utf-8'));
}

const name = 'patagonia';
const fileKey = 'pC6EOjjdZpS7PVsPTgjNLL';

if (!shouldRefresh) {
  jest
    .spyOn(api, 'requestFile')
    .mockImplementation(() =>
      readJson(__dirname, `__fixtures/${fileKey}.file.json`)
    );
  // jest
  //   .spyOn(api, 'requestImages')
  //   .mockImplementation(() => read('./__fixtures/patagonia.images.json'));
}

const baseDir = join(process.cwd(), `./__generated__/${name}`);
const config = applyDefaultConfig({
  baseDir,
  fileKeys: [fileKey],
});

describe('patagonia.test.tsx', () => {
  test(
    'full html',
    async () => {
      await gen(config);
      const componentName = 'Home_1$4';
      const { [componentName]: Home } = await import(
        `../__generated__/${name}/components/${componentName}`
      );

      await writeFile(join(baseDir, 'index.html'), renderInHtml(<Home />));
    },
    1000 * 60 * 60
  );
});
