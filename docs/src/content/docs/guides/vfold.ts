import type { FoldedPaperSpec } from "popup-card-js";

export function createVFold(cardThickness = 0.1): FoldedPaperSpec<string, string, string, string> {
  return {
    points3d: {
      bottomCenter: [-0.2, 0.05 + cardThickness, 0],
      glueBottomLeft1: [-0.1, 0.05 + cardThickness, -0.01],
      glueBottomLeft2: [0.3, 0.05 + cardThickness, -0.2],
      topCenter: [-0.2, 0.3, 0],
      bottomLeft: [0.3, 0.05 + cardThickness, -0.3],
      bottomRight: [0.3, 0.05 + cardThickness, 0.3],
      glueBottomRight1: [-0.1, 0.05 + cardThickness, 0.01],
      glueBottomRight2: [0.3, 0.05 + cardThickness, 0.2],
    },
    segments: {
      left: ["topCenter", "bottomCenter", "bottomLeft"],
      glueLeft: [
        "bottomLeft",
        "glueBottomLeft1",
        "glueBottomLeft2",
        "bottomCenter",
      ],
      right: ["topCenter", "bottomCenter", "bottomRight"],
      glueRight: [
        "bottomRight",
        "glueBottomRight1",
        "glueBottomRight2",
        "bottomCenter",
      ],
    },
    folds: {
      center: ["left", "right"],
      glueLeft: ["glueLeft", "left"],
      glueRight: ["glueRight", "right"],
    },
    color: "red",
    thickness: cardThickness,
  }

}
