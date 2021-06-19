export const PRINT_PREFIX = '[ fig ] ';

export function printInfo(message: string): void {
  console.info(PRINT_PREFIX + message);
}

export function printWarning(message: string): void {
  console.warn(PRINT_PREFIX + message);
}

export function printError(err: Error): void {
  console.error(PRINT_PREFIX + err.toString() + '\n' + err.stack);
}

export function getCurr(curr: number, max: number) {
  const maxStr = String(max);
  return `${String(curr).padStart(maxStr.length, ' ')}/${maxStr}`;
}
