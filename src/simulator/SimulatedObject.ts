import { Mesh } from "three";
import type { World, RigidBody } from "../rapier";
import { rapier } from "../rapier";

interface PhysicalProperties {
  fixed?: boolean;
}

export class SimulatedObject {
  rigidBody?: RigidBody;

  constructor(
    public threejsObject: Mesh,
    private physicalProperties: PhysicalProperties = {},
  ) {}

  public addToPhysicsWorld(physicsWorld: World) {
    const rigidBodyDesc = new rapier.RigidBodyDesc(
      this.physicalProperties.fixed
        ? rapier.RigidBodyType.Fixed
        : rapier.RigidBodyType.Dynamic,
    );
    rigidBodyDesc.setCcdEnabled(true);
    this.rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
    const positions = this.threejsObject.geometry.getAttribute("position");
    const colliderDesc = rapier.ColliderDesc.convexHull(
      new Float32Array([...positions.array]),
    );
    colliderDesc!.setFriction(0.5);
    const collider = physicsWorld.createCollider(colliderDesc!, this.rigidBody);
    this.rigidBody.setTranslation(this.threejsObject.position, false);
    this.rigidBody.setRotation(this.threejsObject.quaternion, false);
    collider.setRestitution(0.1);
  }

  public updateFromCollider(): void {
    if (this.rigidBody != null) {
      const t = this.rigidBody.translation();
      this.threejsObject.position.set(t.x, t.y, t.z);
      this.threejsObject.quaternion.copy(this.rigidBody.rotation());
    }
  }
}

