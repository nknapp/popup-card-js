import { SimulatedObject } from "../simulator/SimulatedObject.ts";
import {DoubleSide, Mesh, MeshStandardMaterial, Triangle, Vector3} from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";

export type Point3d = [x: number, y: number, y: number];

export interface PaperInit<PointId extends string> {
  points3d: Record<PointId, Point3d>;
  boundary: PointId[];
}

export class Paper<PointId extends string> extends SimulatedObject {
  constructor(init: PaperInit<PointId>) {
    const vectors = init.boundary.map(
      (pointId) => new Vector3(...init.points3d[pointId]),
    );
    const center = computeCenter(vectors)
    const normal = new Triangle()
        .setFromPointsAndIndices(vectors, 0, 1, 2)
        .getNormal(new Vector3(0, 0, 0))
        .normalize()
        .multiplyScalar(0.01);
    const convexVectors = [
      ...vectors,
      center.clone().add(normal),
      center.clone().sub(normal),
    ];
    const geometry = new ConvexGeometry(convexVectors);
    const mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({ color: "green", side: DoubleSide }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    super(mesh);
  }
}


function computeCenter(vectors: Vector3[]): Vector3 {
  const center = new Vector3();
  for (const v of vectors) {
    center.add(v);
  }
  center.divideScalar(vectors.length);
  return center;
}