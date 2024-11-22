import { Point3d } from "./model";
import { describe, expect, it } from "vitest";
import { Matrix4, Vector3 } from "../vendor/three";
import { mapValues } from "../utils/mapValues";
import { flattenSegment } from "./flattenSegment";

describe("flattenSegment", () => {
  it("rotates a segment to z=2", () => {
    const points = {
      A: [0, 1, 0],
      B: [1, 1, 0],
      C: [0, 1, 1],
    } as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
  });

  it("rotates a translated segment to z=0", () => {
    const points = {
      A: [0.5, 1, 1],
      B: [1, 1, 1],
      C: [0, 2, 2],
    } as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
  });

  it("retains the position of points in the xy-plane", () => {
    const points = {
      A: [0.5, 1, 0],
      B: [1, 1, 0],
      C: [0, 2, 1],
    } as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
    expect(result.A).toEqual([0.5, 1, 0]);
    expect(result.B).toEqual([1, 1, 0]);
  });

  it("applies the pre-matrix before computing the position of points", () => {
    const points = {
      A: [0, 1, 0],
      B: [1, 1, 0],
      C: [0, 2, 1],
    } as const;
    const previousMatrix = new Matrix4().makeTranslation(new Vector3(1, 0, 0));
    const result = applyMatrix(points, flattenSegment(points, previousMatrix));
    verifyFlatTriangle(points, result);
    expect(result.A).toEqual([1, 1, 0]);
    expect(result.B).toEqual([2, 1, 0]);
  });

  it("Allows for small deviations when checking for z=0", () => {
    const points = {
      A: [0, 2, 2],
      B: [1, 1, 1],
      C: [0, 1, 1],
    } as const;
    const previousMatrix = new Matrix4().makeTranslation(
      new Vector3(1, 0, -0.999999),
    );
    const result = applyMatrix(points, flattenSegment(points, previousMatrix));
    verifyFlatTriangle(points, result);
    expect(result.B).toEqual([2, 1, 0]);
    expect(result.C).toEqual([1, 1, 0]);
  });
});

interface TrianglePoints {
  readonly A: Point3d;
  readonly B: Point3d;
  readonly C: Point3d;
}

function applyMatrix(points: TrianglePoints, matrix: Matrix4) {
  return mapValues(points, (point) => {
    const vector = new Vector3(...point);
    vector.applyMatrix4(matrix);
    return vector.toArray() as Point3d;
  });
}

function expectSameDistance(
  originalA: Point3d,
  originalB: Point3d,
  flatA: Point3d,
  flatB: Point3d,
) {
  const originalDistance = new Vector3(...originalA).distanceTo(
    new Vector3(...originalB),
  );
  const flatDistance = new Vector3(...flatA).distanceTo(new Vector3(...flatB));
  expect(originalDistance).toBeCloseTo(flatDistance, 2);
}

function verifyFlatTriangle(original: TrianglePoints, flat: TrianglePoints) {
  expect(flat.A[2], "A must have z=0").toBeCloseTo(0, 2);
  expect(flat.B[2], "B must have z=0").toBeCloseTo(0, 2);
  expect(flat.C[2], "C must have z=0").toBeCloseTo(0, 2);
  expectSameDistance(original.A, original.B, flat.A, flat.B);
  expectSameDistance(original.B, original.C, flat.B, flat.C);
  expectSameDistance(original.C, original.A, flat.C, flat.A);
}
