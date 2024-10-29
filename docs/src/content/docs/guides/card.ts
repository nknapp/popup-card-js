

export function createBaseCard(cardThickness = 0.1) {
    return {
        points3d: {
            p1: [-0.5, 0.05, 0.5],
            p2: [-0.5, 0.05, 0],
            p3: [-0.5, 0.05, -0.5],
            p4: [0.5, 0.05, -0.5],
            p5: [0.5, 0.05, 0],
            p6: [0.5, 0.05, 0.5],
        },
        segments: {
            a: ["p1", "p2", "p5", "p6"],
            b: ["p2", "p3", "p4", "p5"],
        },
        // dominance: {
        //   // b: 120,
        //   // a: 119,
        // },
        fixedSegments: ["b"],
        folds: {
            one: ["a", "b"],
        },
        motors: ["one"],
        color: "green",
        thickness: cardThickness,
    };
}