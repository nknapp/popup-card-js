import { Mesh, Object3D, Scene } from "three";
import type { RigidBody, World } from "../rapier";
import { rapier } from "../rapier";
import { ISimulatedObject } from "./Simulator.ts";

interface PhysicalProperties {
  fixed: boolean;
  /**
   * The friction of the object.
   * A number between 0 and 1
   */
  friction: number;
  restitution: number;
  density: number;
  dominance: number
}

export class SimpleSimulatedObject implements ISimulatedObject {
  rigidBody?: RigidBody;
  mesh: Mesh;
  private physicalProperties: PhysicalProperties;

  constructor(
    mesh: Mesh,
    physicalProperties: Partial<PhysicalProperties> = {},
    private debugObject?: Object3D,
  ) {
    this.mesh = mesh;
    this.physicalProperties = {
      fixed: false,
      friction: 1,
      restitution: 0,
      density: 1,
      dominance: 0,
      ...physicalProperties,
    };
  }

  public addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  public addDebugObjects(scene: Scene) {
    if (this.debugObject) {
      scene.add(this.debugObject);
    }
  }

  public addToPhysicsWorld(physicsWorld: World) {
    const rigidBodyDesc = new rapier.RigidBodyDesc(
      this.physicalProperties.fixed
        ? rapier.RigidBodyType.Fixed
        : rapier.RigidBodyType.Dynamic,
    )
      .setLinearDamping(1)
      .setAngularDamping(1.3);
    rigidBodyDesc.setCcdEnabled(true);
    rigidBodyDesc.setDominanceGroup(this.physicalProperties.dominance)
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
    collider.setDensity(this.physicalProperties.density);

  }

  public updateFromCollider(): void {
    if (this.rigidBody != null) {
      this.mesh.position.copy(this.rigidBody.translation());
      this.mesh.quaternion.copy(this.rigidBody.rotation());
      this.debugObject?.position.copy(this.rigidBody.translation());
      this.debugObject?.quaternion.copy(this.rigidBody.rotation());
    }
  }
}
