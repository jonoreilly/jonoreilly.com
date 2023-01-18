import cloneDeep from "lodash.clonedeep";

export const faceNames = [
  "up",
  "down",
  "front",
  "back",
  "left",
  "right",
] as const;

export type FaceName = typeof faceNames[number];

export type Cell = {
  id: number;
  faceName: FaceName;
};

export type Face = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

export type Cube = {
  up: Face;
  left: Face;
  front: Face;
  right: Face;
  back: Face;
  down: Face;
};

function createCell(faceName: FaceName, row: number, column: number) {
  const faceId = {
    up: 0,
    left: 1,
    front: 2,
    right: 3,
    back: 4,
    down: 5,
  }[faceName];

  return {
    id: faceId * 9 + row * 3 + column,
    faceName,
  };
}

function createFace(faceName: FaceName): Face {
  return [
    [
      createCell(faceName, 0, 0),
      createCell(faceName, 0, 1),
      createCell(faceName, 0, 2),
    ],
    [
      createCell(faceName, 1, 0),
      createCell(faceName, 1, 1),
      createCell(faceName, 1, 2),
    ],
    [
      createCell(faceName, 2, 0),
      createCell(faceName, 2, 1),
      createCell(faceName, 2, 2),
    ],
  ];
}

export function getCube(): Cube {
  return {
    up: createFace("up"),
    left: createFace("left"),
    front: createFace("front"),
    right: createFace("right"),
    back: createFace("back"),
    down: createFace("down"),
  };
}

function rotateFace(face: Face): Face {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

export function getRotated(cube: Cube, faceName: FaceName): Cube {
  const clone = cloneDeep(cube);

  switch (faceName) {
    case "up":
      return {
        up: rotateFace(clone.up),
        left: [clone.front[0], clone.left[1], clone.left[2]],
        front: [clone.right[0], clone.front[1], clone.front[2]],
        right: [clone.back[0], clone.right[1], clone.right[2]],
        back: [clone.left[0], clone.back[1], clone.back[2]],
        down: clone.down,
      };

    case "left":
      return {
        up: [
          [clone.back[2][2], clone.up[0][1], clone.up[0][2]],
          [clone.back[1][2], clone.up[1][1], clone.up[1][2]],
          [clone.back[0][2], clone.up[2][1], clone.up[2][2]],
        ],
        left: rotateFace(clone.left),
        front: [
          [clone.up[0][0], clone.front[0][1], clone.front[0][2]],
          [clone.up[1][0], clone.front[1][1], clone.front[1][2]],
          [clone.up[2][0], clone.front[2][1], clone.front[2][2]],
        ],
        right: clone.right,
        back: [
          [clone.back[0][0], clone.back[0][1], clone.down[2][0]],
          [clone.back[1][0], clone.back[1][1], clone.down[1][0]],
          [clone.back[2][0], clone.back[2][1], clone.down[0][0]],
        ],
        down: [
          [clone.front[0][0], clone.down[0][1], clone.down[0][2]],
          [clone.front[1][0], clone.down[1][1], clone.down[1][2]],
          [clone.front[2][0], clone.down[2][1], clone.down[2][2]],
        ],
      };

    case "front":
      return {
        up: [
          clone.up[0],
          clone.up[1],
          [clone.left[2][2], clone.left[1][2], clone.left[0][2]],
        ],
        left: [
          [clone.left[0][0], clone.left[0][1], clone.down[0][0]],
          [clone.left[1][0], clone.left[1][1], clone.down[0][1]],
          [clone.left[2][0], clone.left[2][1], clone.down[0][2]],
        ],
        front: rotateFace(clone.front),
        right: [
          [clone.up[2][0], clone.right[0][1], clone.right[0][2]],
          [clone.up[2][1], clone.right[1][1], clone.right[1][2]],
          [clone.up[2][2], clone.right[2][1], clone.right[2][2]],
        ],
        back: clone.back,
        down: [
          [clone.right[2][0], clone.right[1][0], clone.right[0][0]],
          clone.down[1],
          clone.down[2],
        ],
      };

    case "right":
      return {
        up: [
          [clone.up[0][0], clone.up[0][1], clone.front[0][2]],
          [clone.up[1][0], clone.up[1][1], clone.front[1][2]],
          [clone.up[2][0], clone.up[2][1], clone.front[2][2]],
        ],
        left: clone.left,
        front: [
          [clone.front[0][0], clone.front[0][1], clone.down[0][2]],
          [clone.front[1][0], clone.front[1][1], clone.down[1][2]],
          [clone.front[2][0], clone.front[2][1], clone.down[2][2]],
        ],
        right: rotateFace(clone.right),
        back: [
          [clone.up[2][2], clone.back[0][1], clone.back[0][2]],
          [clone.up[1][2], clone.back[1][1], clone.back[1][2]],
          [clone.up[0][2], clone.back[2][1], clone.back[2][2]],
        ],
        down: [
          [clone.down[0][0], clone.down[0][1], clone.back[2][0]],
          [clone.down[1][0], clone.down[1][1], clone.back[1][0]],
          [clone.down[2][0], clone.down[2][1], clone.back[0][0]],
        ],
      };

    case "back":
      return {
        up: [
          [clone.right[0][2], clone.right[1][2], clone.right[2][2]],
          clone.up[1],
          clone.up[2],
        ],
        left: [
          [clone.up[0][2], clone.left[0][1], clone.left[0][2]],
          [clone.up[0][1], clone.left[1][1], clone.left[1][2]],
          [clone.up[0][0], clone.left[2][1], clone.left[2][2]],
        ],
        front: clone.front,
        right: [
          [clone.right[0][0], clone.right[0][1], clone.down[2][2]],
          [clone.right[1][0], clone.right[1][1], clone.down[2][1]],
          [clone.right[2][0], clone.right[2][1], clone.down[2][0]],
        ],
        back: rotateFace(clone.back),
        down: [
          [clone.down[0][0], clone.down[0][1], clone.down[0][2]],
          [clone.down[1][0], clone.down[1][1], clone.down[1][2]],
          [clone.left[0][0], clone.left[1][0], clone.left[2][0]],
        ],
      };

    case "down":
      return {
        up: clone.up,
        left: [clone.left[0], clone.left[1], clone.back[2]],
        front: [clone.front[0], clone.front[1], clone.left[2]],
        right: [clone.right[0], clone.right[1], clone.front[2]],
        back: [clone.back[0], clone.back[1], clone.right[2]],
        down: rotateFace(clone.down),
      };
  }
}

export function areSameCube(a: Cube, b: Cube) {
  for (const faceName of faceNames) {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (a[faceName][x][y].id !== b[faceName][x][y].id) {
          return false;
        }
      }
    }
  }

  return true;
}
