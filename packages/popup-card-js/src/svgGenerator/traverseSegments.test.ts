import { describe, expect, it } from "vitest";
import { TraverseResult, traverseSegments } from "./traverseSegments.ts";

describe("iterateSegments", () => {
  it("iterates a single segment", () => {
    expect(
      getUpTo20Items(
        traverseSegments({
          segments: ["A"],
          folds: [],
        }),
      ),
    ).toEqual([["A", null]]);
  });

  it("follows segments along folds", () => {
    expect(
      getUpTo20Items(
        traverseSegments({
          segments: ["A", "B"],
          folds: [["A", "B"]],
        }),
      ),
    ).toEqual([
      ["A", null],
      ["B", "A"],
    ]);
  });

  it("throws if there are unconnected segments", () => {
    expect(() =>
      getUpTo20Items(
        traverseSegments({
          segments: ["A", "B", "C"],
          folds: [["A", "B"]],
        }),
      ),
    ).toThrow("Unconnected segments found: C");
  });

  it("follows multiple segments along folds", () => {
    expect(
      getUpTo20Items(
        traverseSegments({
          segments: ["A", "B", "C"],
          folds: [
            ["A", "B"],
            ["B", "C"],
          ],
        }),
      ),
    ).toEqual([
      ["A", null],
      ["B", "A"],
      ["C", "B"],
    ]);
  });

  it("follows multiple segments adjacent to the same", () => {
    const result = getUpTo20Items(
      traverseSegments({
        segments: ["A", "B", "C"],
        folds: [
          ["A", "C"],
          ["A", "B"],
        ],
      }),
    );
    expect(new Map(result)).toEqual(
      new Map([
        ["A", null],
        ["B", "A"],
        ["C", "A"],
      ]),
    );
  });

  it("follows folds in both directions", () => {
    const result = getUpTo20Items(
      traverseSegments({
        segments: ["A", "B", "C"],
        folds: [
          ["C", "A"],
          ["A", "B"],
        ],
      }),
    );
    expect(new Map(result)).toEqual(
      new Map([
        ["A", null],
        ["B", "A"],
        ["C", "A"],
      ]),
    );
  });

  it("complex test", () => {
    const result = getUpTo20Items(
      traverseSegments({
        segments: ["A", "B", "C", "D", "E"],
        folds: [
          ["A", "C"],
          ["C", "B"],
          ["C", "D"],
          ["E", "D"],
        ],
      }),
    );
    expect(new Map(result)).toEqual(
      new Map([
        ["A", null],
        ["C", "A"],
        ["B", "C"],
        ["D", "C"],
        ["E", "D"],
      ]),
    );
  });
});

function getUpTo20Items(items: Iterable<TraverseResult>): TraverseResult[] {
  const result = [];
  for (const item of items) {
    result.push(item);
    if (result.length > 20) {
      return result;
    }
  }
  return result;
}
