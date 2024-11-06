import {
  createSimulator,
  Simulator,
  SimulatorOptions,
} from "./simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper/FoldedPaper.ts";
import { FoldedPaperSpec } from "./FoldedPaper/FoldedPaper.types.ts";

export { type FoldedPaperSpec } from "./FoldedPaper/FoldedPaper.types.ts";

export interface Command {
  type: string;
}

export interface AddShape extends Command {
  type: "addShape";
  id: string
  shape: FoldedPaperSpec;
}

export interface Glue extends Command {
  type: "glue";
  from: { shape: string; segment: string };
  to: { shape: string; segment: string };
}

export type AnyCommand = AddShape | Glue;

export interface PopupSimulation {
  commands: AnyCommand[];
}

export interface FoldedPaperController<
  FoldId extends string,
  MotorId extends FoldId,
> {
  setFoldAngle(motor: MotorId, angle: number): void;
}

export class PopupSimulator {
  private simulator: Simulator;
  private foldedPapers: Record<
    string,
    FoldedPaper<string, string, string, string>
  > = {};

  static createPopupSimulator(
    container: HTMLElement,
    options: Partial<SimulatorOptions> = {},
  ): PopupSimulator {
    const simulator = createSimulator(container, options);
    return new PopupSimulator(simulator);
  }

  private constructor(simulator: Simulator) {
    this.simulator = simulator;
  }

  load(model: PopupSimulation) {
    for (const command of model.commands) {
      switch (command.type) {
        case "addShape":
          this.addShape(command.id, command.shape)
              break;
        case "glue": {
          this.addGlue(command.from, command.to)
        }
      }
    }
  }

  debug() {
    this.simulator.debug();
  }

  dispose() {
    this.simulator.dispose();
  }

  addShape(
    id: string,
    shape: FoldedPaperSpec,
  ): FoldedPaperController<string, string> {
    const foldedPaper = new FoldedPaper(shape);
    this.simulator.add(foldedPaper);
    this.foldedPapers[id] = foldedPaper;
    return {
      setFoldAngle(motor: string, angle: number) {
        foldedPaper.setFoldAngle(motor, angle);
      },
    };
  }

  addGlue(
    from: { shape: string; segment: string },
    to: { shape: string; segment: string },
  ) {
    this.simulator.glue(
      this.foldedPapers[from.shape].segments[from.segment],
      this.foldedPapers[to.shape].segments[to.segment],
    );
  }

  fold(shapeId: string, motorId: string, angle: number) {
    this.foldedPapers[shapeId].setFoldAngle(motorId, angle)
  }
}
