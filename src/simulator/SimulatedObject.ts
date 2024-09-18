import { Mesh } from "three";
import type { World, RigidBody } from "../rapier";
import { rapier } from "../rapier";

export class SimulatedObject {
  rigidBody?: RigidBody;

  constructor(public threejsObject: Mesh) {}

  public addToPhysicsWorld(physicsWorld: World) {
    this.rigidBody = physicsWorld.createRigidBody(
      rapier.RigidBodyDesc.dynamic().setCcdEnabled(true),
    );
    const positions = this.threejsObject.geometry.getAttribute("position");
  console.log("positions", this.threejsObject);
    const meshIndexes =
      this.threejsObject.geometry.getIndex()?.array;
    const indexes =
      meshIndexes != null
        ? new Uint32Array([...meshIndexes])
        : createUint32Range(positions.array.length / 3);
    const colliderDesc = rapier.ColliderDesc.trimesh(
      new Float32Array([...positions.array]),
      indexes,
    );
    const collider = physicsWorld.createCollider(colliderDesc, this.rigidBody);
    collider.setRestitution(0);
  }

  public updateFromCollider(): void {
    if (this.rigidBody != null) {
      const t = this.rigidBody.translation();
      this.threejsObject.position.set(t.x, t.y, t.z);
      this.threejsObject.quaternion.copy(this.rigidBody.rotation());
    }
  }
}

function createUint32Range(length: number) {
  const result = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = i;
  }
  return result;
}
