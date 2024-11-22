import { Point3d } from "../../FoldedPaper/FoldedPaper.types.ts";
import {
  Clock,
  CSS2DObject,
  CSS2DRenderer,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
} from "../../vendor/three.ts";
import { createCamera } from "../../simulator/createCamera.ts";
import { createLights } from "../../simulator/createLights.ts";
import {
  createControls,
  CreateControlsReturn,
} from "../../simulator/createControls.ts";
import {
  AxesHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Vector3,
  BufferGeometry,
  ConeGeometry,
  Line,
  LineBasicMaterial,
} from "../../vendor/three";
import { PaperShapeGeometry } from "../../paper/PaperShapeGeometry.ts";

interface Shape {
  points3d: Readonly<Record<string, Point3d>>;
  boundary: string[];
  color: string;
}

interface Visualizer {
  addShape(shape: Shape): void;
  addArrow(
    vector: Vector3,
    options?: {
      color?: string;
      startPos?: Vector3;
      label: string | null;
    },
  ): void;
}

class VisualizerImpl implements Visualizer {
  private scene: Scene;
  renderer: WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  camera: PerspectiveCamera;
  private controls: CreateControlsReturn;

  constructor(container: HTMLElement) {
    const cameraPosition: Point3d = [1, 1, 10];
    const { width, height } = container.getBoundingClientRect();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(this.labelRenderer.domElement);

    this.camera = createCamera(width / height, cameraPosition);
    this.scene.add(createLights(1));
    this.controls = createControls(this.camera, this.renderer);

    this.scene.add(new AxesHelper(5));

    const clock = new Clock();
    this.renderer.setAnimationLoop(() => {
      this.controls.update(clock.getDelta());
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    });
  }

  addShape(shape: Shape) {
    const mesh = new Mesh(
      new PaperShapeGeometry(shape),
      new MeshStandardMaterial({
        color: shape.color,
        opacity: 0.8,
        transparent: true,
      }),
    );
    for (const point of shape.boundary) {
      const pointLabel = createLabelDiv(point, shape.color);
      pointLabel.position.set(...shape.points3d[point]);
      mesh.add(pointLabel);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  addArrow(
    vector: Vector3,
    {
      color = "white",
      startPos = new Vector3(),
      label = null as string | null,
    } = {},
  ) {
    const line = new Line(
      new BufferGeometry().setFromPoints([new Vector3(), vector]),
      new LineBasicMaterial({ color }),
    );
    line.position.copy(startPos);
    if (label != null) {
      const center = vector.clone().multiplyScalar(0.5);
      const pointLabel = createLabelDiv(label, color);
      pointLabel.position.copy(center);
      line.add(pointLabel);
      line.add(this.arrowHead(vector, color));
    }
    this.scene.add(line);
  }

  private arrowHead(vector: Vector3, color: string) {
    const radius = vector.length() / 40;
    const height = vector.length() / 10;
    const end = new Mesh(
      new ConeGeometry(radius, height),
      new MeshStandardMaterial({ color, opacity: 0.8, transparent: true }),
    );
    const shift = vector
      .clone()
      .normalize()
      .multiplyScalar(height / 2);
    end.position.copy(vector).sub(shift);

    end.quaternion.setFromUnitVectors(
      new Vector3(0, 1, 0),
      vector.clone().normalize(),
    );
    return end;
  }
}

export let testVisualizer: Visualizer = {
  addShape() {},
  addArrow() {},
};

export function initVisualizer(container: HTMLElement) {
  testVisualizer = new VisualizerImpl(container);
}

function createLabelDiv(text: string, color = "black") {
  const labelDiv = document.createElement("div");
  labelDiv.style.margin = "0";
  labelDiv.style.color = color;
  labelDiv.style.padding = "5px";
  labelDiv.style.borderRadius = "5px";
  labelDiv.style.background = color === "white" ? "transparent" : "white";
  labelDiv.style.opacity = "0.5";
  labelDiv.innerHTML = text;
  const pointLabel = new CSS2DObject(labelDiv);
  pointLabel.center.set(0, 0);
  pointLabel.layers.set(0);
  return pointLabel;
}
