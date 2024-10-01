import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "three";
import { Simulator } from "../simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper.ts";
import { SimpleSimulatedObject } from "../simulator/SimpleSimulatedObject.ts";

export function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container);
simulator.debug()
  const ground = new Mesh(
    new BoxGeometry(2, 0.05, 2),
    new MeshStandardMaterial({ color: "#fff", side: DoubleSide }),
  );
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  ground.castShadow = false;
  simulator.add(new SimpleSimulatedObject(ground, { fixed: true }));
  const vfold = new FoldedPaper({
    points3d: {
      p1: [0.3, 0.05, 0.5],
      p2: [0.3, 0.05, -0.5],
      p3: [0, 0.05, 0],
      p4: [-0.2, 0.5, 0],
    },
    segments: {
      a: ["p1", "p3", "p4"],
      b: ["p2", "p3", "p4"],
    },
    folds: {
      fold: ["a", "b"],
    },
    color: "red"
  });

  simulator.add(vfold);

  const card = new FoldedPaper({
    points3d: {
      p1: [-0.5, 0.05, 0.5],
      p2: [-0.5, 0.05, 0],
      p3: [-0.5, 0.05, -0.5],
      p4: [0.5, 0.05, -0.5],
      p5: [0.5, 0.05, 0],
      p6: [0.5, 0.05, 0.5],
    },
    segments: {
      a: ["p1", "p2", "p5", "p6"],
      b: ["p2", "p3", "p4", "p5"],
    },
    folds: {
      "center": ["a","b"]
    },
    color: "green"
  });
  simulator.add(card);
  return () => {
    simulator.dispose();
  };
}
