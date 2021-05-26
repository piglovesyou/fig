import { config } from 'dotenv';

config();

export const token = process.env.TOKEN!;
if (!token)
  throw new Error(`Please provide a Figma access token, and try again.
https://www.figma.com/developers/api#access-tokens

$ TOKEN=0000 npx fig`);

export const shouldRefresh = Boolean(process.env.DISABLE_CACHE);
