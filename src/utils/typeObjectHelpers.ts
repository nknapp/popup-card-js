export const values = Object.values as <K extends string, V>(
  record: Record<K, V>,
) => V[];

export const entries = Object.entries as <K extends string, V>(
  record: Record<K, V>,
) => [K, V][];
