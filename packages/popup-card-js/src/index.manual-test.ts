import { PopupSimulation, PopupSimulator } from "./index.ts";

const thickness = 0.01;
const model: PopupSimulation = {
  commands: [
    {
      type: "addShape",
      id: "card",
      shape: {
        points3d: {
          p1: [-0.5, 0, 0.5],
          p2: [-0.5, 0, 0],
          p3: [-0.5, 0, -0.5],
          p4: [0.5, 0, -0.5],
          p5: [0.5, 0, 0],
          p6: [0.5, 0, 0.5],
        },
        segments: {
          a: ["p1", "p2", "p5", "p6"],
          b: ["p2", "p3", "p4", "p5"],
        },
        fixedSegments: ["b"],
        folds: {
          one: ["a", "b"],
        },
        motors: ["one", "two"],
        color: "green",
        thickness: thickness,
      },
    },
    {
      type: "addShape",
      id: "parallelFold",
      shape: {
        thickness: thickness,
        points3d: {
          f1a: [-0.1, thickness, 0.05],
          f2a: [0.1, thickness, 0.05],
          f1: [-0.1, thickness, 0.1],
          f2: [0.1, thickness, 0.1],
          f3: [-0.1, 0.1, 0.0],
          f4: [0.1, 0.1, 0.0],
          f5: [-0.1, thickness, -0.1],
          f6: [0.1, thickness, -0.1],
          f5a: [-0.1, thickness, -0.05],
          f6a: [0.1, thickness, -0.05],
        },
        segments: {
          glueA: ["f1", "f2", "f2a", "f1a"],
          glueB: ["f5", "f6", "f6a", "f5a"],
          a: ["f1", "f2", "f3", "f4"],
          b: ["f5", "f6", "f3", "f4"],
        },
        folds: {
          glueA: ["glueA", "a"],
          ab: ["a", "b"],
          glueB: ["b", "glueB"],
        },
        motors: [],
        color: "red",
      },
    },
    {
      type: "glue",
      from: {
        shape: "card",
        segment: "a",
      },
      to: {
        shape: "parallelFold",
        segment: "glueA",
      },
    },
    {
      type: "glue",
      from: {
        shape: "card",
        segment: "b",
      },
      to: {
        shape: "parallelFold",
        segment: "glueB",
      },
    },
  ],
};

export async function manualTest(container: HTMLDivElement) {
  const simulator = PopupSimulator.createPopupSimulator(container, {
    gravity: 0,
  });
  simulator.load(model);

  const controls = document.createElement("div");
  controls.innerHTML = `
        <button class="border border-black p-1 rounded hover:bg-gray-400">0</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">-60</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">-90</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">-160</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">-180</button>
  `;

  controls.style.position = "absolute";
  controls.style.display = "flex";
  controls.style.gap = "1rem";
  controls.style.top = "0";
  controls.style.color = "black";
  controls.style.background = "white";
  controls.style.padding = "0.5rem";
  container.appendChild(controls);
  for (const button of controls.querySelectorAll("button")) {
    button.addEventListener("click", () => {
      const angle = Number(button.textContent);
      simulator.fold("card", "one", (angle * Math.PI) / 180);
    });
  }

  return () => {
    console.log("cleanup");
  };
}
