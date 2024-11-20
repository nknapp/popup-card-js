import type { PopupSimulation } from "popup-card-js";
import { createBaseCard } from "./card";
import { createVFold } from "./vfold";

export const simulation: PopupSimulation = {
  commands: [
    { type: "addShape", id: "card", shape: createBaseCard(0.01) },
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
