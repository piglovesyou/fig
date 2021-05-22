import { config } from 'dotenv';

config();

export const devToken = process.env.DEV_TOKEN!;
if (!devToken) throw new Error('$DEV_TOKEN is needed');

export const shouldRefresh = Boolean(process.env.DISABLE_CACHE);
