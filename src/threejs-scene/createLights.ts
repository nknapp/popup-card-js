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
  result.add(directionalLight("white", 1, -1000, 0, 0));
  result.add(directionalLight("white", 2, 1000, 0, 1000));
  result.add(createSpotLight("white", 100, 100, 100, 500));
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
  spotLight.angle = 1;
  spotLight.penumbra = 0.3;
  spotLight.decay = 0;
  spotLight.distance = distance;

  return spotLight;
}
