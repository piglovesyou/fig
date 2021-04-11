import { config } from 'dotenv';

config();

// export const fileKey = process.env.FILE_KEY!;
// if (!fileKey) throw new Error('$FILE_KEY is needed');

export const devToken = process.env.DEV_TOKEN!;
if (!devToken) throw new Error('$DEV_TOKEN is needed');
