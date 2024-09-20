import { Clock, PCFSoftShadowMap, Scene, WebGLRenderer } from "three";
import { createCamera } from "./createCamera.ts";
import { createLights } from "./createLights.ts";
import { createControls } from "./createControls.ts";
import { SimulatedObject } from "./SimulatedObject.ts";
import { rapier, World } from "../rapier";
import { RapierThreeJsDebugRenderer } from "./RapierThreeJsDebugRenderer.ts";

export class Simulator {
  scene: Scene;
  renderer: WebGLRenderer;
  world: World;
  objects: SimulatedObject[] = [];
  private rapierDebugRenderer?: RapierThreeJsDebugRenderer;

  constructor(container: HTMLDivElement) {
    const { width, height } = container.getBoundingClientRect();
    this.scene = new Scene();
    this.world = new rapier.World(new rapier.Vector3(0, -9.81, 0));
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    const camera = createCamera(width / height);
    this.scene.add(createLights());
    const controls = createControls(camera, this.renderer);

    const clock = new Clock();
    this.renderer.setAnimationLoop(() => {
      this.world.step();
      controls.update(clock.getDelta());
      if (this.rapierDebugRenderer) {
        this.rapierDebugRenderer.update();
      }
      for (const simulatedObject of this.objects) {
        simulatedObject.updateFromCollider();
      }
      this.renderer.render(this.scene, camera);
    });

    container.appendChild(this.renderer.domElement);
  }

  debug() {
    this.rapierDebugRenderer = new RapierThreeJsDebugRenderer(
      this.scene,
      this.world,
    );
  }

  add(simulatedObject: SimulatedObject) {
    this.scene.add(simulatedObject.mesh);
    simulatedObject.addToPhysicsWorld(this.world);
    this.objects.push(simulatedObject);
  }

  dispose() {
    this.renderer.dispose();
  }
}
