import {
  type Component,
  createEffect,
  createSignal,
  For,
  onCleanup,
} from "solid-js";
import { PopupSimulator } from "popup-card-js";
import type { FoldedPaperSpec } from "popup-card-js";

export interface ShowcaseProps {
  shapes: Record<string, FoldedPaperSpec<string, string, string, string>>;
  glues: [
    from: { shape: string; segment: string },
    to: { shape: string; segment: string },
  ][];
}

interface Motors {
  label: string;

  setAngle(angle: number): void;
}

export const Showcase: Component<ShowcaseProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const [motors, setMotors] = createSignal<Motors[]>([]);

  createEffect(async () => {
    const containerEl = container();
    if (containerEl != null) {
      console.log("creating simulator");
      const simulator = PopupSimulator.createPopupSimulator(containerEl, {
        gravity: 0,
      });
      for (const [id, shape] of Object.entries(props.shapes)) {
        const handle = simulator.addFoldedPaper(id, shape);
        for (const motorId of shape.motors ?? []) {
          setMotors((motors) => {
            return [
              ...motors,
              {
                label: `${id}-${motorId}`,
                setAngle: (angle) => handle.setFoldAngle(motorId, angle),
              },
            ];
          });
        }
      }
      for (const glue of props.glues) {
        simulator.addGlue(glue[0], glue[1]);
      }

      onCleanup(() => {
        simulator.dispose();
      });
    }
  });

  return (
    <div>
      <For each={motors()}>
        {(motor) => (
          <div class={"flex items-center gap-2"}>
            <label>{motor.label}</label>
            <input
              min="-180"
              max="180"
              value="0"
              type={"range"}
              onInput={(event) =>
                motor.setAngle(
                  (Number(event.currentTarget.value) * Math.PI) / 180,
                )
              }
            />
          </div>
        )}
      </For>
      <div ref={setContainer} class={"w-full h-96"}></div>
    </div>
  );
};
