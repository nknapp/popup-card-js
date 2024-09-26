import { SimpleSimulatedObject } from "../simulator/SimpleSimulatedObject.ts";
import { Mesh, MeshStandardMaterial, Triangle, Vector3 } from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";

export type Point3d = [x: number, y: number, y: number];

export interface PaperInit<PointId extends string> {
  points3d: Record<PointId, Point3d>;
  boundary: PointId[];
}

export class Paper<PointId extends string> extends SimpleSimulatedObject {
  constructor(init: PaperInit<PointId>) {
    console.log("initpaper", init)
    const vectors = init.boundary
      ? init.boundary.map((pointId) => new Vector3(...init.points3d[pointId]))
      : values(init.points3d).map((point: Point3d) => new Vector3(...point));
    const center = computeCenter(vectors);
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
      new MeshStandardMaterial({ color: "green" }),
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

const values = Object.values as <K extends string, V>(
  record: Record<K, V>,
) => V[];
