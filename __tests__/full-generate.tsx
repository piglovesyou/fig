import { writeFile } from 'fs/promises';
import { join } from 'path';
import React from 'react';
import * as api from '../src/api';
import { applyDefaultConfig } from '../src/config';
import { shouldRefresh } from '../src/env';
import { gen } from '../src/gen';
import { readJson, renderInHtml } from '../src/__tools/fns';

const outDir = join(__dirname, '__generated__');

type CaseArg = [name: string, componentName: string, fileKey: string];
const caseArgs: CaseArg[] = [
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
            readJson(process.cwd(), `__tests__/__fixtures/${fileKey}.file.json`)
          );
      }

      const baseDir = join(outDir, name);
      const config = applyDefaultConfig({
        fileKeys: [fileKey],
        baseDir,
      });
      await gen(config);

      const { [componentName]: Home } = await import(
        `./__generated__/${name}/components/${componentName}`
      );

      await writeFile(join(baseDir, 'index.html'), renderInHtml(<Home />));
    }
  );

  // test(
  //   'Render final HTML',
  //   async () => {
  //     await gen(config);
  //     const componentName = 'Home_2$2';
  //     const { [componentName]: Home } = await import(
  //       `../__generated__/${name}/components/${componentName}`
  //     );
  //
  //     const element = <Home />;
  //
  //     await writeFile(
  //       join(config.baseDir!, `index.html`),
  //       renderInHtml(<Home />)
  //     );
  //
  //     const component = renderer.create(element);
  //     expect(component.toJSON()).toMatchSnapshot();
  //   },
  //   1000 * 60 * 30
  // );
});
