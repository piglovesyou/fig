import fetch from 'node-fetch';
import { FigmaFile } from '../types/fig';
import { token } from './env';

const baseUrl = 'https://api.figma.com';
const headers = { 'X-Figma-Token': token };

export async function requestVectors(fileKey: string, vectorList: string[]) {
  if (!vectorList.length) throw new Error('vectorList is empty');
  const guids = vectorList.join(',');
  const imageJSON: {
    err: any;
    images?: Record<string, string>;
  } = await callApi('GET', `/v1/images/${fileKey}?ids=${guids}&format=svg`);
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
  fileKey: string
): Promise<RequestImagesResponse> {
  return await callApi('GET', `/v1/files/${fileKey}/images`);
}

/**
 * Get an AST for a Figma File.
 */
export async function requestFile(fileKey: string): Promise<FigmaFile> {
  return await callApi('GET', `/v1/files/${fileKey}`);
}

export async function callApi(method: 'GET' | 'POST', endpoint: string) {
  const resp = await fetch(`${baseUrl}${endpoint}`, { method, headers });
  if (resp.status < 200 || 300 <= resp.status) throw new Error(resp.statusText);
  return await resp.json();
}
