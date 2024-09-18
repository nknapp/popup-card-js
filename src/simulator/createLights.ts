import {
  AmbientLight,
  type ColorRepresentation,
  DirectionalLight,
  Group,
  SpotLight,
} from "three";

export function createLights() {
  const result = new Group();
  result.add(new AmbientLight("white", 0.5));
  result.add(directionalLight("white", 1, -20, 0, 10));
  result.add(directionalLight("white", 2, 20, 0, 20));
  result.add(createSpotLight("white", 10, 10, 20, 100));
  return result;
}

function directionalLight(
  color: ColorRepresentation,
  intensity: number,
  x: number,
  y: number,
  z: number,
): DirectionalLight {
  const light = new DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  return light;
}

function createSpotLight(
  color: ColorRepresentation,
  x: number,
  y: number,
  z: number,
  distance: number,
) {
  const spotLight = new SpotLight(color);
  spotLight.position.set(x, y, z);
  spotLight.castShadow = true;
  spotLight.angle = 0.5;
  spotLight.penumbra = 0.1;
  spotLight.decay = 0;
  spotLight.distance = distance;

  return spotLight;
}
