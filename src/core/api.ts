import fetch from 'node-fetch';
import { FigmaFile } from '../types/fig';

const baseUrl = 'https://api.figma.com';

export async function requestVectors(
  fileKey: string,
  vectorList: string[],
  token: string
) {
  if (!vectorList.length) throw new Error('vectorList is empty');
  const guids = vectorList.join(',');
  const imageJSON: {
    err: any;
    images?: Record<string, string>;
  } = await callApi(
    'GET',
    `/v1/images/${fileKey}?ids=${guids}&format=svg`,
    token
  );
  return imageJSON;
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
  const headers = { 'X-Figma-Token': token };
  const resp = await fetch(`${baseUrl}${endpoint}`, { method, headers });
  if (resp.status < 200 || 300 <= resp.status) throw new Error(resp.statusText);
  return await resp.json();
}
