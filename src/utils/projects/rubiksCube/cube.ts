import cloneDeep from "lodash.clonedeep";

export type Cell = number;

export type Face = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

export type Cube = [Face, Face, Face, Face, Face, Face];

function createFace(face: number): Face {
  const start = face * 9;

  return [
    [start + 0, start + 1, start + 2],
    [start + 3, start + 4, start + 5],
    [start + 6, start + 7, start + 8],
  ];
}

export function getCube(): Cube {
  return [
    createFace(0),
    createFace(1),
    createFace(2),
    createFace(3),
    createFace(4),
    createFace(5),
  ];
}

function rotateFace(face: Face): Face {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

export function getRotated(cube: Cube, face: number): Cube {
  const clone = cloneDeep(cube);

  switch (face) {
    // U
    case 0:
      return [
        rotateFace(clone[0]),
        [clone[2][0], clone[1][1], clone[1][2]],
        [clone[3][0], clone[2][1], clone[2][2]],
        [clone[4][0], clone[3][1], clone[3][2]],
        [clone[1][0], clone[4][1], clone[4][2]],
        clone[5],
      ];

    // L
    case 1:
      return [
        [
          [clone[4][2][2], clone[0][0][1], clone[0][0][2]],
          [clone[4][1][2], clone[0][1][1], clone[0][1][2]],
          [clone[4][0][2], clone[0][2][1], clone[0][2][2]],
        ],
        rotateFace(clone[1]),
        [
          [clone[0][0][0], clone[2][0][1], clone[2][0][2]],
          [clone[0][1][0], clone[2][1][1], clone[2][1][2]],
          [clone[0][2][0], clone[2][2][1], clone[2][2][2]],
        ],
        clone[3],
        [
          [clone[4][0][0], clone[4][0][1], clone[5][2][0]],
          [clone[4][1][0], clone[4][1][1], clone[5][1][0]],
          [clone[4][2][0], clone[4][2][1], clone[5][0][0]],
        ],
        [
          [clone[2][0][0], clone[5][0][1], clone[5][0][2]],
          [clone[2][1][0], clone[5][1][1], clone[5][1][2]],
          [clone[2][2][0], clone[5][2][1], clone[5][2][2]],
        ],
      ];

    // F
    case 2:
      return [
        [
          clone[0][0],
          clone[0][1],
          [clone[1][2][2], clone[1][1][2], clone[1][0][2]],
        ],
        [
          [clone[1][0][0], clone[1][0][1], clone[5][0][0]],
          [clone[1][1][0], clone[1][1][1], clone[5][0][1]],
          [clone[1][2][0], clone[1][2][1], clone[5][0][2]],
        ],
        rotateFace(clone[2]),
        [
          [clone[0][2][0], clone[3][0][1], clone[3][0][2]],
          [clone[0][2][1], clone[3][1][1], clone[3][1][2]],
          [clone[0][2][2], clone[3][2][1], clone[3][2][2]],
        ],
        clone[4],
        [
          [clone[3][2][0], clone[3][1][0], clone[3][0][0]],
          clone[5][1],
          clone[5][2],
        ],
      ];

    // R
    case 3:
      return [
        [
          [clone[0][0][0], clone[0][0][1], clone[2][0][2]],
          [clone[0][1][0], clone[0][1][1], clone[2][1][2]],
          [clone[0][2][0], clone[0][2][1], clone[2][2][2]],
        ],
        clone[1],
        [
          [clone[2][0][0], clone[2][0][1], clone[5][0][2]],
          [clone[2][1][0], clone[2][1][1], clone[5][1][2]],
          [clone[2][2][0], clone[2][2][1], clone[5][2][2]],
        ],
        rotateFace(clone[3]),
        [
          [clone[0][2][2], clone[4][0][1], clone[4][0][2]],
          [clone[0][1][2], clone[4][1][1], clone[4][1][2]],
          [clone[0][0][2], clone[4][2][1], clone[4][2][2]],
        ],
        [
          [clone[5][0][0], clone[5][0][1], clone[4][2][0]],
          [clone[5][1][0], clone[5][1][1], clone[4][1][0]],
          [clone[5][2][0], clone[5][2][1], clone[4][0][0]],
        ],
      ];

    // B
    case 4:
      return [
        [
          [clone[3][0][2], clone[3][1][2], clone[3][2][2]],
          clone[0][1],
          clone[0][2],
        ],
        [
          [clone[0][0][2], clone[1][0][1], clone[1][0][2]],
          [clone[0][0][1], clone[1][1][1], clone[1][1][2]],
          [clone[0][0][0], clone[1][2][1], clone[1][2][2]],
        ],
        clone[2],
        [
          [clone[3][0][0], clone[3][0][1], clone[5][2][2]],
          [clone[3][1][0], clone[3][1][1], clone[5][2][1]],
          [clone[3][2][0], clone[3][2][1], clone[5][2][0]],
        ],
        rotateFace(clone[4]),
        [
          [clone[5][0][0], clone[5][0][1], clone[5][0][2]],
          [clone[5][1][0], clone[5][1][1], clone[5][1][2]],
          [clone[1][0][0], clone[1][1][0], clone[1][2][0]],
        ],
      ];

    // D
    case 5:
      return [
        clone[0],
        [clone[1][0], clone[1][1], clone[4][2]],
        [clone[2][0], clone[2][1], clone[1][2]],
        [clone[3][0], clone[3][1], clone[2][2]],
        [clone[4][0], clone[4][1], clone[3][2]],
        rotateFace(clone[5]),
      ];
  }

  return cube;
}
