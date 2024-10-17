export const TypedRecord = Object as {
  entries<K extends string, V>(record: Record<K, V>): [K, V][];
  fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V>;
  values<K extends string, V>(record: Record<K, V>): V[];
  keys<K extends string>(record: Record<K, unknown>): K[];
};
