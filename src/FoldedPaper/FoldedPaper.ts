import { Paper } from "../paper/Paper.ts";
import { ISimulatedObject } from "../simulator/Simulator.ts";
import { Vector3, Scene } from "../vendor/three";
import { MotorModel, RevoluteImpulseJoint, World } from "../vendor/rapier";
import { FoldedPaperSpec } from "./FoldedPaper.types.ts";
import type { Rapier } from "../vendor/rapier.ts";
import { mapValues } from "../utils/mapValues.ts";
import { TypedRecord} from "../utils/TypedRecord.ts";

const PAPER_DENSITY = 1;
const MOTOR_STIFFNESS = 10000;
const MOTOR_DAMPING = 10000;

export interface FoldData<PlaneId extends string> {
  segment1: PlaneId;
  segment2: PlaneId;
  point1: Vector3;
  point2: Vector3;
}

export class FoldedPaper<
  PointId extends string,
  PlaneId extends string,
  FoldId extends string,
  MotorId extends FoldId,
> implements ISimulatedObject
{
  segments: Record<PlaneId, Paper<PointId>>;
  folds: Record<string, FoldData<PlaneId>>;
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
          density: PAPER_DENSITY,
          dominance: spec.dominance && spec.dominance[name],
          thickness: spec.thickness ?? 0.001,
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
    for (const segment of TypedRecord.values(this.segments)) {
      segment.addToScene(scene);
    }
  }

  addDebugObjects(scene: Scene) {
    for (const segment of TypedRecord.values(this.segments)) {
      segment.addDebugObjects(scene);
    }
  }

  updateFromCollider() {
    for (const segment of TypedRecord.values(this.segments)) {
      segment.updateFromCollider();
    }
  }

  addToPhysicsWorld(world: World, rapier: Rapier) {
    for (const segment of TypedRecord.values(this.segments)) {
      segment.addToPhysicsWorld(world, rapier);
    }
    for (const [name, joint] of TypedRecord.entries(this.folds)) {
      const segment1 = this.segments[joint.segment1];
      const segment2 = this.segments[joint.segment2];

      const jointData = this.createFoldSpringJoint(joint, rapier);

      const foldJoint = world.createImpulseJoint(
        jointData,
        segment1.rigidBody!,
        segment2.rigidBody!,
        true,
      ) as RevoluteImpulseJoint;

      if (this.spec.motors != null && includes(this.spec.motors, name)) {
        foldJoint.configureMotorModel(MotorModel.AccelerationBased);
        this.motors[name] = foldJoint;
      }
    }
  }

  private createFoldSpringJoint(
    joint: {
      segment1: PlaneId;
      segment2: PlaneId;
      point1: Vector3;
      point2: Vector3;
    },
    rapier: Rapier,
  ) {
    const jointData = rapier.JointData.revolute(
      joint.point1,
      joint.point1,
      joint.point1.clone().sub(joint.point2),
    );
    jointData.stiffness = 1;
    jointData.damping = 1;
    return jointData;
  }

  setFoldAngle(motor: MotorId, angle: number) {
    if (isNaN(angle)) {
      throw new Error("Angle must be a number");
    }
    this.wakeup();
    this.motors[motor].configureMotorPosition(
      angle,
      MOTOR_STIFFNESS,
      MOTOR_DAMPING,
    );
  }

  wakeup() {
    for (const segment of TypedRecord.values(this.segments)) {
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
