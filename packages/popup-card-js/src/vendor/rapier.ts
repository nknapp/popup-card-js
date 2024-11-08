/* eslint-disable no-restricted-imports */
export type Rapier = (typeof import("@dimforge/rapier3d-compat"))["default"];

export * from "@dimforge/rapier3d-compat";
export { default as RAPIER } from "@dimforge/rapier3d-compat";
import RAPIER from "@dimforge/rapier3d-compat";

export const rapierInitialized = RAPIER.init();
