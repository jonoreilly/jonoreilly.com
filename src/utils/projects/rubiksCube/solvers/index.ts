import {
  areSameCube,
  Cube,
  FaceName,
  faceNames,
  getCube,
  getRotated,
} from "../cube";
import { StatsTracker } from "./stats";
import { getStorage, Storage } from "./storage";

export type Stats = {
  total: number;
  discarded: number;
  cube: Cube;
  depth: number;
  positionsPerSecond: number;
  distance: number;
  elapsedTime: number;
};

type Position = {
  id: number;
  previousPositionId?: number;
  movedFace?: FaceName;
  cube: Cube;
  depth: number;
  distance: number;
};

type Params = {
  cube: Cube;
  progressCallback: (stats: Stats) => void;
  algorythm: "brute-force" | "dijkstra";
  storage: "array" | "object";
};

const solvedCube = getCube();

function isSolved(cube: Cube) {
  return areSameCube(cube, solvedCube);
}

function traceBackSteps(
  position: Position,
  checkedPositions: Storage<Position>
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

export function getDistanceBetweenCubes(a: Cube, b: Cube) {
  const cellPositions = faceNames.flatMap((face) =>
    [...Array(3)].flatMap((_, x) =>
      [...Array(3)].map((_, y) => ({ face, x, y }))
    )
  );

  const differentFaces = cellPositions.filter(
    ({ face, x, y }) => a[face][x][y].faceName !== b[face][x][y].faceName
  );

  const differentRows = cellPositions.filter(
    ({ face, x, y }) => a[face][x][y].row !== b[face][x][y].row
  );

  const differentColumns = cellPositions.filter(
    ({ face, x, y }) => a[face][x][y].column !== b[face][x][y].column
  );

  const distance =
    differentFaces.length + differentRows.length + differentColumns.length;

  return distance;
}

export function getDistanceToSolved(cube: Cube) {
  return getDistanceBetweenCubes(cube, solvedCube);
}

function getCheckedPositionStorage(params: Params) {
  return getStorage<Position>(
    params.storage === "array" ? "hashed-ordered-linked-list" : "hashed-heap",
    (el) => el.distance,
    (el) => JSON.stringify(el)
  );
}

function getUpcomingPositionStorage(params: Params, initialPosition: Position) {
  return getStorage(
    params.algorythm === "brute-force"
      ? "hashed-ordered-linked-list"
      : "hashed-heap",
    (el) => el.distance,
    (el) => JSON.stringify(el),
    [initialPosition]
  );
}

export async function getStepsToSolve(params: Params) {
  if (isSolved(params.cube)) {
    return [];
  }

  let callbackDelay = 1000;

  const stats = new StatsTracker();

  const checkedPositions = getCheckedPositionStorage(params);

  const positionsToCheck = getUpcomingPositionStorage(params, {
    id: 0,
    cube: params.cube,
    depth: 0,
    distance: 0,
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const position = positionsToCheck.popFirst();

    if (!position) {
      throw `Ran out of positions to check after checking ${stats.stats.total} positions`;
    }

    checkedPositions.add(position);

    // Compute movements

    for (const face of faceNames) {
      stats.incrementTotal();

      const newCube = getRotated(position.cube, face);

      const newPosition: Position = {
        id: stats.stats.total,
        previousPositionId: position.id,
        movedFace: face,
        cube: newCube,
        depth: position.depth + 1,
        distance: getDistanceToSolved(newCube),
      };

      // Trigger Progress Callback

      if (stats.stats.total % callbackDelay === 0) {
        const currentStats = stats.stats;

        params.progressCallback({
          ...currentStats,
          cube: newCube,
          depth: position.depth + 1,
          distance: position.distance,
        });

        await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

        const positionsPerFrame = currentStats.positionsPerSecond / 10;

        if (positionsPerFrame < callbackDelay) {
          callbackDelay = Math.ceil(positionsPerFrame);
        }
      }

      // Check if already added it to the list

      if (
        [checkedPositions, positionsToCheck].some((storage) =>
          storage.find((el) => areSameCube(el.cube, newCube))
        )
      ) {
        stats.incrementDiscarded();

        continue;
      }

      // Check if is solved

      if (isSolved(newCube)) {
        const currentStats = stats.stats;

        params.progressCallback({
          ...currentStats,
          cube: newCube,
          depth: position.depth + 1,
          distance: position.distance,
        });

        const steps = traceBackSteps(newPosition, checkedPositions);

        console.log("SOLVED", {
          steps,
          initialCube: params.cube,
          ...currentStats,
          checkedPositions: checkedPositions.length,
          positionsToCheck: positionsToCheck.length,
        });

        return steps;
      }

      // Store for later

      positionsToCheck.add(newPosition);
    }
  }
}
