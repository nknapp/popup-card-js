import { describe, expect, it } from "vitest";
import { Paper, Point3d } from "./Paper.ts";

describe("Paper", () => {
  it("creates a slightly convex shape", () => {
    const paper = new Paper({
      points3d: {
        p1: [0, 0, 0],
        p2: [0, 0, 1],
        p3: [0, 1, 1],
        p4: [0, 1, 0],
      },
      boundary: ["p1", "p2", "p3", "p4"],
    });

    expect(getPosition(paper)).toEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ]);
    expect(getIndex(paper)).toEqual([0, 1, 2, 0, 2, 3]);
  });
});



function getIndex(paper: Paper<string>): number[] {
  if (paper.mesh.geometry.index == null)
    throw new Error("index should not be null");

  return Array.from(paper.mesh.geometry.index.array);
}

function getPosition(paper: Paper<string>): Point3d[] {
  return toArrayOfPoint3d(
      Array.from(paper.mesh.geometry.getAttribute("position").array),
  );
}

function toArrayOfPoint3d(numbers: number[]): Point3d[] {
  const result: Point3d[] = [];
  for (let i = 0; i < numbers.length; i += 3) {
    result.push([numbers[i], numbers[i + 1], numbers[i + 2]]);
  }
  return result;
}
