import { Camera, type Renderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface CreateControlsReturn {
  update(clockDelta: number): void;
}

export function createControls(
  camera: Camera,
  renderer: Renderer,
): CreateControlsReturn {
  return new OrbitControls(camera, renderer.domElement);
}
