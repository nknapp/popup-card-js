import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { Simulator } from "./Simulator.ts";
import { SimulatedObject } from "./SimulatedObject.ts";

export function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container);
  simulator.debug();
  const bumper = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  bumper.position.set(0.3, -4, 0);
  bumper.rotation.set(Math.PI / 4, Math.PI /4, 0);
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  simulator.add(new SimulatedObject(bumper, { fixed: true }));

  const ground2 = new Mesh(
    new BoxGeometry(20, 0.5, 20),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  ground2.position.set(0, -6, 0);
  ground2.receiveShadow = true;
  ground2.castShadow = false;

  simulator.add(new SimulatedObject(ground2, { fixed: true }));

  const cubeGeometry = new BoxGeometry(1, 1, 1);
  cubeGeometry.rotateZ(0);
  cubeGeometry.rotateX(0.2);
  const cube = new Mesh(
    cubeGeometry,
    new MeshStandardMaterial({ color: "white" }),
  );
  cube.receiveShadow = true;
  cube.castShadow = true;

  simulator.add(new SimulatedObject(cube));

  return () => {
    simulator.dispose();
  };
}
