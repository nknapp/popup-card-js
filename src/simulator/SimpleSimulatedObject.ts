import {Mesh, Scene} from "three";
import type { RigidBody, World } from "../rapier";
import { rapier } from "../rapier";
import {ISimulatedObject} from "./Simulator.ts";

interface PhysicalProperties {
  fixed: boolean;
  /**
   * The friction of the object.
   * A number between 0 and 1
   */
  friction: number;
  restitution: number;
}

export class SimpleSimulatedObject implements ISimulatedObject {
  rigidBody?: RigidBody;
  mesh: Mesh;
  private physicalProperties: PhysicalProperties;

  constructor(
    mesh: Mesh,
    physicalProperties: Partial<PhysicalProperties> = {},
  ) {
    this.mesh = mesh;
    this.physicalProperties = {
      fixed: false,
      friction: 1,
      restitution: 0,
      ...physicalProperties,
    };
  }

  public addToScene(scene: Scene) {
    scene.add(this.mesh)
  }

  public addToPhysicsWorld(physicsWorld: World) {
    const rigidBodyDesc = new rapier.RigidBodyDesc(
      this.physicalProperties.fixed
        ? rapier.RigidBodyType.Fixed
        : rapier.RigidBodyType.Dynamic,
    );
    rigidBodyDesc.setCcdEnabled(true);
    this.rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
    const positions = this.mesh.geometry.getAttribute("position");
    const colliderDesc = rapier.ColliderDesc.convexHull(
      new Float32Array(positions.array),
    );
    colliderDesc!.setFriction(this.physicalProperties.friction);
    const collider = physicsWorld.createCollider(colliderDesc!, this.rigidBody);
    this.rigidBody.setTranslation(this.mesh.position, false);
    this.rigidBody.setRotation(this.mesh.quaternion, false);
    collider.setRestitution(this.physicalProperties.restitution);
  }

  public updateFromCollider(): void {
    if (this.rigidBody != null) {
      const t = this.rigidBody.translation();
      this.mesh.position.set(t.x, t.y, t.z);
      this.mesh.quaternion.copy(this.rigidBody.rotation());
    }
  }
}
