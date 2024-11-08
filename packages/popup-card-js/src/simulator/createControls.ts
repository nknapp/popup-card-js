import { Camera, type Renderer } from "../vendor/three";
import { OrbitControls } from "../vendor/three";

export interface CreateControlsReturn {
  update(clockDelta: number): void;
}

export function createControls(
  camera: Camera,
  renderer: Renderer,
): CreateControlsReturn {
  return new OrbitControls(camera, renderer.domElement);
}
