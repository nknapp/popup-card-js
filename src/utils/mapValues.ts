import { TypedRecord } from "./TypedRecord.ts";

export function mapValues<K extends string, I, O>(
  obj: Record<K, I>,
  fn: (input: I, key: K) => O,
): Record<K, O> {
  return TypedRecord.fromEntries(
    TypedRecord.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  );
}
