import type { FoldedPaperSpec } from "popup-card-js";

export function createBaseCard(cardThickness = 0.1): FoldedPaperSpec {
  return {
    points3d: {
      p1: [-0.5, -cardThickness, 0.5],
      p2: [-0.5, -cardThickness, 0],
      p3: [-0.5, -cardThickness, -0.5],
      p4: [0.5, -cardThickness, -0.5],
      p5: [0.5, -cardThickness, 0],
      p6: [0.5, -cardThickness, 0.5],
    },
    segments: {
      a: ["p1", "p2", "p5", "p6"],
      b: ["p2", "p3", "p4", "p5"],
    },
    fixedSegments: ["b"],
    folds: {
      one: ["b", "a"],
    },
    motors: ["one"],
    color: "green",
    thickness: cardThickness,
  } as const;
}
