
import { PerspectiveCamera } from "three";

export function createCamera(aspect: number) {
    const camera = new PerspectiveCamera(
        30,
        aspect,
        0.1,
        10000
    );
    camera.position.x = 20;
    camera.position.z = 20;
    camera.position.y = 20;

    return camera;
}

