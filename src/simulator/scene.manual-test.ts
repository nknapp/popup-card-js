import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "three";
import { Simulator } from "./Simulator.ts";
import { SimulatedObject } from "./SimulatedObject.ts";

function createFallingCube(height: number) {
  const fallingCube = new BoxGeometry(1, 1, 1);
  fallingCube.rotateZ(0);
  fallingCube.rotateX(0.2);
  fallingCube.translate(0, height, 0);
  const cube = new Mesh(
    fallingCube,
    new MeshStandardMaterial({ color: "white" }),
  );
  cube.receiveShadow = true;
  cube.castShadow = true;

  return new SimulatedObject(cube);
}

export function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container);
  simulator.debug();
  const bumper = new Mesh(
    new BoxGeometry(2, 1, 3),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  bumper.position.set(0.3, 2, 0);
  bumper.rotation.set(Math.PI / 6, Math.PI / 6, Math.PI / 10);
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  simulator.add(new SimulatedObject(bumper, { fixed: true, friction: 0 }));

  const ground2 = new Mesh(
    new BoxGeometry(20, 0.5, 20),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  ground2.position.set(0, 0, 0);
  ground2.receiveShadow = true;
  ground2.castShadow = false;

  simulator.add(new SimulatedObject(ground2, { fixed: true }));

  const interval = setInterval(() => {
    const simulatedObject = createFallingCube(10);
    simulator.add(simulatedObject);
  }, 2000);

  return () => {
    clearInterval(interval);
    simulator.dispose();
  };
}
