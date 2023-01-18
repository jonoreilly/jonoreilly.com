import {
  faceNames,
  FaceName,
  Cube,
  getRotated,
  areSameCube,
  getCube,
} from "../cube";

type Position = {
  id: number;
  previousPositionId?: number;
  movedFace?: FaceName;
  cube: Cube;
  depth: number;
};

type Stats = {
  total: number;
  discarded: number;
  cube: Cube;
  depth: number;
  positionsPerSecond: number;
};

const solvedCube = getCube();

function isSolved(cube: Cube) {
  return areSameCube(cube, solvedCube);
}

function traceBackSteps(
  position: Position,
  checkedPositions: Position[]
): FaceName[] {
  if (!position.movedFace) {
    return [];
  }

  const previousPosition = checkedPositions.find(
    (el) => el.id === position.previousPositionId
  );

  if (!previousPosition) {
    return [position.movedFace];
  }

  return [
    position.movedFace,
    ...traceBackSteps(previousPosition, checkedPositions),
  ];
}

export async function getStepsToSolve(
  cube: Cube,
  progressCallback: (stats: Stats) => void
): Promise<FaceName[]> {
  if (isSolved(cube)) {
    return [];
  }

  const start = performance.now();

  let callbackDelay = 1000;

  const stats = {
    total: 0,
    discarded: 0,
  };

  const checkedPositions: Position[] = [];

  const positionsToCheck: Position[] = [{ id: stats.total, cube, depth: 0 }];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const position = positionsToCheck.shift();

    if (!position) {
      throw `Ran out of positions to check after checking ${stats.total} positions`;
    }

    checkedPositions.push(position);

    for (const face of faceNames) {
      stats.total++;

      const newCube = getRotated(position.cube, face);

      if (stats.total % callbackDelay === 0) {
        const elapsedTime = performance.now() - start;

        const positionsPerSecond = stats.total / (elapsedTime / 1000);

        progressCallback({
          ...stats,
          cube: newCube,
          depth: position.depth + 1,
          positionsPerSecond,
        });

        await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

        const positionsPerFrame = positionsPerSecond / 15;

        if (positionsPerFrame < callbackDelay) {
          callbackDelay = Math.ceil(positionsPerFrame);
        }
      }

      const newPosition = {
        id: stats.total,
        previousPositionId: position.id,
        movedFace: face,
        cube: newCube,
        depth: position.depth + 1,
      };

      if (
        [checkedPositions, positionsToCheck].some((list) =>
          list.some((el) => areSameCube(el.cube, newCube))
        )
      ) {
        stats.discarded++;

        continue;
      }

      if (isSolved(newCube)) {
        console.log("SOLVED", {
          totalProcessed: stats.total,
          checkedPositions: checkedPositions.length,
          positionsToCheck: positionsToCheck.length,
        });

        return traceBackSteps(newPosition, checkedPositions);
      }

      positionsToCheck.push(newPosition);
    }
  }
}
