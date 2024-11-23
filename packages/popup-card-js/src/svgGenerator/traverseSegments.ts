export interface TraverseSegmentsInput {
  segments: string[];
  folds: [left: string, right: string][];
}

export function* traverseSegments({
  segments,
  folds,
}: TraverseSegmentsInput): Generator<string> {
  const foldLookup = new LazyMap<string, string[]>(() => []);
  for (const fold of folds) {
    foldLookup.lazyGet(fold[0]).push(fold[1]);
    foldLookup.lazyGet(fold[1]).push(fold[0]);
  }

  const pending: string[] = [segments[0]];
  const visitedSegments = new Set<string>();
  while (true) {
    const current = pending.shift();
    if (current == null) break;
    if (visitedSegments.has(current)) continue;
    yield current;
    visitedSegments.add(current);
    pending.push(...(foldLookup.get(current) ?? []));
  }
  if (visitedSegments.size < segments.length) {
    throw new Error(
      "Unconnected segments found: " +
        segments.filter((segment) => !visitedSegments.has(segment)),
    );
  }
}

class LazyMap<K, V> extends Map<K, V> {
  constructor(private createItem: () => V) {
    super();
  }

  lazyGet(key: K): V {
    const result = this.get(key);
    if (result != null) return result;
    const newResult = this.createItem();
    this.set(key, newResult);
    return newResult;
  }
}
