import {
  AxesHelper,
  Clock,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
} from "three";
import { createCamera } from "./createCamera.ts";
import { createLights } from "./createLights.ts";
import { createControls } from "./createControls.ts";
import { rapier, World } from "../rapier";
import { RapierThreeJsDebugRenderer } from "./RapierThreeJsDebugRenderer.ts";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { Point3d } from "../model";

export interface ISimulatedObject {
  addToScene(scene: Scene): void;
  addDebugObjects(scene: Scene): void;
  addToPhysicsWorld(world: World): void;
  updateFromCollider(): void;
}

interface SimulatorOptions {
  /**
   * The downwards gravity of the simulator.
   * Default: 9.81
   */
  gravity: number;

  cameraPosition: Point3d;
}

export class Simulator {
  scene: Scene;
  renderer: WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  world: World;
  objects: ISimulatedObject[] = [];
  private rapierDebugRenderer?: RapierThreeJsDebugRenderer;
  debugEnabled = false;
  manualTimeEnabled = false;

  constructor(
    container: HTMLDivElement,
    options: Partial<SimulatorOptions> = {},
  ) {
    const { gravity, cameraPosition } = {
      gravity: 9.81,
      cameraPosition: [2, 2, 2] as Point3d,
      ...options,
    };
    console.log(gravity, options);
    const { width, height } = container.getBoundingClientRect();
    this.scene = new Scene();
    this.world = new rapier.World(new rapier.Vector3(0, -gravity, 0));
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

    const camera = createCamera(width / height, cameraPosition);
    this.scene.add(createLights());
    const controls = createControls(camera, this.renderer);

    const clock = new Clock();
    this.renderer.setAnimationLoop(() => {
      if (!this.manualTimeEnabled) {
        this.world.step();
      }
      controls.update(clock.getDelta());
      if (this.rapierDebugRenderer) {
        this.rapierDebugRenderer.update();
      }
      for (const simulatedObject of this.objects) {
        simulatedObject.updateFromCollider();
      }
      this.renderer.render(this.scene, camera);
      this.labelRenderer.render(this.scene, camera);
    });
  }

  debug() {
    this.debugEnabled = true;
    this.rapierDebugRenderer = new RapierThreeJsDebugRenderer(
      this.scene,
      this.world,
    );
    const axesHelper = new AxesHelper(5);
    this.scene.add(axesHelper);
    for (const obj of this.objects) {
      obj.addDebugObjects(this.scene);
    }
  }

  manualTime() {
    this.manualTimeEnabled = true;
    this.renderer.domElement.addEventListener("click", () => {
      this.world.step();
    });
  }

  add(simulatedObject: ISimulatedObject) {
    simulatedObject.addToScene(this.scene);
    simulatedObject.addToPhysicsWorld(this.world);
    this.objects.push(simulatedObject);
    if (this.debugEnabled) {
      simulatedObject.addDebugObjects(this.scene);
    }
  }

  dispose() {
    this.renderer.dispose();
  }
}
