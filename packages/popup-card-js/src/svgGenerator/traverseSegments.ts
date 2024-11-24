export interface TraverseSegmentsInput {
  segments: string[];
  folds: [left: string, right: string][];
}

export type TraverseResult = [segment: string, path: string[]];

export function traverseSegments({
  segments,
  folds,
}: TraverseSegmentsInput): Generator<TraverseResult> {
  return new Traverser({ segments, folds }).traverse();
}

class Traverser {
  private foldLookup: Map<string, string[]>;
  private visitedSegments = new Set<string>();

  constructor(private input: TraverseSegmentsInput) {
    const foldLookup = new LazyMap<string, string[]>(() => []);
    for (const fold of input.folds) {
      foldLookup.lazyGet(fold[0]).push(fold[1]);
      foldLookup.lazyGet(fold[1]).push(fold[0]);
    }
    this.foldLookup = foldLookup;
  }

  *traverse() {
    for (const result of this._traverse()) {
      yield result;
    }
    if (this.visitedSegments.size < this.input.segments.length) {
      throw new Error(
        "Unconnected segments found: " +
          this.input.segments.filter(
            (segment) => !this.visitedSegments.has(segment),
          ),
      );
    }
  }

  *_traverse(
    current = this.input.segments[0],
    path: string[] = [],
  ): Generator<TraverseResult> {
    if (this.visitedSegments.has(current)) return;
    yield [current, path];
    this.visitedSegments.add(current)
    for (const next of this.foldLookup.get(current) ?? []) {
      yield* this._traverse(next, [...path, current]);
    }
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
