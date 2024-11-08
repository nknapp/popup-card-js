import { PopupSimulator } from "../index.ts";

export function createMotorControls(simulator: PopupSimulator): HTMLDivElement {
  const controls = document.createElement("div");
  for (const motor of simulator.getAllMotors()) {
    const motorControl = createToggleButton(
      `Fold/Unfold ${motor.shapeId} - ${motor.motorId}`,
      (folded) =>
        simulator.fold(
          motor.shapeId,
          motor.motorId,
          folded ? (Math.PI / 180) * 179 : 0,
        ),
    );
    controls.appendChild(motorControl);
  }
  controls.className = "absolute left-0 top-0 flex gap-2 flex-wrap p-2";
  return controls;
}

function createToggleButton(
  label: string,
  callback: (fold: boolean) => void,
): HTMLButtonElement {
  let folded = false;
  const motorFoldButton = document.createElement("button");
  motorFoldButton.textContent = label;
  motorFoldButton.className =
    "p-1 border border-white bg-gray-900 hover:bg-gray-700 duration-100";
  motorFoldButton.addEventListener("click", () => {
    folded = !folded;
    callback(folded);
  });
  return motorFoldButton;
}
