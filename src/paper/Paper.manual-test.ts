import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "three";
import { Simulator } from "../simulator/Simulator.ts";
import { Paper } from "./Paper.ts";
import { SimulatedObject } from "../simulator/SimulatedObject.ts";

export function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container);

  const ground = new Mesh(
    new BoxGeometry(2, 0.05, 2),
    new MeshStandardMaterial({ color: "#f00", side: DoubleSide }),
  );
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  ground.castShadow = false;
  simulator.add(new SimulatedObject(ground, { fixed: true }));
  simulator.add(
    new Paper({
      points3d: {
        p1: [-0.4, 0.5, -0.3],
        p2: [0.4, 0.5, -0.3],
        p3: [0.4, 0.1, 0.3],
        p4: [-0.4, 0.1, 0.3],
      },
      boundary: ["p1", "p2", "p3", "p4"],
    }),
  );

  return () => {
    simulator.dispose();
  };
}
