import { PerspectiveCamera } from "three";
import { Point3d } from "../model";

export function createCamera(aspect: number, position: Point3d) {
  const camera = new PerspectiveCamera(30, aspect, 0.1, 10000);
  camera.position.set(...position);

  return camera;
}
