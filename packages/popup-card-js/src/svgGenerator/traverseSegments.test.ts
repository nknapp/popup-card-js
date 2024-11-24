import { describe, expect, it } from "vitest";
import { traverseSegments } from "./traverseSegments.ts";

describe("iterateSegments", () => {
  it("iterates a single segment", () => {
    expect(
      getUpTo20Items(
        traverseSegments({
          segments: ["A"],
          folds: [],
        }),
      ),
    ).toEqual([["A", []]]);
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
      ["A", []],
      ["B", ["A"]],
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
      ["A", []],
      ["B", ["A"]],
      ["C", ["A", "B"]],
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
        ["A", []],
        ["B", ["A"]],
        ["C", ["A"]],
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
        ["A", []],
        ["B", ["A"]],
        ["C", ["A"]],
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
        ["A", []],
        ["C", ["A"]],
        ["B", ["A", "C"]],
        ["D", ["A", "C"]],
        ["E", ["A", "C", "D"]],
      ]),
    );
  });
});

function getUpTo20Items<T>(items: Iterable<T>): T[] {
  const result = [];
  for (const item of items) {
    result.push(item);
    if (result.length > 20) {
      return result;
    }
  }
  return result;
}
