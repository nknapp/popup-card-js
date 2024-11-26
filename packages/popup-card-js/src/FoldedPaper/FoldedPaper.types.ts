export type Point3d = Readonly<[x: number, y: number, y: number]>;

export interface FoldedPaperSpec<
  PointId extends string = string,
  PlaneId extends string = string,
  FoldId extends string = string,
  MotorId extends FoldId = FoldId,
> {
  /**
   * A list of point position of the 3d unfolded shape
   */
  points3d: Readonly<Record<PointId, Point3d>>

  /**
   * List of points that form the boundary of the paper.
   * Note that the order of points must always be clockwise-turning around the filled area.
   */
  segments: Readonly<Record<PlaneId, PointId[]>>

  dominance?: Record<PlaneId, number>;
  /**
   * Segments of the paper that are physically fixed in one location.
   * This is mostly used for one side of the base card
   */
  fixedSegments?: PlaneId[];

  /**
   * A list of points connected by a fold
   */
  folds: Record<FoldId, [left: PlaneId, right: PlaneId]>;

  /**
   * A string representing the color. CSS values are permitted here.
   */
  color: string;

  /**
   * A list of folds that can be manually folded
   */
  motors?: MotorId[];

  thickness?: number;
}
