import {
  type Component,
  createEffect,
  createSignal,
  For,
  onCleanup,
} from "solid-js";
import { type PopupSimulation, PopupSimulator } from "popup-card-js";

export interface ShowcaseProps {
  simulation: PopupSimulation;
}

interface Motor {
  shape: string;
  motor: string;
}

export const angles = [-180, -135, -90, -45, 0, 45, 90, 135, 180] as const;

export const Showcase: Component<ShowcaseProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  let simulator: PopupSimulator | null = null

  createEffect(async () => {
    const containerEl = container();
    if (containerEl != null) {
      console.log("creating simulator");
      simulator = PopupSimulator.createPopupSimulator(containerEl, {
        gravity: 0,
      });
      simulator.load(props.simulation);

      onCleanup(() => {
        simulator?.dispose();
      });
    }
  });

  return (
    <div>
      <For each={getMotors(props.simulation)}>
        {(motor) => (
          <div class={""}>
            <div>
              {motor.shape} - {motor.motor}
            </div>
            <div>
            <For each={angles}>
              {(angle) => <button class={"!m-0 border-white border bg-white/10 px-4"} onClick={() => {
                simulator?.fold(motor.shape, motor.motor, angle / 180 * Math.PI )
              }}>{angle}</button>}
            </For>
            </div>
          </div>
        )}
      </For>
      <div ref={setContainer} class={"w-full h-96"}></div>
    </div>
  );
};

function getMotors(simulation: PopupSimulation): Motor[] {
  const motors: Motor[] = [];
  for (const command of simulation.commands) {
    if (command.type !== "addShape" || command.shape.motors == null) {
      continue;
    }
    for (const motor of command.shape.motors) {
      motors.push({ shape: command.id, motor });
    }
  }
  return motors;
}
