import { PopupSimulation, PopupSimulator } from "../index.ts";
import { baseCard } from "./baseCard.ts";
import { createMotorControls } from "../manual-testing/createMotorControls.ts";

export function manualTest(container: HTMLElement) {
  const popupSimulator = PopupSimulator.createPopupSimulator(container, {
    gravity: 0,
    cameraPosition: [30, 200, -600],
    lightScale: 50,
  });
  const simulation: PopupSimulation = {
    commands: [{ type: "addShape", id: "base", shape: baseCard() }],
  };
  popupSimulator.load(simulation);
  container.appendChild(createMotorControls(popupSimulator));
}
