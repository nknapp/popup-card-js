import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types.ts";
import { parsePaperSize } from "../utils/paperSize.ts";

interface BaseCardOption {
  /**
   * ISO Format
   */
  format: string;

  /**
   * Thickness in millimeters
   */
  thickness: number;
}

export function baseCard({
  format = "A4",
  thickness = 0.2,
}: Partial<BaseCardOption> = {}): FoldedPaperSpec {
  const size = parsePaperSize(format);
  return {
    points3d: {
      left1: [-size.height / 2, -thickness, -size.width / 2],
      left2: [-size.height / 2, -thickness, size.width / 2],
      middle1: [0, -thickness, -size.width / 2],
      middle2: [0, -thickness, size.width / 2],
      right1: [size.height / 2, -thickness, -size.width / 2],
      right2: [size.height / 2, -thickness, size.width / 2],
    },
    segments: {
      left: ["left1", "left2", "middle2", "middle1"],
      right: ["right1", "right2", "middle2", "middle1"],
    },
    fixedSegments: ["left"],
    folds: {
      middle: ["left", "right"],
    },
    motors: ["middle"],
    color: "green",
    thickness,
  } as const;
}
