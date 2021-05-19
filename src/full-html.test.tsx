import { writeFile } from 'fs/promises';
import { join } from 'path';
import React from 'react';
import renderer from 'react-test-renderer';
import * as api from './api';
import { applyDefaultConfig } from './config';
import { shouldRefresh } from './env';
import { gen } from './gen';
import { readFixtureJson, renderInHtml } from './__tools/fns';

const name = 'full-html';
const baseDir = join(process.cwd(), `./__generated__/${name}`);

const fileKey = 'QAIja81RKgYhQnIIJ0h9PJ';
const config = applyDefaultConfig({
  baseDir,
  fileKeys: [fileKey],
});

if (!shouldRefresh) {
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
      await gen(config);
      const componentName = 'Home_2$2';
      const { [componentName]: Home } = await import(
        `../__generated__/${name}/components/${componentName}`
      );

      const element = <Home />;

      await writeFile(
        join(config.baseDir!, `index.html`),
        renderInHtml(<Home />)
      );

      const component = renderer.create(element);
      expect(component.toJSON()).toMatchSnapshot();
    },
    1000 * 60 * 30
  );
});
