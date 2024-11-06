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

export const angles = [0, 90, 180] as const;

export const Showcase: Component<ShowcaseProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  let simulator: PopupSimulator | null = null;

  createEffect(async () => {
    const containerEl = container();
    if (containerEl != null) {
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
    <div class={"border p-2 my-4"}>
      <For each={getMotors(props.simulation)}>
        {(motor) => (
          <div class={"flex items-center gap-2 p-2 mt-2"}>
            <div>
              Fold: {motor.shape} - {motor.motor}
            </div>
            <For each={angles}>
              {(angle) => (
                <button
                  class={"!m-0 hover:bg-accent-400"}
                  onClick={() => {
                    simulator?.fold(
                      motor.shape,
                      motor.motor,
                      (angle / 180) * Math.PI,
                    );
                  }}
                >
                  {angle}
                </button>
              )}
            </For>
          </div>
        )}
      </For>
      <div ref={setContainer} class={"relative w-full h-96 !m-0"}></div>
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
