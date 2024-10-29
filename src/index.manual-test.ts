import { PopupSimulator } from "./index.ts";

export async function manualTest(container: HTMLDivElement) {
  const simulator = PopupSimulator.createPopupSimulator(container, {
    gravity: 0,
  });
  const cardController = simulator.addFoldedPaper("card", {
    points3d: {
      p1: [-0.5, 0, 0.5],
      p2: [-0.5, 0, 0],
      p3: [-0.5, 0, -0.5],
      p4: [0.5, 0, -0.5],
      p5: [0.5, 0, 0],
      p6: [0.5, 0, 0.5],
      p7: [0, 0, 0.8],
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
    thickness: 0.001,
  });

  simulator.addFoldedPaper("parallelFold", {
    points3d: {
      f1a: [-0.1, 0.001, 0.05],
      f2a: [0.1, 0.001, 0.05],
      f1: [-0.1, 0.001, 0.1],
      f2: [0.1, 0.001, 0.1],
      f3: [-0.1, 0.1, 0.0],
      f4: [0.1, 0.1, 0.0],
      f5: [-0.1, 0.001, -0.1],
      f6: [0.1, 0.001, -0.1],
      f5a: [-0.1, 0.001, -0.05],
      f6a: [0.1, 0.001, -0.05],
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
  });
  simulator.addGlue(
    {
      shape: "card",
      segment: "a",
    },
    {
      shape: "parallelFold",
      segment: "glueA",
    },
  );
  simulator.addGlue(
    {
      shape: "card",
      segment: "b",
    },
    {
      shape: "parallelFold",
      segment: "glueB",
    },
  );

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
        cardController.setFoldAngle("one", (Number(one) * Math.PI) / 180);
      }
      const two = getNumberMatch(button, /two=([-\d]+)/);
      if (two != null) {
        cardController.setFoldAngle("two", (Number(two) * Math.PI) / 180);
      }
    });
  }

  return () => {
    console.log("cleanup");
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
