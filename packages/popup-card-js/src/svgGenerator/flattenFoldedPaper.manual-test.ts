import {
  initVisualizer,
  testVisualizer,
} from "../manual-testing/utils/testVisualizer.ts";

import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types.ts";
import { flattenFoldedPaper } from "./flattenFoldedPaper.ts";
import { Point3d } from "./model.ts";
import {Matrix4, Vector3, degToRad} from "../vendor/three.ts";


const foldedPaper = {
  points3d: {
    B1: [-1, 0, -1],
    B2: [-1, 0, 1],
    B3: [1, 0, 1],
    B4: [1, 0, -1],
    B5: [-1, 0, -1],
    glue1: [-0.75, 0, -0.75],
    glue2a: [-0.75, 0, 0.75],
    glue2b: [-0.75, 0, 0.75],
    glue3: [0.75, 0, 0.75],
    T1: [-1.5, 1, -1.5],
    T2: [-1.5, 1, 1.5],
    T3: [1.5, 1, 1.5],
    T4: [1.5, 1, -1.5],
    T5: [-1.5, 1, -1.5],
  },
  segments: {
    S1: ["B1", "B2", "T2", "T1"],
    glue1: ["B1", "glue1", "glue2a", "B2"],
    S2: ["B2", "B3", "T3", "T2"],
    glue2: ["B2", "glue2b", "glue3", "B3"],
    S3: ["B3", "B4", "T4", "T3"],
    S4: ["B4", "B5", "T5", "T4"],
  },
  folds: {
    F12: ["S1", "S2"],
    F23: ["S2", "S3"],
    F34: ["S3", "S4"],
    glue1: ["S1", "glue1"],
    glue2: ["S2", "glue2"],
  },
  color: "green",
} satisfies FoldedPaperSpec;

export function manualTest(container: HTMLDivElement) {
  initVisualizer(container, { cameraPosition: [10, 10, 10] });

  show({ ...foldedPaper, color: "green" });

  const points2d = flattenFoldedPaper(foldedPaper);
  const flatPoints3d = Object.fromEntries(
    points2d.entries().map(([key, value]) => [key, [value[0], value[1], 0]]),
  ) as Record<string, Point3d>;
  show({ ...foldedPaper, points3d: flatPoints3d, color: "red" }, new Matrix4().makeRotationX(degToRad(90)).premultiply(new Matrix4().makeTranslation(new Vector3(0, -2,0))));
}

function show(foldedPaper: FoldedPaperSpec, transform?: Matrix4) {
  for (const [segment, pointIds] of Object.entries(foldedPaper.segments)) {
    testVisualizer.addShape({
      label: segment,
      points3d: foldedPaper.points3d,
      boundary: pointIds,
      color: foldedPaper.color,
      transform,
    });
  }
  for (const [key,[left,right]] of Object.entries(foldedPaper.folds)) {
    const pointIds = intersection(foldedPaper.segments[left], foldedPaper.segments[right])
    const from = new Vector3(...foldedPaper.points3d[pointIds[0]])
    const to = new Vector3(...foldedPaper.points3d[pointIds[1]])
    if (transform) {
      from.applyMatrix4(transform)
      to.applyMatrix4(transform)
    }
    testVisualizer.addLine(from, to)
  }
}

function intersection<T>(array1:T[], array2:T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => set2.has(item))
}


