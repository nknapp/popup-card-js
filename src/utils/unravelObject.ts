
export function unravelObject<K extends string, V>(
    obj: Record<K, V>,
): [values: V[], indices: Record<K, number>] {
    return [
        Object.values(obj),
        Object.fromEntries(
            Object.keys(obj).map((key, index) => [key, index]),
        ) as Record<K, number>,
    ];
}
