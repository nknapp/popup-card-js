import { ISimulatedObject } from "../simulator/Simulator.ts";
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Scene,
} from "../vendor/three";
import { RigidBody, World } from "@dimforge/rapier3d-compat";
import { Rapier } from "../rapier";

export interface HandInit {
  innerHeight: number;
  length: number;
  thickness: number;
  grabMargin: number;
  width: number;
}

export class Hand implements ISimulatedObject {
  boxes: Mesh[] = [];
  group: Group = new Group();
  rigidBody?: RigidBody;
  constructor(init: Partial<HandInit>) {
    const { length, innerHeight, thickness, grabMargin, width } = {
      thickness: 0.05,
      innerHeight: 0.1,
      length: 0.3,
      grabMargin: 0.05,
      width: 0.15,
      ...init,
    };

    const top = new BoxGeometry(length, thickness, width).translate(
      -length / 2 + grabMargin,
      innerHeight / 2 + thickness / 2,
      0,
    );
    const bottom = new BoxGeometry(length, thickness, width).translate(
      -length / 2 + grabMargin,
      -innerHeight / 2 - thickness / 2,
      0,
    );
    const back = new BoxGeometry(thickness, innerHeight, width).translate(
      -length + thickness / 2 + grabMargin,
      0,
      0,
    );

    for (const box of [top, bottom, back]) {
      const mesh = new Mesh(box, new MeshStandardMaterial({ color: "blue" }));
      mesh.castShadow = true;
      this.group.add(mesh);
      this.boxes.push(mesh);
    }
  }

  addToScene(scene: Scene): void {
    scene.add(this.group);
  }
  addDebugObjects(): void {}

  addToPhysicsWorld(world: World, rapier: Rapier): void {
    const rigidBodyDesc = rapier.RigidBodyDesc.dynamic();
    this.rigidBody = world.createRigidBody(rigidBodyDesc);
    for (const box of this.boxes) {
      const positions = box.geometry.getAttribute("position");
      const colliderDesc = rapier.ColliderDesc.convexHull(
        new Float32Array(positions.array),
      );
      world.createCollider(colliderDesc!, this.rigidBody);
    }
  }
  updateFromCollider(): void {
    if (this.rigidBody != null) {
      this.group.position.copy(this.rigidBody.translation());
      this.group.quaternion.copy(this.rigidBody.rotation());
    }
  }
}
