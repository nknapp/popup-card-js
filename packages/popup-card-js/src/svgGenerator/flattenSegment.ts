import { Point3d } from "./model";
import { Matrix4, Triangle, Vector3 } from "../vendor/three";

const zPlaneThreshold = 0.001;
/**
 * Rotate and translate a segment to the xy-plane.
 * If there are points in the xy-plane, already they retain their position, so that
 * rotation is around a potential line inside the xy-plane. This allows segments to
 * retain their position relative to already flattened neighbouring segments.
 * @param points the points of the segment, which are expected to be in one plane.
 * @param previousMatrix the matrix to apply before rotating the segment to the xy-plane.
 */
export function flattenSegment(
  points: Readonly<Point3d[]>,
  previousMatrix?: Matrix4,
): Matrix4 {
  const vectors = new Ring(
    points.map((point) => new Vector3().fromArray(point)),
  );

  if (previousMatrix) {
    for (const vector of vectors) {
      vector.applyMatrix4(previousMatrix);
    }
  }

  if (vectors.items.every(isZ0)) {
    return new Matrix4().identity();
  }

  let trianglePoints: Vector3[];
  const foldIndex = findFoldIndex(vectors);
  if (foldIndex == null) {
    trianglePoints = vectors.items.slice(0, 3);
  } else {
    trianglePoints = [
      vectors.get(foldIndex),
      vectors.get(foldIndex + 1),
      vectors.get(foldIndex + 2),
    ];
  }
  const referencePoint = trianglePoints[0];

  const triangle = new Triangle(...trianglePoints);
  const normal = triangle.getNormal(new Vector3());
  const angle = normal.angleTo(new Vector3(0, 0, 1));
  const rotationAxis = normal
    .clone()
    .cross(new Vector3(0, 0, 1))
    .normalize();
  return new Matrix4()
    .premultiply(previousMatrix ?? new Matrix4())
    .premultiply(
      new Matrix4().makeTranslation(referencePoint.clone().multiplyScalar(-1)),
    )
    .premultiply(new Matrix4().makeRotationAxis(rotationAxis, angle))
    .premultiply(new Matrix4().makeTranslation(referencePoint.clone().setZ(0)));
}

/**
 * Returns the index of the vector that starts the fold. A fold consists of two neighboured vectors
 * in the list and this function return the first one.
 * A vector is assumed to belong to a fold if its z-position is near zero
 * @param vectors
 *
 */
function findFoldIndex(vectors: Ring<Vector3>): number | null {
  for (let i = 0; i < vectors.length; i++) {
    if (isZ0(vectors.get(i)) && isZ0(vectors.get(i + 1))) {
      return i;
    }
  }

  return null;
}

class Ring<T> {
  constructor(public items: T[]) {}

  get(index: number): T {
    return this.items[index % this.items.length];
  }

  get length(): number {
    return this.items.length;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }
}
function isZ0(item: Vector3) {
  return Math.abs(item.z) < zPlaneThreshold;
}
