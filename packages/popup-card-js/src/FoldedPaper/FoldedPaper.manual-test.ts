import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
} from "../vendor/three";
import { createSimulator } from "../simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper.ts";
import { SimpleSimulatedObject } from "../simulatedObjects/SimpleSimulatedObject/SimpleSimulatedObject.ts";

export async function manualTest(container: HTMLDivElement) {
  const simulator = await createSimulator(container, { gravity: 9.81 });

  const ground = new Mesh(
    new BoxGeometry(2, 0.05, 2),
    new MeshStandardMaterial({ color: "#fff", side: DoubleSide }),
  );
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  ground.castShadow = false;
  simulator.add(new SimpleSimulatedObject(ground, { fixed: true }));
  simulator.add(
    new FoldedPaper({
      points3d: {
        p1: [0.3, 0, 0.5],
        p2: [0.3, 0, -0.5],
        p3: [0, 0, 0],
        p4: [-0.2, 0.5, 0],
      },

      segments: {
        a: ["p1", "p3", "p4"],
        b: ["p2", "p3", "p4"],
      },
      folds: {
        fold: ["a", "b"],
      },
      color: "green",
    }),
  );

  return () => {
    simulator.dispose();
  };
}
