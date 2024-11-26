import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types.ts";
import { flattenFoldedPaper, Point2d } from "./flattenFoldedPaper.ts";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SvgGenerator {
  private points2d: Map<string, Point2d>;
  private bounds: Readonly<Bounds>;

  constructor(private foldedPaper: FoldedPaperSpec) {
    this.points2d = flattenFoldedPaper(this.foldedPaper);
    this.bounds = getBounds(this.points2d.values());
    console.log(this.points2d)
    console.log(this.bounds)
  }

  generate(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1" baseProfile="full"
        width="${this.bounds.width}cm"
        height="${this.bounds.height}cm"
        viewBox="${this.bounds.x} ${this.bounds.y} ${this.bounds.width} ${this.bounds.height}">
            <path d="${this.getBoundaries()}" fill="${this.foldedPaper.color}" />                              
            <path d="${this.getFolds()}" stroke="white" stroke-width="0.01" stroke-dashoffset="0" stroke-dasharray="0.05 0.1"/>                              
      </svg>
    `;
  }

  private getBoundaries(): string {
    const segmentPaths = Object.values(this.foldedPaper.segments).map(
      (segment) => {
        const points = segment.map((pointId) => this.points2d.get(pointId));
        return (
          "M " + points.map((point) => `${point![0]} ${point![1]}`).join(" L ")
        );
      },
    );
    return segmentPaths.join(" ");
  }

  private getFolds(): string {
    const folds = Object.values(this.foldedPaper.folds).map((fold) => {
      const pointIds = intersection(
        this.foldedPaper.segments[fold[0]],
        this.foldedPaper.segments[fold[1]],
      );
      const points = pointIds.map((pointId) => this.points2d.get(pointId));
      return (
        "M " + points.map((point) => `${point![0]} ${point![1]}`).join(" L ")
      );
    });
    return folds.join(" ");
  }
}

function getBounds(points: Iterable<Point2d>): Readonly<Bounds> {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point[0]);
    minY = Math.min(minY, point[1]);
    maxX = Math.max(maxX, point[0]);
    maxY = Math.max(maxY, point[1]);
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}
