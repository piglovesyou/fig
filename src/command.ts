import { loadConfig } from './core/config';
import { gen } from './gen/gen';

async function main() {
  const config = await loadConfig();
  await gen(config);
}

main()
  .then(() => process.exit(0))
  .catch((err) => (console.error(err), process.exit(1)));
