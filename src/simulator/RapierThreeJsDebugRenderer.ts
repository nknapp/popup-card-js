import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Scene,
} from "three";
import type { World } from "@dimforge/rapier3d-compat";

export class RapierThreeJsDebugRenderer {
  mesh: LineSegments;
  world: World;
  enabled: boolean;

  constructor(scene: Scene, world: World, enabled = true) {
    this.world = world;
    this.mesh = new LineSegments(
      new BufferGeometry(),
      new LineBasicMaterial({ color: 0xffffff, vertexColors: true }),
    );
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
    this.enabled = enabled;
  }


  update() {
    if (this.enabled) {
      const { vertices, colors } = this.world.debugRender();
      this.mesh.geometry.setAttribute(
        "position",
        new BufferAttribute(vertices, 3),
      );
      this.mesh.geometry.setAttribute("color", new BufferAttribute(colors, 4));
      this.mesh.visible = true;
    } else {
      this.mesh.visible = false;
    }
  }
}
