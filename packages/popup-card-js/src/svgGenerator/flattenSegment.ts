import { Point3d } from "./model";
import { Matrix4, Triangle, Vector3 } from "../vendor/three";
import { TypedRecord } from "../utils/TypedRecord";

/**
 * Rotate and translate a segment to the xy-plane.
 * If there are points in the xy-plane, already they retain their position, so that
 * rotation is around a potential line inside the xy-plane. This allows segments to
 * retain their position relative to already flattened neighbouring segments.
 * @param points the points of the segment, which are expected to be in one plane.
 * @param previousMatrix the matrix to apply before rotating the segment to the xy-plane.
 */
export function flattenSegment<T extends string>(
  points: Readonly<Record<T, Point3d>>,
  previousMatrix?: Matrix4,
): Matrix4 {
  const vectors = TypedRecord.values(points).map((point) =>
    new Vector3().fromArray(point),
  );
  if (previousMatrix) {
    for (const vector of vectors) {
      vector.applyMatrix4(previousMatrix);
    }
  }

  vectors.sort((a, b) => a.z - b.z);
  const referencePoint = vectors[0];

  const trianglePoints = [vectors[0], vectors[1], vectors[vectors.length - 1]];

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
