import { SimpleSimulatedObject } from "../simulator/SimpleSimulatedObject.ts";
import {
  Group,
  Mesh,
  MeshStandardMaterial,
  Triangle,
  Vector3,
  CSS2DObject,
  ConvexGeometry,
} from "../vendor/three";
import { TypedRecord } from "../utils/TypedRecord.ts";

export type Point3d = [x: number, y: number, y: number];

export interface PaperInit<PointId extends string> {
  points3d: Record<PointId, Point3d>;
  boundary: PointId[];
  color: string;
  fixed?: boolean;
  density?: number;
  dominance?: number;
  thickness?: number;
}

export class Paper<PointId extends string> extends SimpleSimulatedObject {
  constructor(init: PaperInit<PointId>) {
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
    const geometry = new ConvexGeometry(convexVectors);
    const mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({ color: init.color }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const debugObjects = new Group();
    debugObjects.layers.enableAll();
    debugObjects.add(
      ...init.boundary.map((name) => {
        const point: Point3d = init.points3d[name];
        const labelDiv = document.createElement("div");
        labelDiv.style.margin = "0";
        labelDiv.style.color = init.color;
        labelDiv.style.padding = "5px";
        labelDiv.style.borderRadius = "5px";
        labelDiv.style.background = "white";
        labelDiv.style.opacity = "0.5";
        labelDiv.innerHTML = name;
        const pointLabel = new CSS2DObject(labelDiv);
        pointLabel.position.set(...point);
        pointLabel.center.set(0, 0);
        pointLabel.layers.set(0);
        return pointLabel;
      }),
    );

    super(
      mesh,
      {
        restitution: 0,
        friction: 1,
        fixed: init.fixed ?? false,
        density: init.density ?? 1,
        dominance: init.dominance ?? 0,
        disableCollision: true,
      },
      debugObjects,
    );
  }
}
