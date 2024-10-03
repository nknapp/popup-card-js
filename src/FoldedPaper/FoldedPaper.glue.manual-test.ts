import { Simulator } from "../simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper.ts";
import { SimpleSimulatedObject } from "../simulator/SimpleSimulatedObject.ts";
import { rapier } from "../rapier";

export function manualTest(container: HTMLDivElement) {
  container.style.position = "relative";
  const simulator = new Simulator(container, { gravity: 0, cameraPosition: [3,0.5,-1] });
  const cardThickness = 0.001;
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
    // dominance: {
    //   // b: 120,
    //   // a: 119,
    // },
    fixedSegments: ["b"],
    folds: {
      one: ["a", "b"],
    },
    motors: ["one"],
    color: "green",
    thickness: cardThickness,
  });
  simulator.add(card);

  const vfold = new FoldedPaper({
    points3d: {
      bottomCenter: [-0.2, 0.05 + cardThickness, 0],
      glueBottomLeft1: [-0.1, 0.05 + cardThickness, -0.01],
      glueBottomLeft2: [0.3, 0.05 + cardThickness, -0.2],
      topCenter: [-0.2, 0.3, 0],
      bottomLeft: [0.3, 0.05 + cardThickness, -0.3],
      bottomRight: [0.3, 0.05 + cardThickness, 0.3],
      glueBottomRight1: [-0.1, 0.05 + cardThickness, 0.01],
      glueBottomRight2: [0.3, 0.05 + cardThickness, 0.2],
    },
    segments: {
      left: ["topCenter", "bottomCenter", "bottomLeft"],
      glueLeft: [
        "bottomLeft",
        "glueBottomLeft1",
        "glueBottomLeft2",
        "bottomCenter",
      ],
      right: ["topCenter", "bottomCenter", "bottomRight"],
      glueRight: [
        "bottomRight",
        "glueBottomRight1",
        "glueBottomRight2",
        "bottomCenter",
      ],
    },
    folds: {
      center: ["left", "right"],
      glueLeft: ["glueLeft", "left"],
      glueRight: ["glueRight", "right"],
    },
    color: "red",
    thickness: cardThickness,
  });
  simulator.add(vfold);

  const controls = document.createElement("div");
  controls.innerHTML = `
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=0</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-90</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-160</button>
        <button class="border border-black p-1 rounded hover:bg-gray-400">one=-180</button>
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
    });
  }

  setTimeout(() => {
    card.setFoldAngle("one", 0);
  });

  function glue(obj1: SimpleSimulatedObject, obj2: SimpleSimulatedObject) {
    const jointData = rapier.JointData.fixed(
      { x: 0.0, y: 0.0, z: 0.0 },
      { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
      { x: 0.0, y: 0.0, z: 0.0 },
      { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
    );
    const glueJoint = simulator.world.createImpulseJoint(
      jointData,
      obj1.rigidBody!,
      obj2.rigidBody!,
      true,
    );
    glueJoint.setContactsEnabled(true);
  }

  glue(card.segments["b"], vfold.segments["glueLeft"]);
  glue(card.segments["a"], vfold.segments["glueRight"]);

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
