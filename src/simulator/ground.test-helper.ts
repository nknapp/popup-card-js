import { Simulator } from "./Simulator.ts";
import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "../vendor/three";
import { SimpleSimulatedObject } from "./SimpleSimulatedObject.ts";
import { Point3d } from "../FoldedPaper/FoldedPaper.types.ts";

interface AddGroundOptions {
  position?: Point3d;
}

export function addGround(
  simulator: Simulator,
  { position = [0, 0, 0] }: AddGroundOptions = {},
) {
  const ground = new Mesh(
    new BoxGeometry(2, 0.05, 2).translate(...position),
    new MeshStandardMaterial({ color: "#fff", side: DoubleSide }),
  );
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  ground.castShadow = false;
  simulator.add(new SimpleSimulatedObject(ground, { fixed: true }));
}
