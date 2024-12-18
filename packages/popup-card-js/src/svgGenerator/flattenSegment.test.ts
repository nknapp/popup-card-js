import { Point3d } from "./model";
import { describe, expect, it } from "vitest";
import { Matrix4, Vector3 } from "../vendor/three";
import { flattenSegment } from "./flattenSegment";

describe("flattenSegment", () => {
  it("rotates a segment to z=2", () => {
    const points = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 1],
    ] as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
  });

  it("rotates a translated segment to z=0", () => {
    const points = [
      [0.5, 1, 1],
      [1, 1, 1],
      [0, 2, 2],
    ] as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
  });

  it("retains the position of points in the xy-plane", () => {
    const points = [
      [0.5, 1, 0],
      [1, 1, 0],
      [0, 2, 1],
    ] as const;
    const result = applyMatrix(points, flattenSegment(points));
    verifyFlatTriangle(points, result);
    expect(result[0]).toEqual([0.5, 1, 0]);
    expect(result[1]).toEqual([1, 1, 0]);
  });

  it("applies the pre-matrix before computing the position of points", () => {
    const points = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 2, 1],
    ] as const;
    const previousMatrix = new Matrix4().makeTranslation(new Vector3(1, 0, 0));
    const result = applyMatrix(points, flattenSegment(points, previousMatrix));
    verifyFlatTriangle(points, result);
    expect(result[0]).toEqual([1, 1, 0]);
    expect(result[1]).toEqual([2, 1, 0]);
  });

  it("Allows for small deviations when checking for z=0", () => {
    const points = [
      [0, 2, 2],
      [1, 1, 1],
      [0, 1, 1],
    ] as const;
    const previousMatrix = new Matrix4().makeTranslation(
      new Vector3(1, 0, -0.999999),
    );
    const result = applyMatrix(points, flattenSegment(points, previousMatrix));
    verifyFlatTriangle(points, result);
    expect(result[1]).toEqual([2, 1, 0]);
    expect(result[2]).toEqual([1, 1, 0]);
  });
});

type TrianglePoints = Readonly<[A: Point3d, B: Point3d, C: Point3d]>;

function applyMatrix(points: TrianglePoints, matrix: Matrix4): TrianglePoints {
  return points.map((point) => {
    const vector = new Vector3(...point);
    vector.applyMatrix4(matrix);
    return vector.toArray();
  }) as unknown as TrianglePoints;
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
  expect(flat[0][2], "A must have z=0").toBeCloseTo(0, 2);
  expect(flat[1][2], "B must have z=0").toBeCloseTo(0, 2);
  expect(flat[2][2], "C must have z=0").toBeCloseTo(0, 2);
  expectSameDistance(original[0], original[1], flat[0], flat[1]);
  expectSameDistance(original[1], original[2], flat[1], flat[2]);
  expectSameDistance(original[2], original[0], flat[2], flat[0]);
}
