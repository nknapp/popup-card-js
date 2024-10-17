import {createSimulator, Simulator, SimulatorOptions} from "./simulator/Simulator.ts";
import { FoldedPaper } from "./FoldedPaper/FoldedPaper.ts";
import { FoldedPaperSpec } from "./FoldedPaper/FoldedPaper.types.ts";

export interface FoldedPaperController<
  FoldId extends string,
  MotorId extends FoldId,
> {
    setFoldAngle(motor: MotorId, angle: number): void;
}

export class PopupSimulator {
  private simulator: Simulator;

  static async createPopupSimulator(
    container: HTMLElement, options: Partial<SimulatorOptions> = {}
  ): Promise<PopupSimulator> {
    const simulator = await createSimulator(container, options);
    return new PopupSimulator(simulator);
  }

  private constructor(simulator: Simulator) {
    this.simulator = simulator;
  }

  debug() {
    this.simulator.debug()
  }

  addFoldedPaper<
    PointId extends string,
    FoldId extends string,
    PlaneId extends string,
    MotorId extends FoldId,
  >(
    shape: FoldedPaperSpec<PointId, PlaneId, FoldId, MotorId>,
  ): FoldedPaperController<FoldId, MotorId> {
    const foldedPaper = new FoldedPaper(shape);
    this.simulator.add(foldedPaper);
    return {
      setFoldAngle(motor: MotorId, angle: number) {
        foldedPaper.setFoldAngle(motor, angle);
      },
    };
  }
}
