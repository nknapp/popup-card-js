import { Simulator } from "../simulator/Simulator.ts";
import { Hand } from "./Hand.ts";
import { addGround } from "../simulator/ground.test-helper.ts";
import { addPositionMarker } from "../simulator/positionMarker.test-helper.ts";

export async function manualTest(container: HTMLDivElement) {
  const simulator = new Simulator(container, {
    gravity: 0,
    cameraPosition: [0.5, 0.5, 2],
  });
  simulator.debug();
  addGround(simulator, { position: [0, -0.5, 0] });

  addPositionMarker(simulator, { position: [0, 0, 0] });
  const hand = new Hand({
    innerHeight: 0.2,
    thickness: 0.1,
    length: 0.5,
    grabMargin: 0.1,
  });
  simulator.add(hand);

  // simulator.add(
  //   new SimpleSimulatedObject(
  //     new Mesh(
  //       new SphereGeometry(0.05),
  //       new MeshStandardMaterial({ color: "green" }),
  //     ),
  //     { fixed: true, restitution: 1 },
  //   ),
  // );

  // simulator.add(
  //     new SimpleSimulatedObject(
  //         new Mesh(
  //             new SphereGeometry(0.05),
  //             new MeshStandardMaterial({ color: "green" }),
  //         ),
  //         { fixed: true, restitution: 1 },
  //     ),
  // );

  return () => {
    simulator.dispose();
  };
}
