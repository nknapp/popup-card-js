import type { PopupSimulation } from "dist";
import {createBaseCard} from "./card.ts";
import {createVFold} from "./vfold.ts";

export const simulation: PopupSimulation = {
  commands: [
    { type: "addShape", id: "card", shape: createBaseCard(0.001) },
    { type: "addShape", id: "vfold", shape: createVFold(0.001) },
    {
      type: "glue",
      from: { shape: "card", segment: "b" },
      to: { shape: "vfold", segment: "glueLeft" },
    },
    {
      type: "glue",
      from: { shape: "card", segment: "a" },
      to: { shape: "vfold", segment: "glueRight" },
    },
  ],
};
