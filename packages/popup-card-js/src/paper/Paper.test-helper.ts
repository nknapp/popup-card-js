import { Paper, PaperInit, Point3d } from "./Paper.ts";

export function createPaper<T extends string>(
  init: Partial<PaperInit<T>>,
): Paper<T> {
  return new Paper({
    // TODO better typings here
    points3d: {} as Record<T, Point3d>,
    boundary: [],
    color: "green",
    ...init,
  });
}
