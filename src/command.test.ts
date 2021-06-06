import execa from 'execa';
import { join } from 'path';

describe('command.test.ts', () => {
  test(
    'cli execution',
    async () => {
      await execa(
        'node',
        [
          join(__dirname, '../dist/command.js'),
          '--baseDir',
          '__generated__',
          'pC6EOjjdZpS7PVsPTgjNLL',
        ],
        { stdout: process.stdout }
      );
    },
    1000 * 60 * 60
  );
});
