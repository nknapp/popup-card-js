
import {
  initVisualizer,
  testVisualizer,
} from "../manual-testing/utils/testVisualizer.ts";

import { FoldedPaperSpec } from "../FoldedPaper/FoldedPaper.types.ts";
import { Matrix4, Vector3 } from "../vendor/three.ts";
import {SvgGenerator} from "./index.ts";

const foldedPaper = {
  points3d: {
    B1: [-5, 0, -5],
    B2: [-5, 0, 5],
    B3: [5, 0, 5],
    B4: [5, 0, -5],
    B5: [-5, 0, -5],
    glue1: [-4, 0, -4],
    glue2a: [-4, 0, 4],
    glue2b: [-4, 0, 4],
    glue3: [4, 0, 4],
    T1: [-6, 3, -6],
    T2: [-6, 3, 6],
    T3: [6, 3, 6],
    T4: [6, 3, -6],
    T5: [-6, 3, -6],
  },
  segments: {
    S1: ["B1", "B2", "T2", "T1"],
    glue1: ["B1", "glue1", "glue2a", "B2"],
    S2: ["B2", "B3", "T3", "T2"],
    glue2: ["B2", "glue2b", "glue3", "B3"],
    S3: ["B3", "B4", "T4", "T3"],
    S4: ["B4", "B5", "T5", "T4"],
  },
  folds: {
    F12: ["S1", "S2"],
    F23: ["S2", "S3"],
    F34: ["S3", "S4"],
    glue1: ["S1", "glue1"],
    glue2: ["S2", "glue2"],
  },
  color: "green",
} satisfies FoldedPaperSpec;

export function manualTest(container: HTMLDivElement) {
  container.innerHTML = `
   <div id="threeContainer" class="absolute inset-0"></div>
   <div id="svgContainer" class="absolute w-96 h-96 "></div>
  `
  initVisualizer(container.querySelector("#threeContainer")!, { cameraPosition: [100, 30, 20] });

  show({ ...foldedPaper, color: "green" });

  const svg =  new SvgGenerator(foldedPaper).generate()
  const base64 = encodeURIComponent(btoa(svg))

  container.querySelector("#svgContainer")!.innerHTML = `<img src="data:image/svg+xml;base64,${base64}" alt="svg flattened to 2d" />`

}

function show(foldedPaper: FoldedPaperSpec, transform?: Matrix4) {
  for (const [segment, pointIds] of Object.entries(foldedPaper.segments)) {
    testVisualizer.addShape({
      label: segment,
      points3d: foldedPaper.points3d,
      boundary: pointIds,
      color: foldedPaper.color,
      transform,
    });
  }
  for (const [left, right] of Object.values(foldedPaper.folds)) {
    const pointIds = intersection(
      foldedPaper.segments[left],
      foldedPaper.segments[right],
    );
    const from = new Vector3(...foldedPaper.points3d[pointIds[0]]);
    const to = new Vector3(...foldedPaper.points3d[pointIds[1]]);
    if (transform) {
      from.applyMatrix4(transform);
      to.applyMatrix4(transform);
    }
    testVisualizer.addLine(from, to);
  }
}

function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}
