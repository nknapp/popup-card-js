import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { Simulator } from "./Simulator.ts";
import { SimulatedObject } from "./SimulatedObject.ts";

export function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container);
  simulator.debug();
  simulator.add(
    new SimulatedObject(
      new Mesh(
        new SphereGeometry(1, 1, 1),
        new MeshBasicMaterial({ color: "white" }),
      ),
    ),
  );

  return () => {
    simulator.dispose();
  };
}
