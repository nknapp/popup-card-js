import { describe, expect, it } from "vitest";
import { Paper } from "./Paper.ts";

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

    const position = getPosition(paper);
    expect(new Set(position)).toEqual(
      new Set([
        " 0.001  0.000  0.000",
        " 0.001  0.000  1.000",
        " 0.001  1.000  0.000",
        " 0.001  1.000  1.000",
        "-0.001  0.000  0.000",
        "-0.001  0.000  1.000",
        "-0.001  1.000  0.000",
        "-0.001  1.000  1.000",
      ]),
    );
  });

  it("allows partial boundaries", () => {
    const paper = new Paper<"p1" | "p2" | "p3" | "p4">({
      points3d: {
        p1: [0, 0, 0],
        p2: [0, 0, 1],
        p3: [0, 1, 1],
        p4: [0, 1, 0],
      },
      boundary: ["p2", "p3", "p4"],
    });

    const position = getPosition(paper);
    expect(new Set(position)).toEqual(
      new Set([
        " 0.001  0.000  1.000",
        " 0.001  1.000  0.000",
        " 0.001  1.000  1.000",
        "-0.001  0.000  1.000",
        "-0.001  1.000  0.000",
        "-0.001  1.000  1.000",
      ]),
    );
  });
});

function getPosition(paper: Paper<string>): string[] {
  return toArrayOfPoint3d(
    Array.from(paper.mesh.geometry.getAttribute("position").array),
  );
}

const format = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3,
});

function toArrayOfPoint3d(numbers: number[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < numbers.length; i += 3) {
    result.push(
      [
        format.format(numbers[i]).padStart(6, " "),
        format.format(numbers[i + 1]).padStart(6, " "),
        format.format(numbers[i + 2]).padStart(6, " "),
      ].join(" "),
    );
  }
  return result;
}
