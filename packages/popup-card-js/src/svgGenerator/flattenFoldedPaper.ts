import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types";
import { traverseSegments } from "./traverseSegments";
import { TypedRecord } from "../utils/TypedRecord";
import { Matrix4, Vector3 } from "../vendor/three";
import { flattenSegment } from "./flattenSegment";
import { Point3d } from "./model";

export type Point2d = Readonly<[x: number, y: number]>;

export function flattenFoldedPaper(
  foldedPaper: FoldedPaperSpec,
): Map<string, Point2d> {
  return new FlattenFoldedPaper(foldedPaper).flatten();
}

class FlattenFoldedPaper {
  private segmentTransforms = new Map<string, Matrix4>();

  constructor(private foldedPaper: FoldedPaperSpec) {}

  flatten(): Map<string, Point2d> {
    const result = new Map<string, Point2d>()
    for (const [segmentId, previous] of traverseSegments({
      segments: TypedRecord.keys(this.foldedPaper.segments),
      folds: TypedRecord.values(this.foldedPaper.folds),
    })) {
      const points = this.#getPointsFromSegment(this.foldedPaper, segmentId);
      const currentMatrix = this.#getFlattenMatrix(previous, points);
      this.segmentTransforms.set(segmentId, currentMatrix);
      for (const pointId of this.foldedPaper.segments[segmentId]) {
        if (!result.has(pointId)) {
          const flatVector = new Vector3(...this.foldedPaper.points3d[pointId]).applyMatrix4(currentMatrix)
          result.set(pointId, [flatVector.x, flatVector.y])
        }
      }
    }
    return result
  }

  #getFlattenMatrix(previous: null | string, points: Readonly<Point3d[]>) {
    const previousMatrix =
      previous != null ? this.segmentTransforms.get(previous) : null;
    return previousMatrix == null
      ? flattenSegment(points)
      : flattenSegment(points, previousMatrix);
  }

  #getPointsFromSegment(
    foldedPaper: FoldedPaperSpec,
    segmentId: string,
  ): Readonly<Point3d[]> {
    return foldedPaper.segments[segmentId].map(
      (pointId) => foldedPaper.points3d[pointId],
    );
  }
}
