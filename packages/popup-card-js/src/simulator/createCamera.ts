import { PerspectiveCamera } from "../vendor/three";
import { Point3d } from "../FoldedPaper/FoldedPaper.types.ts";

export function createCamera(aspect: number, position: Point3d) {
  const camera = new PerspectiveCamera(30, aspect, 0.1, 10000);
  camera.position.set(...position);

  return camera;
}
