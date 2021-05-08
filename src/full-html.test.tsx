import { writeFile } from 'fs/promises';
import { join } from 'path';
import React from 'react';
import renderer from 'react-test-renderer';
import * as api from './api';
import { gen } from './gen';
import { readFixtureJson, renderInHtml } from './__tools/fns';

const name = 'full-html';
const outDir = join(process.cwd(), `./__generated__/${name}`);
const fileKey = 'QAIja81RKgYhQnIIJ0h9PJ';

let useCache = false;
// useCache = true; // Comment out to update cache

if (useCache) {
  jest
    .spyOn(api, 'requestFile')
    .mockImplementation(() =>
      readFixtureJson(`./__fixtures/${fileKey}.file.json`)
    );
}

describe('Test full html', () => {
  test(
    'Render final HTML',
    async () => {
      await gen(outDir, fileKey);
      const componentName = 'Home_2$2';
      const { [componentName]: Home } = await import(
        `../__generated__/${name}/components/${componentName}`
      );

      const element = <Home />;

      await writeFile(join(outDir, `index.html`), renderInHtml(<Home />));

      const component = renderer.create(element);
      expect(component.toJSON()).toMatchSnapshot();
    },
    1000 * 60 * 30
  );
});
