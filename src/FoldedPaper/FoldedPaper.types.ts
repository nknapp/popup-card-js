export type Point3d = [x: number, y: number, y: number];


export interface FoldedPaperSpec<
    PointId extends string,
    PlaneId extends string,
    FoldId extends string,
    Motors extends FoldId
> {
    /**
     * A list of point position of the 3d unfolded shape
     */
    points3d: Record<PointId, Point3d>;

    /**
     * List of points that form the boundary of the paper
     */
    segments: Record<PlaneId, PointId[]>

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
    color: string

    /**
     * A list of folds that can be manually folded
     */
    motors?: Motors[]
}