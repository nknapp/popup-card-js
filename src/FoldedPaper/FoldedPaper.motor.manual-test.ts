import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial } from "three";
import { Simulator } from "../simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper.ts";
import { SimpleSimulatedObject } from "../simulator/SimpleSimulatedObject.ts";

export function manualTest(container: HTMLDivElement) {
  container.style.position = "relative";
  const simulator = new Simulator(container);
  simulator.debug();
  const ground = new Mesh(
    new BoxGeometry(2, 0.05, 2),
    new MeshStandardMaterial({ color: "#fff", side: DoubleSide }),
  );
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;
  ground.castShadow = false;
  simulator.add(
    new SimpleSimulatedObject(ground, { fixed: true, restitution: 1 }),
  );

  const card = new FoldedPaper({
    points3d: {
      p1: [-0.5, 0.05, 0.5],
      p2: [-0.5, 0.05, 0],
      p3: [-0.5, 0.05, -0.5],
      p4: [0.5, 0.05, -0.5],
      p5: [0.5, 0.05, 0],
      p6: [0.5, 0.05, 0.5],
      p7: [0, 0.05, 0.8],
    },
    segments: {
      a: ["p1", "p2", "p5", "p6"],
      b: ["p2", "p3", "p4", "p5"],
      c: ["p1", "p6", "p7"],
    },
    fixedSegments: ["b"],
    folds: {
      one: ["a", "b"],
      two: ["a", "c"],
    },
    motors: ["one", "two"],
    color: "green",
  });

  const controls = document.createElement("div");
  controls.innerHTML = `
      <label for="foldAngle1">Angle 1</label>
      <input id="foldAngle1" style="border: 1px solid black"
          type="text"
          placeholder="Enter fold angle for card here">
      <label for="foldAngle2">Angle 2</label>
      <input id="foldAngle2" style="border: 1px solid black"
          type="text"
          placeholder="Enter fold angle for card here">
  `;
  controls.style.position = "absolute";
  controls.style.display = "flex";
  controls.style.gap = "1rem";
  controls.style.top = "0";
  controls.style.color = "black";
  controls.style.background = "white";
  controls.style.padding = "0.5rem";
  container.appendChild(controls);

  function updateFoldFromElement(input: HTMLInputElement, fold: "one" | "two") {
    return () => {
      const angle = parseInt(input.value);
      if (isNaN(angle)) return;
      card.setFoldAngle(fold, angle);
    };
  }

  const angle1Input = controls.querySelector<HTMLInputElement>("#foldAngle1")!;
  angle1Input.addEventListener("change", updateFoldFromElement(angle1Input, "one"));
  const angle2Input = controls.querySelector<HTMLInputElement>("#foldAngle2")!;
  angle2Input.addEventListener("change", updateFoldFromElement(angle1Input, "two"));

  simulator.add(card);

  return () => {
    simulator.dispose();
  };
}
