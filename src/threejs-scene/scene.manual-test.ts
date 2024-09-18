import {
  Clock, Mesh, MeshStandardMaterial,
  PCFSoftShadowMap,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { createLights } from "./createLights.ts";
import { createControls } from "./createControls.ts";
import { createCamera } from "./createCamera.ts";

export function manualTest(container: HTMLDivElement) {
  const { width, height } = container.getBoundingClientRect();
  const scene = new Scene();
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const camera = createCamera(width / height);
  scene.add(createLights());
  const controls = createControls(camera, renderer);

  const clock = new Clock();
  renderer.setAnimationLoop(() => {
    controls.update(clock.getDelta());
    renderer.render(scene, camera)
  });
  container.appendChild(renderer.domElement);
  scene.add(new Mesh(new SphereGeometry(1), new MeshStandardMaterial({color: "white"})));

}
