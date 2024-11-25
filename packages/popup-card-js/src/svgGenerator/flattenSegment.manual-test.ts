import { Matrix4, Vector3 } from "../vendor/three";
import { Point3d } from "../paper/Paper";
import { mapValues } from "../utils/mapValues";
import { flattenSegment } from "./flattenSegment";
import { TypedRecord } from "../utils/TypedRecord";
import {
  initVisualizer,
  testVisualizer,
} from "../manual-testing/utils/testVisualizer.ts";

const points = {
  A: [0, 2, 2],
  C: [3, 1, 1],
  B: [1, 1, 1],
} as const;

const previousMatrix = new Matrix4().makeTranslation(new Vector3(1, 0, -0.99));

export function manualTest(container: HTMLDivElement) {
  initVisualizer(container);
  testVisualizer.addShape({
    label: "original",
    points3d: points,
    boundary: TypedRecord.keys(points),
    color: "green",
  });

  testVisualizer.addShape({
    label: "pretransform",
    points3d: applyMatrix(points, previousMatrix),
    boundary: TypedRecord.keys(points),
    color: "blue",
  });
  const matrix = flattenSegment(Object.values(points), previousMatrix);
  const result = mapValues(points, (point) => {
    const vector = new Vector3(...point);
    vector.applyMatrix4(matrix);
    return vector.toArray() as Point3d;
  });
  testVisualizer.addShape({
    label: "result",
    points3d: result,
    boundary: TypedRecord.keys(points),
    color: "red",
  });
}

function applyMatrix(
  points: Readonly<Record<string, Point3d>>,
  matrix: Matrix4,
): Readonly<Record<string, Point3d>> {
  return mapValues(points, (point) => {
    const vector = new Vector3(...point);
    vector.applyMatrix4(matrix);
    return vector.toArray() as Point3d;
  });
}
