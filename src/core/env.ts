import { config } from 'dotenv';

config();

export const token = process.env.TOKEN!;
if (!token) throw new Error('$TOKEN is needed');

export const shouldRefresh = Boolean(process.env.DISABLE_CACHE);
