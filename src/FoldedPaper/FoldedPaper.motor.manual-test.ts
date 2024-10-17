import { createSimulator } from "../simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper.ts";

export async function manualTest(container: HTMLDivElement) {
  container.style.position = "relative";
  const simulator = await createSimulator(container, {
    gravity: 0,
    cameraPosition: [5, 1, -1],
  });
  simulator.debug();

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
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=0 two=0</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-90 two=90</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-60 two=60</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-60</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-160</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">two=90</button>
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
      const one = getNumberMatch(button, /one=([-\d]+)/);
      if (one != null) {
        card.setFoldAngle("one", (Number(one) * Math.PI) / 180);
      }
      const two = getNumberMatch(button, /two=([-\d]+)/);
      if (two != null) {
        card.setFoldAngle("two", (Number(two) * Math.PI) / 180);
      }
    });
  }

  simulator.add(card);

  return () => {
    simulator.dispose();
  };
}

function getNumberMatch(
  button: HTMLButtonElement,
  regex: RegExp,
): number | null {
  const match = button.textContent?.match(regex);
  if (match == null) {
    console.log(`No match:`, button.textContent, regex);
    return null;
  }
  const number = Number(match[1]);
  if (isNaN(number)) {
    console.log(`Not a number`, button.textContent, regex, match[1]);
    return null;
  }
  return number;
}
