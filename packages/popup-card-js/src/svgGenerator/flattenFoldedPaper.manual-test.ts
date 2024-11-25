import {
  initVisualizer,
  testVisualizer,
} from "../manual-testing/utils/testVisualizer.ts";

import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types.ts";
import { flattenFoldedPaper } from "./flattenFoldedPaper.ts";
import { Point3d } from "./model.ts";

const foldedPaper = {
  points3d: {
    A1: [1, 0, 1],
    A2: [1, 0, 2],
    AB1: [1, 1, 2],
    AB2: [1, 1, 1],
    B1: [2, 1, 1],
    B2: [2, 1, 2],
  },
  segments: {
    A: ["A1", "A2", "AB1", "AB2"],
    B: ["AB2", "AB1", "B2", "B1"],
  },
  folds: { AB: ["A", "B"] },
  color: "green",
} satisfies FoldedPaperSpec;

export function manualTest(container: HTMLDivElement) {
  initVisualizer(container, { cameraPosition: [10, 10, 10] });

  show({ ...foldedPaper, color: "green" });

  const points2d = flattenFoldedPaper(foldedPaper);
  const flatPoints3d = Object.fromEntries(
    points2d.entries().map(([key, value]) => [key, [value[0], value[1], 0]]),
  ) as Record<string, Point3d>;
  show({ ...foldedPaper, points3d: flatPoints3d, color: "red" });
}

function show(foldedPaper: FoldedPaperSpec) {
  for (const [segment, pointIds] of Object.entries(foldedPaper.segments)) {
    testVisualizer.addShape({
      label: segment,
      points3d: foldedPaper.points3d,
      boundary: pointIds,
      color: foldedPaper.color,
    });
  }
}
