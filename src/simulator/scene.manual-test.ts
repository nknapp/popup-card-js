import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "../vendor/three";
import {createSimulator} from "./Simulator.ts";
import { SimpleSimulatedObject } from "../simulatedObjects/SimpleSimulatedObject/SimpleSimulatedObject.ts";

function createFallingCube(height: number) {
  const fallingCube = new BoxGeometry(0.1, 0.1, 0.1);
  fallingCube.rotateZ(0);
  fallingCube.rotateX(0.2);
  fallingCube.translate(0.1, height, 0.1);
  const cube = new Mesh(
    fallingCube,
    new MeshStandardMaterial({ color: "white" }),
  );
  cube.receiveShadow = true;
  cube.castShadow = true;

  return new SimpleSimulatedObject(cube);
}

export async function manualTest(container: HTMLDivElement) {
  const simulator = await createSimulator(container);
  simulator.debug();
  const bumper = new Mesh(
    new BoxGeometry(0.2, 0.1, 0.3),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  bumper.position.set(0.03, 0.2, 0);
  bumper.rotation.set(Math.PI / 6, Math.PI / 6, Math.PI / 10);
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  simulator.add(
    new SimpleSimulatedObject(bumper, { fixed: true, friction: 0 }),
  );

  const ground2 = new Mesh(
    new BoxGeometry(2, 0.05, 2),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  ground2.position.set(0, 0, 0);
  ground2.receiveShadow = true;
  ground2.castShadow = false;

  simulator.add(new SimpleSimulatedObject(ground2, { fixed: true }));

  function addNewCube() {
    const simulatedObject = createFallingCube(1);
    simulator.add(simulatedObject);
  }

  addNewCube();

  return () => {
    simulator.dispose();
  };
}
