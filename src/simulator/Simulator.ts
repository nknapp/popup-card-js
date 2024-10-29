import {
  AxesHelper,
  Clock,
  PCFSoftShadowMap,
  WebGLRenderer,
  Scene,
} from "../vendor/three";
import { createCamera } from "./createCamera.ts";
import { createLights } from "./createLights.ts";
import { createControls, CreateControlsReturn } from "./createControls.ts";
import { RapierThreeJsDebugRenderer } from "./RapierThreeJsDebugRenderer.ts";
import { CSS2DRenderer, PerspectiveCamera } from "../vendor/three";
import { Point3d } from "../FoldedPaper/FoldedPaper.types.ts";
import {
  World,
  type Rapier,
  RAPIER,
  rapierInitialized,
  JointData,
} from "../vendor/rapier.ts";
import { SimpleSimulatedObject } from "../simulatedObjects/SimpleSimulatedObject/SimpleSimulatedObject.ts";

export interface ISimulatedObject {
  addToScene(scene: Scene): void;

  addDebugObjects(scene: Scene): void;

  addToPhysicsWorld(world: World, rapier: Rapier): void;
  step(): void;

  updateFromCollider(): void;
}

export interface SimulatorOptions {
  /**
   * The downwards gravity of the simulator.
   * Default: 9.81
   */
  gravity: number;
  cameraPosition: Point3d;
}

export function createSimulator(
  container: HTMLElement,
  options: Partial<SimulatorOptions> = {},
): Simulator {
  return new Simulator(container, options);
}

export class Simulator {
  scene: Scene;
  renderer: WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  world: World = null!;
  objects: ISimulatedObject[] = [];
  private rapierDebugRenderer?: RapierThreeJsDebugRenderer;
  debugEnabled: boolean = false;
  private controls: CreateControlsReturn;
  private readonly camera: PerspectiveCamera;

  constructor(container: HTMLElement, options: Partial<SimulatorOptions> = {}) {
    const { gravity, cameraPosition } = {
      gravity: 9.81,
      cameraPosition: [2, 2, 2] as Point3d,
      ...options,
    };
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
    this.scene.add(createLights());
    this.controls = createControls(this.camera, this.renderer);

    rapierInitialized.then(() => {
      this.world = new RAPIER.World(new RAPIER.Vector3(0, -gravity, 0));
    });

    // TODO: The __simulator__ is only set for tests and should be moved out of this class
    window.__simulator__ = this;
    // TODO: The simulator should not decide whether to start the simulation based on the URL
    // This should be done in the manual-test framework
    if (!document.location.search.includes("&playwright=true")) {
      this.start();
    }
  }

  debug() {
    this.debugEnabled = true;
    rapierInitialized.then(() => {
      this.rapierDebugRenderer = new RapierThreeJsDebugRenderer(
        this.scene,
        this.world,
      );
    });
    const axesHelper = new AxesHelper(5);
    this.scene.add(axesHelper);
    for (const obj of this.objects) {
      obj.addDebugObjects(this.scene);
    }
  }

  add(simulatedObject: ISimulatedObject) {
    simulatedObject.addToScene(this.scene);
    rapierInitialized.then(() => {
      simulatedObject.addToPhysicsWorld(this.world, RAPIER);
    });
    this.objects.push(simulatedObject);
    if (this.debugEnabled) {
      simulatedObject.addDebugObjects(this.scene);
    }
  }

  glue(from: SimpleSimulatedObject, to: SimpleSimulatedObject) {
    rapierInitialized.then(() => {
      const jointData = JointData.fixed(
        { x: 0.0, y: 0.0, z: 0.0 },
        { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
        { x: 0.0, y: 0.0, z: 0.0 },
        { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
      );
      const glueJoint = this.world.createImpulseJoint(
        jointData,
        from.rigidBody!,
        to.rigidBody!,
        true,
      );
      glueJoint.setContactsEnabled(true);
    });
  }

  dispose() {
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.labelRenderer.domElement.remove();
  }

  step(delta: number = 1 / 60) {
    for (const simulatedObject of this.objects) {
      simulatedObject.step()
    }
    this.world.step();
    this.controls.update(delta);
  }

  async runSteps(count: number): Promise<void> {
    await rapierInitialized;
    for (let i = 0; i < count; i++) {
      this.step();
    }
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        this.render();
        resolve();
      }),
    );
  }

  async start() {
    await rapierInitialized;
    const clock = new Clock();
    this.renderer.setAnimationLoop(() => {
      this.step(clock.getDelta());
      this.render();
    });
  }

  render() {
    if (this.rapierDebugRenderer) {
      this.rapierDebugRenderer.update();
    }
    for (const simulatedObject of this.objects) {
      simulatedObject.updateFromCollider();
    }
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }
}
