import { loadConfig } from './core/config';
import { gen } from './gen/gen';

export async function command() {
  const config = await loadConfig();
  await gen(config);
}

command()
  .then(() => process.exit(0))
  .catch((err) => (console.error(err), process.exit(1)));
