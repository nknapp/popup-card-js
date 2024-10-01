
export function mapValues<K extends string, I, O>(
    obj: Record<K, I>,
    fn: (input: I, key: K) => O,
): Record<K, O> {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, fn(value as I, key as K)]),
    ) as Record<K, O>;
}

