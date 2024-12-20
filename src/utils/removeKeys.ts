export function removeKeys<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keysToRemove: K[],
): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToRemove.includes(key as K))) as Omit<T, K>;
}
