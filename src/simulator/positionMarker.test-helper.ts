import { Simulator } from "./Simulator.ts";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
} from "three";
import { Point3d } from "../model";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

interface AddGroundOptions {
  position?: Point3d;
  size?: number;
  label?: string;
}

export function addPositionMarker(
  simulator: Simulator,
  {
    position = [0, 0, 0],
    size = 0.05,
    label = undefined,
  }: AddGroundOptions = {},
) {
  const group = new Group();

  group.add(createLine([0, 0, 0], [size, 0, 0], "red"));
  group.add(createLine([0, 0, 0], [0, size, 0], "green"));
  group.add(createLine([0, 0, 0], [0, 0, size], "blue"));
  group.add(createLabel([size, 0, 0], `x=${position[0]}`, "red"));
  group.add(createLabel([0, size, 0], `y=${position[1]}`, "green"));
  group.add(createLabel([0, 0, size], `z=${position[2]}`, "blue"));
  if (label != null) {
    group.add(createLabel([0, 0, 0], label, "black"));
  }
  group.position.set(...position);
  simulator.scene.add(group);
}

function createLine(from: Point3d, to: Point3d, color: string) {
  return new Line(
    new BufferGeometry().setAttribute(
      "position",
      new Float32BufferAttribute([...from, ...to], 3),
    ),
    new LineBasicMaterial({ color: color }),
  );
}

function createLabel(position: Point3d, text: string, color: string) {
  const div = document.createElement("div");
  div.setAttribute("style", `color: ${color}; font-size: 16px;`);
  div.textContent = text;
  const css2DObject = new CSS2DObject(div);
  css2DObject.center.set(0.5, -0.2);
  css2DObject.position.set(...position);

  return css2DObject;
}
