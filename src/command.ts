import { FigConfig, loadConfig } from './core/config';
import { gen } from './gen/gen';

export async function loadRequirements({ require }: FigConfig): Promise<void> {
  if (!require) return;
  for (const name of require) await import(name);
}

export async function command() {
  const config = await loadConfig();
  await loadRequirements(config);
  await gen(config);
}

command()
  .then(() => process.exit(0))
  .catch((err) => (console.error(err), process.exit(1)));
