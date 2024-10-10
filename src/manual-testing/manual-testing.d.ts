import { Simulator } from "../simulator/Simulator.ts";

declare global {
  interface Window {
    __simulator__: Simulator;
  }
}
