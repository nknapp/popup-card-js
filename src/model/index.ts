export type Point2d = [x: number, y: number];
export type Point3d = [x: number, y: number, y: number];

export interface PopupModel {
    shapes: PopupShape<string, string>[]
}

export interface PopupShape<
    PointId extends string,
    FoldId extends string,
> {
    /**
     * A list of point positions in the 2d template of the popup shape
     */
    points2d: Record<PointId, Point2d>;

    /**
     * A list of point position of the 3d unfolded shape
     */
    points3d: Record<PointId, Point3d>;

    boundary: PointId[]

    /**
     * A list of points connected by a fold
     */
    folds: Record<FoldId, [start: PointId, end: PointId]>;
}
