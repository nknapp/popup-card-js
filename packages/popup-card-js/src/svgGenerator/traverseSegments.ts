export interface TraverseSegmentsInput {
  segments: string[];
  folds: [left: string, right: string][];
}

export type TraverseResult = [segment: string, previous: string | null];

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
    for (const result of this.#traverseFolds(this.input.segments[0], null)) {
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

  *#traverseFolds(segment: string, previous: string | null): Generator<TraverseResult> {
    if (this.visitedSegments.has(segment)) return;
    yield [segment, previous];
    this.visitedSegments.add(segment);
    for (const next of this.foldLookup.get(segment) ?? []) {
      yield* this.#traverseFolds(next, segment);
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
