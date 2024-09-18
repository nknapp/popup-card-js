

import RAPIER from "@dimforge/rapier3d-compat"

export type Rapier = (typeof import("@dimforge/rapier3d-compat"))["default"];

export type * from "@dimforge/rapier3d-compat"

async function getRapier(): Promise<Rapier> {
    if (typeof window !== "undefined") {
        await RAPIER.init();
        return RAPIER;
    }
    return null!;
}

export const rapier = await getRapier()