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
    ).toEqual(["A"]);
  });

  it("follows segments along folds", () => {
    expect(
      getUpTo20Items(
        traverseSegments({
          segments: ["A", "B"],
          folds: [["A", "B"]],
        }),
      ),
    ).toEqual(["A", "B"]);
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
    ).toEqual(["A", "B", "C"]);
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
    expect(result[0]).toEqual("A");
    expect(result).toHaveLength(3);
    expect(result.indexOf("B")).toBeGreaterThan(0);
    expect(result.indexOf("C")).toBeGreaterThan(0);
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
    expect(result[0]).toEqual("A");
    expect(result).toHaveLength(3);
    expect(result.indexOf("B")).toBeGreaterThan(0);
    expect(result.indexOf("C")).toBeGreaterThan(0);
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
    expect(result).toEqual(["A", "C", "B", "D", "E"]);
  });
});

function getUpTo20Items(items: Iterable<string>): string[] {
  const result = [];
  for (const item of items) {
    result.push(item);
    if (result.length > 20) {
      return result;
    }
  }
  return result;
}
