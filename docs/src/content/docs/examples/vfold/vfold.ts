import type { FoldedPaperSpec } from "popup-card-js";

export function createVFold(cardThickness = 0.01): FoldedPaperSpec {
  const height = 0.75;
  return {
    points3d: {
      bottomCenter: [-0.1, 0, 0],
      topCenter: [-0.1, height, 0],
      bottomLeft: [0.0, 0, -0.3],
      topLeft: [0.0, height, -0.3],
      bottomRight: [0.0, 0, 0.3],
      topRight: [0.0, height, 0.3],
      glueBottomLeft1: [0.03, 0, -0.1],
      glueBottomLeft2: [0.05, 0, -0.2],
      glueBottomRight1: [0.03, 0, 0.1],
      glueBottomRight2: [0.05, 0, 0.2],
    },
    segments: {
      left: ["topCenter", "bottomCenter", "bottomLeft", "topLeft"],
      glueLeft: [
        "bottomLeft",
        "glueBottomLeft1",
        "glueBottomLeft2",
        "bottomCenter",
      ],
      right: ["topCenter", "bottomCenter", "bottomRight", "topRight"],
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
  };
}
