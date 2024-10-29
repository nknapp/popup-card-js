import {
  createSimulator,
  Simulator,
  SimulatorOptions,
} from "./simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper/FoldedPaper.ts";
import { FoldedPaperSpec } from "./FoldedPaper/FoldedPaper.types.ts";

export { type FoldedPaperSpec } from "./FoldedPaper/FoldedPaper.types.ts";

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

  debug() {
    this.simulator.debug();
  }

  dispose() {
    this.simulator.dispose();
  }

  addFoldedPaper<
    PointId extends string,
    FoldId extends string,
    PlaneId extends string,
    MotorId extends FoldId,
  >(
    id: string,
    shape: FoldedPaperSpec<PointId, PlaneId, FoldId, MotorId>,
  ): FoldedPaperController<FoldId, MotorId> {
    const foldedPaper = new FoldedPaper(shape);
    this.simulator.add(foldedPaper);
    this.foldedPapers[id] = foldedPaper;
    return {
      setFoldAngle(motor: MotorId, angle: number) {
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
}
