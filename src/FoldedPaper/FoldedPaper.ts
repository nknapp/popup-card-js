import { Paper } from "../paper/Paper.ts";
import { ISimulatedObject } from "../simulator/Simulator.ts";
import { Scene, Vector3 } from "three";
import { World } from "@dimforge/rapier3d-compat";
import { FoldedPaperSpec } from "./FoldedPaper.types.ts";
import { rapier } from "../rapier";

export class FoldedPaper<
  PointId extends string,
  PlaneId extends string,
  FoldId extends string,
> implements ISimulatedObject
{
  segments: Record<string, Paper<PointId>>;
  folds: Record<
    string,
    { segment1: PlaneId; segment2: PlaneId; point1: Vector3; point2: Vector3 }
  >;

  constructor(spec: FoldedPaperSpec<PointId, PlaneId, FoldId>) {
    this.segments = mapValues(
      spec.segments,
      (boundary) => new Paper({ points3d: spec.points3d, boundary }),
    );

    this.folds = mapValues(spec.folds, (fold, foldId) => {
      const segment1: PointId[] = spec.segments[fold[0]];
      const segment2: PointId[] = spec.segments[fold[1]];
      const intersection = [
        ...new Set(segment1).intersection(new Set(segment2)),
      ];
      if (intersection.length != 2) {
        throw new Error(
          "Segments adjacent to a fold must have exactly two points common, but I found :" +
            JSON.stringify({
              foldId,
              segment1,
              segment2,
              intersection,
            }),
        );
      }
      return {
        segment1: fold[0],
        segment2: fold[1],
        point1: new Vector3(...spec.points3d[intersection[0]]),
        point2: new Vector3(...spec.points3d[intersection[1]]),
      };
    });
  }

  addToScene(scene: Scene) {
    for (const segment of Object.values(this.segments)) {
      segment.addToScene(scene);
    }
  }
  updateFromCollider() {
    for (const segment of Object.values(this.segments)) {
      segment.updateFromCollider();
    }
  }
  addToPhysicsWorld(world: World) {
    for (const segment of Object.values(this.segments)) {
      segment.addToPhysicsWorld(world);
    }
    for (const joint of Object.values(this.folds)) {
      console.log("create joint", joint, mapValues(this.segments,(segment => segment.rigidBody?.collider(0).vertices())))
      const jointData = rapier.JointData.revolute(
        joint.point1,
        joint.point1,
        joint.point1.clone().sub(joint.point2),
      );
      const segment1 = this.segments[joint.segment1];
      const segment2 = this.segments[joint.segment2];
      world.createImpulseJoint(jointData, segment1.rigidBody!, segment2.rigidBody!, true);
    }
  }
}

function mapValues<K extends string, I, O>(
  obj: Record<K, I>,
  fn: (input: I, key: K) => O,
): Record<K, O> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value as I, key as K)]),
  ) as Record<K, O>;
}
