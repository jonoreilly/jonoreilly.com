export type RGB = { red: number; green: number; blue: number };

export type Material =
  | {
      ambient: RGB;
      diffuse: RGB;
      specular: RGB;
      shininess: number;
    }
  | Record<string, never>;

export type Position2d = {
  x: number;
  y: number;
};

export type Position3d = Position2d & {
  z: number;
};

export type Projection = {
  position: Position2d;
  distance: number;
};

export type Array4<T> = [T, T, T, T];
export type Row = Array4<number>;
export type Matrix = Array4<Row>;
export type RowMatrix = [Row];
export type ColumnMatrix = Array4<[number]>;
export type Matrices =
  | {
      world: Matrix;
      view: Matrix;
      perspective: Matrix;
    }
  | Record<string, never>;

export type Vertex = {
  position: Position3d;
};

export type Light = {
  position: Position3d;
  color: RGB;
};

export type LightProjection = Projection & {
  color: RGB;
};

export type Renderer = {
  isRendering: boolean;
  shouldRender: boolean;
};

export type Keypress = {
  speed: number;
  intervals: Record<string, number>;
  delay: number;
};

export type Camera = Position3d & {
  fov: number;
  near: number;
  far: number;
};

export type Face = [number, number, number];

export type Character = {
  material: Material;
  vertices: Vertex[];
  faces: Face[];
  lights: Light[];
};

const character: Character = {
  material: {},
  vertices: [],
  faces: [],
  lights: [],
};

const matrices: Matrices = {};

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

const renderer: Renderer = {
  isRendering: false,
  shouldRender: true,
};

const keypress: Keypress = {
  speed: 0.01,
  intervals: {},
  delay: 10,
};

const camera: Camera = {
  x: 0,
  y: 0,
  z: -8,
  fov: 45,
  near: 0.1,
  far: 100,
};

const backgroundColor = "#333";

const defaultMaterial: Material = {
  ambient: { red: 0.1, green: 0.1, blue: 0.1 },
  diffuse: { red: 0.5, green: 0.5, blue: 0.5 },
  specular: { red: 0.8, green: 0.8, blue: 0.8 },
  shininess: 10,
};

const defaultLight: Light = {
  position: {
    x: 4,
    y: 3,
    z: 10,
  },
  color: { red: 1, green: 1, blue: 1 },
};

// -----------------------------------------------------------------------
// Render ----------------------------------------------------------------
// -----------------------------------------------------------------------

function setupCanvas() {
  canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;

  context = canvas.getContext("2d") as CanvasRenderingContext2D;

  setCanvasValues();

  render();
}

function setCanvasValues() {
  context.lineWidth = 0.5;

  context.fillStyle = backgroundColor;
}

function setupMatrices() {
  matrices.world = identity();

  matrices.view = view(camera.x, camera.y, camera.z);

  matrices.perspective = perspective(camera.fov, camera.near, camera.far);
}

function render() {
  renderer.shouldRender = true;

  renderCycle();
}

function renderCycle() {
  while (renderer.shouldRender && !renderer.isRendering) {
    renderer.shouldRender = false;

    renderer.isRendering = true;

    const { positions, lights, faceColors } = calculatePositions();

    draw(positions, lights, faceColors);

    renderer.isRendering = false;
  }
}

function calculatePositions(): {
  positions: Projection[];
  faceColors: RGB[];
  lights: LightProjection[];
} {
  const light3dPositions: Light[] = character.lights.map<Light>(
    ({ position: { x, y, z }, color }) => {
      const lightRespectToCamera = mat4Mult([[x, y, z, 1]], matrices.view);

      return {
        position: {
          x: lightRespectToCamera[0][0],
          y: lightRespectToCamera[0][1],
          z: lightRespectToCamera[0][2],
        },
        color,
      };
    }
  );

  const lightPositions = light3dPositions.map(
    ({ position: { x, y, z }, color }) => {
      const positionInProyectionPlane = mat4Mult(
        [[x, y, z, 1]],
        matrices.perspective
      );

      const positionInCanvas = mapTo2d(positionInProyectionPlane[0]);

      return {
        position: positionInCanvas,
        color: {
          red: color.red * 255,
          green: color.green * 255,
          blue: color.blue * 255,
        },
        distance: positionInProyectionPlane[0][2],
      };
    }
  );

  // Vertices

  const verticesRespectToSelf = character.vertices.map(
    ({ position: { x, y, z } }) => {
      const vertexMat: [Row] = [[x, y, z, 1]];

      return mat4Mult(vertexMat, matrices.world);
    }
  );

  const verticesRespectToCamera = verticesRespectToSelf.map(
    (vertexRespectToSelf) => {
      return mat4Mult(vertexRespectToSelf, matrices.view);
    }
  );

  // calculate 2d vertex proyection
  const verticesInProyectionPlane = verticesRespectToCamera.map(
    (vertexRespectToCamera) => {
      return mat4Mult(vertexRespectToCamera, matrices.perspective);
    }
  );

  const positions = verticesInProyectionPlane.map((vertexInProyectionPlane) => {
    const positionInCanvas = mapTo2d(vertexInProyectionPlane[0]);

    return {
      position: positionInCanvas,
      distance: vertexInProyectionPlane[0][2],
    };
  });

  // Faces

  const faceVertices = character.faces.map((face) => {
    return face.map<Position3d>((i) => {
      const [[x, y, z]] = verticesRespectToSelf[i - 1];

      return { x, y, z };
    });
  });

  const faceNormals = faceVertices.map((vertices) => {
    const sumPositions = vertices.reduce<Position3d>(
      (acc, vertex) => {
        return {
          x: acc.x + vertex.x,
          y: acc.y + vertex.y,
          z: acc.z + vertex.z,
        };
      },
      { x: 0, y: 0, z: 0 }
    );

    const center: Position3d = {
      x: sumPositions.x / 3,
      y: sumPositions.y / 3,
      z: sumPositions.z / 3,
    };

    const [A, B, C] = vertices;

    const x = (B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z);
    const y = (B.z - A.z) * (C.x - A.x) - (C.z - A.z) * (B.x - A.x);
    const z = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);

    const normal = normalize({ x, y, z });

    return {
      center,
      normal,
    };
  });

  const faceColors = faceNormals.map(({ center, normal }) => {
    return calculateColor(center, normal, character.lights);
  });

  return {
    positions,
    lights: lightPositions,
    faceColors,
  };
}

function mapTo2d(position: Row): Position2d {
  const zoom = canvas.width / 4;
  return {
    x: (position[0] / Math.abs(position[2])) * zoom + canvas.width / 2,
    y: (position[1] / Math.abs(position[2])) * zoom * -1 + canvas.height / 2,
  };
}

function calculateColor(
  center: Position3d,
  normal: Position3d,
  light3dPositions: Light[]
): RGB {
  const toCamera = normalize(distance(center, camera));

  const dotNormalToCamera = dot(toCamera, normal);

  const isNormalPointingToCamera = dotNormalToCamera < 0;

  if (!isNormalPointingToCamera) {
    normal = scalarMult(normal, -1);
  }

  const ambientLight = calculateAmbientLight();

  const cumulativeColor = light3dPositions.reduce<RGB>(
    (acc, light) => {
      const toLight = distance(center, light.position);

      const diffuseFactor = dot(normalize(toLight), normal);

      const reflection = normalize(
        distance(
          toLight,
          scalarMult(normal, 2 * dot(normal, normalize(toLight)))
        )
      );

      const specularFactor = Math.pow(
        dot(reflection, toCamera),
        character.material.shininess
      );

      const isFacingLight = diffuseFactor > 0;

      if (isFacingLight) {
        return {
          red:
            acc.red +
            light.color.red *
              (character.material.diffuse.red * diffuseFactor +
                character.material.specular.red * specularFactor),
          green:
            acc.green +
            light.color.green *
              (character.material.diffuse.green * diffuseFactor +
                character.material.specular.green * specularFactor),
          blue:
            acc.blue +
            light.color.blue *
              (character.material.diffuse.blue * diffuseFactor +
                character.material.specular.blue * specularFactor),
        };
      } else {
        return acc;
      }
    },
    {
      red: ambientLight.red * character.material.ambient.red,
      green: ambientLight.green * character.material.ambient.green,
      blue: ambientLight.blue * character.material.ambient.blue,
    }
  );

  return {
    red: cumulativeColor.red * (1.0 / character.lights.length) * 255,
    green: cumulativeColor.green * (1.0 / character.lights.length) * 255,
    blue: cumulativeColor.blue * (1.0 / character.lights.length) * 255,
  };
}

function calculateAmbientLight(): RGB {
  const sumLights = character.lights.reduce<RGB>(
    (acc, cur) => {
      return {
        red: acc.red + cur.color.red,
        green: acc.green + cur.color.green,
        blue: acc.blue + cur.color.blue,
      };
    },
    { red: 0, green: 0, blue: 0 }
  );

  return {
    red: sumLights.red * (1.0 / character.lights.length),
    green: sumLights.green * (1.0 / character.lights.length),
    blue: sumLights.blue * (1.0 / character.lights.length),
  };
}

function normalize(v: Position3d): Position3d {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return {
    x: v.x * (1.0 / magnitude),
    y: v.y * (1.0 / magnitude),
    z: v.z * (1.0 / magnitude),
  };
}

function distance(a: Position3d, b: Position3d): Position3d {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z,
  };
}

function dot(a: Position3d, b: Position3d) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function scalarMult(v: Position3d, s: number): Position3d {
  return {
    x: v.x * s,
    y: v.y * s,
    z: v.z * s,
  };
}

function draw(
  positions: Projection[],
  lights: LightProjection[],
  faceColors: RGB[]
) {
  drawFlatShading(positions, lights, faceColors);
  // drawPhong(positions, lights);
}

function drawFlatShading(
  positions: Projection[],
  lights: LightProjection[],
  faceColors: RGB[]
) {
  // console.log("draw Flat Shading");
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const light of lights) {
    context.fillStyle = colorCode(light);
    context.beginPath();
    context.arc(
      light.position.x,
      light.position.y,
      300 / (light.distance + 5),
      0,
      2 * Math.PI
    );
    context.fill();
  }

  const measuredFaces = character.faces.map((vertices, i) => {
    const distance = vertices.reduce(
      (acc, vertex) => acc + positions[vertex - 1].distance,
      0
    );

    const color = faceColors[i];

    return {
      vertices,
      distance,
      color,
    };
  });

  const sortedFaces = measuredFaces.sort((a, b) => {
    return b.distance - a.distance;
  });

  for (const face of sortedFaces) {
    const v0 = positions[face.vertices[0] - 1];
    const v1 = positions[face.vertices[1] - 1];
    const v2 = positions[face.vertices[2] - 1];

    const color = colorCode({ color: face.color });

    // draw
    context.fillStyle = color;
    context.strokeStyle = color;
    // context.strokeStyle = "rgba(0,0,0,0)";
    context.beginPath();
    context.moveTo(v0.position.x, v0.position.y);
    context.lineTo(v1.position.x, v1.position.y);
    context.lineTo(v2.position.x, v2.position.y);
    context.closePath();
    context.fill();
    context.stroke();
  }
}

function drawPhong(positions: Projection[], lights: LightProjection[]) {
  // console.log("draw Phong");
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const light of lights) {
    context.fillStyle = colorCode(light);
    context.beginPath();
    context.arc(
      light.position.x,
      light.position.y,
      Math.abs(10 / light.distance),
      0,
      2 * Math.PI
    );
    context.fill();
  }
  for (const face of character.faces) {
    const v0 = positions[face[0] - 1];
    const v1 = positions[face[1] - 1];
    const v2 = positions[face[2] - 1];
    // draw lines
    drawLine(v0, v1);
    drawLine(v1, v2);
    drawLine(v2, v0);
  }
}

function drawLine(a: Projection, b: Projection) {
  // context.strokeStyle = createGradient(a, b);
  context.strokeStyle = colorCode(defaultLight); // createGradient(a, b);
  context.beginPath();
  context.moveTo(a.position.x, a.position.y);
  context.lineTo(b.position.x, b.position.y);
  context.stroke();
}

// function createGradient(a: Projection, b: Projection) {
//   const gradient = context.createLinearGradient(
//     a.position.x,
//     a.position.y,
//     b.position.x,
//     b.position.y
//   );
//   gradient.addColorStop(0, colorCode(a));
//   gradient.addColorStop(1, colorCode(b));
//   return gradient;
// }

function colorCode({ color: { red, green, blue } }: { color: RGB }) {
  return `rgba(${red}, ${green}, ${blue}, 1)`;
}

// -----------------------------------------------------------------------
// Key presses -----------------------------------------------------------
// -----------------------------------------------------------------------

function setKeyPressListeners() {
  window.addEventListener("keydown", function (e) {
    if (!e.repeat) {
      clearInterval(keypress.intervals[e.key]);
      keypress.intervals[e.key] = setInterval(function () {
        onKeyPress(e);
      }, keypress.delay);
    }
  });
  window.addEventListener("keyup", function (e) {
    clearInterval(keypress.intervals[e.key]);
  });
}

function onKeyPress(e: KeyboardEvent) {
  switch (e.key) {
    case "w":
      doRotateX(-keypress.speed);
      break;
    case "s":
      doRotateX(keypress.speed);
      break;
    case "a":
      doRotateY(keypress.speed);
      break;
    case "d":
      doRotateY(-keypress.speed);
      break;
    case "q":
      doRotateZ(keypress.speed);
      break;
    case "e":
      doRotateZ(-keypress.speed);
      break;
    case "ArrowUp":
      doTranslateY(keypress.speed * 2);
      break;
    case "ArrowDown":
      doTranslateY(-keypress.speed * 2);
      break;
    case "ArrowLeft":
      doTranslateX(-keypress.speed * 2);
      break;
    case "ArrowRight":
      doTranslateX(keypress.speed * 2);
      break;
    case "i":
      doScale(1 + keypress.speed);
      break;
    case "o":
      doScale(1 - keypress.speed);
      break;
    default:
      clearInterval(keypress.intervals[e.key]);
  }
  render();
}

function doRotateX(speed: number) {
  matrices.world = mat4Mult(matrices.world, rotateX(speed));
}

function doRotateY(speed: number) {
  matrices.world = mat4Mult(matrices.world, rotateY(speed));
}

function doRotateZ(speed: number) {
  matrices.world = mat4Mult(matrices.world, rotateZ(speed));
}

function doTranslateX(speed: number) {
  matrices.view = mat4Mult(matrices.view, translate(speed, 0, 0));
}

function doTranslateY(speed: number) {
  matrices.view = mat4Mult(matrices.view, translate(0, speed, 0));
}

function doScale(speed: number) {
  matrices.world = mat4Mult(matrices.world, scale(speed, speed, speed));
}

// -----------------------------------------------------------------------
// Assignment functions --------------------------------------------------
// -----------------------------------------------------------------------
function mat4Mult(a: Matrix, b: Matrix): Matrix;
function mat4Mult(a: Matrix, b: RowMatrix): Matrix;
function mat4Mult(a: Matrix, b: ColumnMatrix): ColumnMatrix;
function mat4Mult(a: RowMatrix, b: Matrix): RowMatrix;
function mat4Mult(a: ColumnMatrix, b: Matrix): Matrix;
function mat4Mult(a: RowMatrix, b: ColumnMatrix): [[number]];
function mat4Mult(a: number[][], b: number[][]): number[][] {
  if (a?.[0]?.length !== b?.length) {
    console.log(a, b);
    throw new Error("This matrices cannot be multiplied");
  }
  const matrix = a.reduce<number[][]>((acc, cur, i) => {
    const row = b[0].reduce<number[]>((acc2, cur2, j) => {
      const value = b.reduce<number>((acc3, cur3, k) => {
        return acc3 + a[i][k] * b[k][j];
      }, 0);
      acc2.push(value);
      return acc2;
    }, []);
    acc.push(row);
    return acc;
  }, []);
  return matrix;
}

function rotateX(alpha: number): Matrix {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [1, 0, 0, 0],
    [0, cos, sin, 0],
    [0, -sin, cos, 0],
    [0, 0, 0, 1],
  ];
}

function rotateY(alpha: number): Matrix {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
}

function rotateZ(alpha: number): Matrix {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [cos, sin, 0, 0],
    [-sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}
function translate(dx: number, dy: number, dz: number): Matrix {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [dx, dy, dz, 1],
  ];
}

function scale(sx: number, sy: number, sz: number): Matrix {
  return [
    [sx, 0, 0, 0],
    [0, sy, 0, 0],
    [0, 0, sz, 0],
    [0, 0, 0, 1],
  ];
}

// s = 1/tan((fov/2)∗(π/180))
// n = near clipping plane
// f = far clipping plane
// a = -f/(f-n)
// b = -(f*n)/(f-n)

function perspective(fov: number, near: number, far: number): Matrix {
  const s = 1.0 / Math.tan((fov / 2.0) * (Math.PI / 180.0));
  const a = -far / (far - near);
  const b = -(far * near) / (far - near);
  return [
    [s, 0, 0, 0],
    [0, s, 0, 0],
    [0, 0, a, -1],
    [0, 0, b, 0],
  ];
}

function identity(): Matrix {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

function view(px: number, py: number, pz: number): Matrix {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [px, py, pz, 1],
  ];
}

// -----------------------------------------------------------------------
// File input ------------------------------------------------------------
// -----------------------------------------------------------------------

function readFile(selectedFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = function () {
      reject(reader.error);
    };
    reader.readAsText(selectedFile);
  });
}

export function setupFileInput(): void {
  const fileInput = document.getElementById("obj-file") as HTMLInputElement;
  fileInput.onchange = async function () {
    const selectedFile = fileInput.files?.[0];
    if (!selectedFile?.name?.endsWith(".obj")) {
      alert("This file type is not supported");
      return;
    }
    try {
      const fileContent = await readFile(selectedFile);
      const character = parseObjFile(fileContent);
      setCharacter(character);
    } catch (error) {
      console.error(error);
      alert("Error reading file");
    }
  };
}

function parseObjFile(file: string): Character {
  let newMaterial: Material = defaultMaterial;
  const newVertices: Vertex[] = [];
  const newFaces: Face[] = [];
  const newLights: Light[] = [];
  // parse file
  const rows = file.split("\n");
  for (const row of rows) {
    const columns = row.split(" ");
    if (columns.length) {
      const rowType = columns[0].toUpperCase();
      const values = columns.slice(1).map((v: string) => parseFloat(v));
      switch (rowType) {
        case "M":
          newMaterial = {
            ambient: { red: values[0], green: values[1], blue: values[2] },
            diffuse: { red: values[3], green: values[4], blue: values[5] },
            specular: { red: values[6], green: values[7], blue: values[8] },
            shininess: values[9],
          };
          break;
        case "V":
          newVertices.push({
            position: { x: values[0], y: values[1], z: values[2] },
          });
          break;
        case "F":
          newFaces.push([values[0], values[1], values[2]]);
          break;
        case "L":
          newLights.push({
            position: { x: values[0], y: values[1], z: values[2] },
            color: { red: values[3], green: values[4], blue: values[5] },
          });
          break;
      }
    }
  }

  if (!newLights.length) {
    newLights.push(defaultLight);
  }

  // center object
  const offsetTotal = newVertices.reduce<Position3d>(
    (acc, cur) => {
      return {
        x: acc.x + cur.position.x,
        y: acc.y + cur.position.y,
        z: acc.z + cur.position.z,
      };
    },
    { x: 0, y: 0, z: 0 }
  );

  const offsetAverage: Position3d = {
    x: offsetTotal.x * (1.0 / newVertices.length),
    y: offsetTotal.y * (1.0 / newVertices.length),
    z: offsetTotal.z * (1.0 / newVertices.length),
  };

  const centeredVertices = newVertices.map<Vertex>((v) => {
    return {
      position: {
        x: v.position.x - offsetAverage.x,
        y: v.position.y - offsetAverage.y,
        z: v.position.z - offsetAverage.z,
      },
    };
  });

  const centeredLights = newLights.map<Light>((l) => {
    return {
      position: {
        x: l.position.x - offsetAverage.x,
        y: l.position.y - offsetAverage.y,
        z: l.position.z - offsetAverage.z,
      },
      color: l.color,
    };
  });

  return {
    material: newMaterial,
    vertices: centeredVertices,
    faces: newFaces,
    lights: centeredLights,
  };
}

export function setCharacter(value: Character): void {
  character.faces = value.faces;
  character.lights = value.lights;
  character.material = value.material;
  character.vertices = value.vertices;

  render();
}

// -----------------------------------------------------------------------
// Initialization --------------------------------------------------------
// -----------------------------------------------------------------------

export async function loadCharacter(filename: string): Promise<void> {
  const fileModule = await require(`@/assets/projects/webGL/obj/${filename}`);
  const character = parseObjFile(fileModule.default);
  setCharacter(character);
}

export function init(): void {
  setupMatrices();
  setupFileInput();
  setKeyPressListeners();
  setupCanvas();
}

// })();
