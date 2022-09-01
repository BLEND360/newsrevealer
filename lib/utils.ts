export function pick<T>(
  obj: { [key: string]: T } | undefined,
  selection: string[]
) {
  const result: { [key: string]: T } = {};
  for (const key of selection) {
    if (obj) result[key] = obj?.[key];
  }
  return result;
}
