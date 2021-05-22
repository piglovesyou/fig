import { readFile } from 'fs/promises';
import { join } from 'path';
import * as api from '../core/api';
import { RequestImagesResponse } from '../core/api';

async function read(rel: string) {
  return JSON.parse(await readFile(join(__dirname, rel), 'utf-8'));
}

jest.spyOn(api, 'requestFile').mockImplementation(() => {
  return read('./__fixtures/request-file-response.json');
});

jest.spyOn(api, 'requestVectors').mockImplementation(() => {
  return read('./__fixtures/request-images-response.json');
});

jest.spyOn(api, 'requestImages').mockImplementation(() => {
  return Promise.resolve({
    error: false,
    status: 200,
    meta: {
      images: {},
    },
  } as RequestImagesResponse);
});
