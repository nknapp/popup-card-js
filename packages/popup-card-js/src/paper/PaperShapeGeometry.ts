import { ConvexGeometry, Triangle, Vector3 } from "../vendor/three.ts";
import { TypedRecord } from "../utils/TypedRecord.ts";

export type Point3d = Readonly<[x: number, y: number, y: number]>;
interface PaperShapeGeometryInit {
  points3d: Readonly<Record<string, Point3d>>;
  boundary: string[];
  thickness?: number;
}

export class PaperShapeGeometry extends ConvexGeometry {
  constructor(init: PaperShapeGeometryInit) {
    const vectors = init.boundary
      ? init.boundary.map((pointId) => new Vector3(...init.points3d[pointId]))
      : TypedRecord.values(init.points3d).map(
          (point: Point3d) => new Vector3(...point),
        );
    const normal = new Triangle()
      .setFromPointsAndIndices(vectors, 0, 1, 2)
      .getNormal(new Vector3(0, 0, 0))
      .normalize()
      .multiplyScalar(init.thickness ? init.thickness / 2 : 0.001);
    const convexVectors = [
      ...vectors.map((vector) => vector.clone().add(normal)),
      ...vectors.map((vector) => vector.clone().sub(normal)),
    ];
    super(convexVectors);
  }
}
