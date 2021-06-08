import chunk from 'lodash.chunk';
import fetch from 'node-fetch';
import pMap from 'p-map';
import { FigmaFile } from '../types/fig';
import { updateLog } from './print';

const baseUrl = 'https://api.figma.com';

// To avoid "Error: 414: Request-URI Too Large"
const MAX_VECTOR_REQUEST_COUNT = 200;

// I think I should say hi before my account gets frozen
const GREET_FIGMA_DEVELOPER = `Hi. Sorry for high load. Contact me on github.com/piglovesyou/fig`;

export function makeHeader(token?: string) {
  const h: Record<string, string> = { 'X-Greeting': GREET_FIGMA_DEVELOPER };
  if (token) h['X-Figma-Token'] = token;
  return h;
}

export async function requestVectors(
  fileKey: string,
  vectorList: string[],
  token: string
) {
  if (!vectorList.length) throw new Error('vectorList is empty');

  let result: Record<string, string> | null = null;

  await pMap(
    chunk(vectorList, MAX_VECTOR_REQUEST_COUNT),
    async (ids, i) => {
      updateLog(
        `Fetching vector info ${i * MAX_VECTOR_REQUEST_COUNT}/${
          vectorList.length
        } starting..`
      );
      const idValue = encodeURIComponent(ids.join(','));
      const {
        err,
        images,
      }: {
        err: any;
        images?: Record<string, string>;
      } = await callApi(
        'GET',
        `/v1/images/${fileKey}?ids=${idValue}&format=svg`,
        token
      );
      if (err) throw new Error(JSON.stringify(err));
      if (images) result = Object.assign(result || {}, images);
    },
    { concurrency: 100 }
  );

  return result as unknown as Record<string, string>;
}

export interface RequestImagesResponse {
  error: boolean;
  status: number;
  meta: {
    images: Record<string, string>;
  };
}

export async function requestImages(
  fileKey: string,
  token: string
): Promise<RequestImagesResponse> {
  return await callApi('GET', `/v1/files/${fileKey}/images`, token);
}

/**
 * Get an AST for a Figma File.
 */
export async function requestFile(
  fileKey: string,
  token: string
): Promise<FigmaFile> {
  return await callApi('GET', `/v1/files/${fileKey}`, token);
}

export async function callApi(
  method: 'GET' | 'POST',
  endpoint: string,
  token: string
) {
  const headers = makeHeader(token);
  const resp = await fetch(`${baseUrl}${endpoint}`, { method, headers });
  if (resp.status < 200 || 300 <= resp.status)
    throw new Error(`${resp.status}: ${resp.statusText}\n${await resp.text()}`);
  return await resp.json();
}
