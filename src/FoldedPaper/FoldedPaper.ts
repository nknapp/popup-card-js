import { Paper } from "../paper/Paper.ts";
import { ISimulatedObject } from "../simulator/Simulator.ts";
import { Scene, Vector3 } from "three";
import {
  MotorModel,
  RevoluteImpulseJoint,
  World,
} from "@dimforge/rapier3d-compat";
import { FoldedPaperSpec } from "./FoldedPaper.types.ts";
import { rapier } from "../rapier";
import { mapValues } from "../utils/mapValues.ts";
import { entries, values } from "../utils/typeObjectHelpers.ts";

export class FoldedPaper<
  PointId extends string,
  PlaneId extends string,
  FoldId extends string,
  MotorId extends FoldId,
> implements ISimulatedObject
{
  segments: Record<PlaneId, Paper<PointId>>;
  folds: Record<
    string,
    { segment1: PlaneId; segment2: PlaneId; point1: Vector3; point2: Vector3 }
  >;
  motors: Record<MotorId, RevoluteImpulseJoint> = {} as Record<
    MotorId,
    RevoluteImpulseJoint
  >;

  constructor(
    private spec: FoldedPaperSpec<PointId, PlaneId, FoldId, MotorId>,
  ) {
    this.segments = mapValues(
      spec.segments,
      (boundary, name) =>
        new Paper({
          points3d: spec.points3d,
          boundary,
          color: spec.color,
          fixed: spec.fixedSegments && includes(spec.fixedSegments, name),
        }),
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
    for (const segment of values(this.segments)) {
      segment.addToScene(scene);
    }
  }

  addDebugObjects(scene: Scene) {
    for (const segment of values(this.segments)) {
      segment.addDebugObjects(scene);
    }
  }

  updateFromCollider() {
    for (const segment of values(this.segments)) {
      segment.updateFromCollider();
    }
  }

  addToPhysicsWorld(world: World) {
    for (const segment of values(this.segments)) {
      segment.addToPhysicsWorld(world);
    }
    for (const [name, joint] of entries(this.folds)) {
      const jointData = rapier.JointData.revolute(
        joint.point1,
        joint.point1,
        joint.point1.clone().sub(joint.point2),
      );
      const segment1 = this.segments[joint.segment1];
      const segment2 = this.segments[joint.segment2];
      const foldJoint = world.createImpulseJoint(
        jointData,
        segment1.rigidBody!,
        segment2.rigidBody!,
        true,
      ) as RevoluteImpulseJoint;
      if (this.spec.motors != null && includes(this.spec.motors, name)) {
        foldJoint.configureMotorModel(MotorModel.ForceBased);
        this.motors[name] = foldJoint;
      }
    }
  }

  setFoldAngle(motor: MotorId, angle: number) {
    this.wakeup();
    this.motors[motor].configureMotor(
      (Math.PI * angle) / 180,
      0,
      20,
      10,
    );
  }

  wakeup() {
    for (const segment of values(this.segments)) {
      segment.rigidBody?.wakeUp();
    }
  }
}

function includes<Haystack extends string, Needle extends Haystack>(
  array: Needle[],
  item: Haystack,
): item is Needle {
  return array.includes(item as Needle);
}
