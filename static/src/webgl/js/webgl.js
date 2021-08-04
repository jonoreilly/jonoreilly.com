// const webgl = (function () {
// -----------------------------------------------------------------------
// Variables -----------------------=-------------------------------------
// -----------------------------------------------------------------------

var material = {};
var vertices = [];
var indices = [];
var lights = [];

const matrices = {
  world: null,
  view: null,
  perspective: null,
};

var canvas, context;
const renderer = {
  isRendering: false,
  shouldRender: true,
};
const keypress = {
  speed: 0.01,
  intervals: {},
  delay: 10,
};
const camera = {
  x: 0,
  y: 0,
  z: -8,
  fov: 45,
  near: 0.1,
  far: 100,
};
const backgroundColor = '#333';

// -----------------------------------------------------------------------
// Render ----------------------------------------------------------------
// -----------------------------------------------------------------------

function setupCanvas() {
  canvas = document.getElementById('webgl-canvas');
  context = canvas.getContext('2d');
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
    const { positions, lights } = calculatePositions();
    draw(positions, lights);
    renderer.isRendering = false;
  }
}

function calculatePositions() {
  const light3dPositions = lights.map(({ position: { x, y, z }, color }) => {
    const lightRespectToCamera = mat4Mult([[x, y, z, 1]], matrices.view);
    return {
      position: {
        x: lightRespectToCamera[0][0],
        y: lightRespectToCamera[0][1],
        z: lightRespectToCamera[0][2],
      },
      color,
    };
  });
  const lightPositions = light3dPositions.map(({ position: { x, y, z }, color }) => {
    const positionInProyectionPlane = mat4Mult([[x, y, z, 1]], matrices.perspective);
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
  });

  const positions = vertices.map(({ position: { x, y, z }, normal }) => {
    // calculate 3d vertex position
    const vertexMat = [[x, y, z, 1]];
    const positionRespectToSelf = mat4Mult(vertexMat, matrices.world);
    const positionRespectToCamera = mat4Mult(positionRespectToSelf, matrices.view);
    // calculate 2d vertex proyection
    const positionInProyectionPlane = mat4Mult(positionRespectToCamera, matrices.perspective);
    const positionInCanvas = mapTo2d(positionInProyectionPlane[0]);
    // apply rotations to normal
    const [[nx, ny, nz]] = mat4Mult([[normal.x, normal.y, normal.z, 1]], matrices.world);
    // calculate vertex color
    const color = calculateColor(
      positionRespectToCamera,
      { x: nx, y: ny, z: nz },
      light3dPositions
    );
    return {
      position: positionInCanvas,
      color,
      distance: positionInProyectionPlane[0][2],
    };
  });

  return {
    positions,
    lights: lightPositions,
  };
}

function mapTo2d(position) {
  const zoom = canvas.width / 4;
  return {
    x: (position[0] / Math.abs(position[2])) * zoom + canvas.width / 2,
    y: (position[1] / Math.abs(position[2])) * zoom * -1 + canvas.height / 2,
  };
}

function calculateColor(positionMat, normal, light3dPositions) {
  const position = {
    x: positionMat[0][0],
    y: positionMat[0][1],
    z: positionMat[0][2],
  };
  const toCamera = distance(position, camera);
  const ambientLight = calculateAmbientLight();
  const cumulativeColor = light3dPositions.reduce(
    (acc, cur) => {
      const toLight = distance(position, cur.position);
      const diffuseFactor = dot(normalize(toLight), normalize(normal));
      const reflection = distance(
        toLight,
        scalarMult(normal, 2 * dot(normalize(normal), normalize(toLight)))
      );
      const specularFactor = Math.pow(
        dot(normalize(reflection), normalize(toCamera)),
        material.shininess
      );
      const isFacingLight = diffuseFactor > 0;
      if (isFacingLight) {
        return {
          red:
            acc.red +
            cur.color.red *
              (material.diffuse.red * diffuseFactor + material.specular.red * specularFactor),
          green:
            acc.green +
            cur.color.green *
              (material.diffuse.green * diffuseFactor + material.specular.green * specularFactor),
          blue:
            acc.blue +
            cur.color.blue *
              (material.diffuse.blue * diffuseFactor + material.specular.blue * specularFactor),
        };
      } else {
        return acc;
      }
    },
    {
      red: ambientLight.red * material.ambient.red,
      green: ambientLight.green * material.ambient.green,
      blue: ambientLight.blue * material.ambient.blue,
    }
  );
  const color = {
    red: cumulativeColor.red * (1.0 / lights.length) * 255,
    green: cumulativeColor.green * (1.0 / lights.length) * 255,
    blue: cumulativeColor.blue * (1.0 / lights.length) * 255,
  };
  return color;
}

function calculateAmbientLight() {
  const sumLights = lights.reduce(
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
    red: sumLights.red * (1.0 / lights.length),
    green: sumLights.green * (1.0 / lights.length),
    blue: sumLights.blue * (1.0 / lights.length),
  };
}

function normalize(v) {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return {
    x: v.x * (1.0 / magnitude),
    y: v.y * (1.0 / magnitude),
    z: v.z * (1.0 / magnitude),
  };
}

function distance(a, b) {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z,
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function scalarMult(v, s) {
  return {
    x: v.x * s,
    y: v.y * s,
    z: v.z * s,
  };
}

function draw(positions, lights) {
  drawFlatShading(positions, lights);
  // drawPhong(positions, lights);
}

function drawFlatShading(positions, lights) {
  console.log('draw Flat Shading');
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const light of lights) {
    context.fillStyle = colorCode(light);
    context.beginPath();
    context.arc(light.position.x, light.position.y, 300 / (light.distance + 5), 0, 2 * Math.PI);
    context.fill();
  }
  const measuredIndices = indices.map((i) => {
    const i0 = positions[i[0] - 1];
    const i1 = positions[i[1] - 1];
    const i2 = positions[i[2] - 1];
    const distance = i0.distance + i1.distance + i2.distance;
    return [...i, distance];
  });
  const sortedIndices = measuredIndices.sort((a, b) => {
    return b[3] - a[3];
  });
  for (const index of sortedIndices) {
    const v0 = positions[index[0] - 1];
    const v1 = positions[index[1] - 1];
    const v2 = positions[index[2] - 1];
    const averageColor = {
      red: (v0.color.red + v1.color.red + v2.color.red) * 0.333,
      green: (v0.color.green + v1.color.green + v2.color.green) * 0.333,
      blue: (v0.color.blue + v1.color.blue + v2.color.blue) * 0.333,
    };
    const color = colorCode({ color: averageColor });
    // draw
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(v0.position.x, v0.position.y);
    context.lineTo(v1.position.x, v1.position.y);
    context.lineTo(v2.position.x, v2.position.y);
    context.closePath();
    context.fill();
    context.stroke();
  }
}

function drawPhong(positions, lights) {
  console.log('draw Phong');
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const light of lights) {
    context.fillStyle = colorCode(light);
    context.beginPath();
    context.arc(light.position.x, light.position.y, Math.abs(10 / light.distance), 0, 2 * Math.PI);
    context.fill();
  }
  for (const index of indices) {
    const v0 = positions[index[0] - 1];
    const v1 = positions[index[1] - 1];
    const v2 = positions[index[2] - 1];
    // draw lines
    drawLine(v0, v1);
    drawLine(v1, v2);
    drawLine(v2, v0);
  }
}

function drawLine(a, b) {
  context.strokeStyle = createGradient(a, b);
  context.beginPath();
  context.moveTo(a.position.x, a.position.y);
  context.lineTo(b.position.x, b.position.y);
  context.stroke();
}

function createGradient(a, b) {
  const gradient = context.createLinearGradient(
    a.position.x,
    a.position.y,
    b.position.x,
    b.position.y
  );
  gradient.addColorStop(0, colorCode(a));
  gradient.addColorStop(1, colorCode(b));
  return gradient;
}

function colorCode({ color }) {
  return `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`;
}

// -----------------------------------------------------------------------
// Key presses -----------------------------------------------------------
// -----------------------------------------------------------------------

function setKeyPressListeners() {
  window.addEventListener('keydown', function (e) {
    if (!e.repeat) {
      clearInterval(keypress.intervals[e.key]);
      keypress.intervals[e.key] = setInterval(function () {
        onKeyPress(e);
      }, keypress.delay);
    }
  });
  window.addEventListener('keyup', function (e) {
    clearInterval(keypress.intervals[e.key]);
  });
}

function onKeyPress(e) {
  switch (e.key) {
    case 'w':
      doRotateX(-keypress.speed);
      break;
    case 's':
      doRotateX(keypress.speed);
      break;
    case 'a':
      doRotateY(keypress.speed);
      break;
    case 'd':
      doRotateY(-keypress.speed);
      break;
    case 'q':
      doRotateZ(keypress.speed);
      break;
    case 'e':
      doRotateZ(-keypress.speed);
      break;
    case 'ArrowUp':
      doTranslateY(keypress.speed * 2);
      break;
    case 'ArrowDown':
      doTranslateY(-keypress.speed * 2);
      break;
    case 'ArrowLeft':
      doTranslateX(-keypress.speed * 2);
      break;
    case 'ArrowRight':
      doTranslateX(keypress.speed * 2);
      break;
    case 'i':
      doScale(1 + keypress.speed);
      break;
    case 'o':
      doScale(1 - keypress.speed);
      break;
    default:
      clearInterval(keypress.intervals[e.key]);
  }
  render();
}

function doRotateX(speed) {
  matrices.world = mat4Mult(matrices.world, rotateX(speed));
}

function doRotateY(speed) {
  matrices.world = mat4Mult(matrices.world, rotateY(speed));
}

function doRotateZ(speed) {
  matrices.world = mat4Mult(matrices.world, rotateZ(speed));
}

function doTranslateX(speed) {
  matrices.view = mat4Mult(matrices.view, translate(speed, 0, 0));
}

function doTranslateY(speed) {
  matrices.view = mat4Mult(matrices.view, translate(0, speed, 0));
}

function doScale(speed) {
  matrices.world = mat4Mult(matrices.world, scale(speed, speed, speed));
}

// -----------------------------------------------------------------------
// Assignment functions --------------------------------------------------
// -----------------------------------------------------------------------

function mat4Mult(a, b) {
  if (a?.[0]?.length !== b?.length) {
    console.log(a, b);
    throw new Error('This matrices cannot be multiplied');
  }
  const matrix = [];
  for (let i = 0; i < a.length; i++) {
    const row = [];
    for (let j = 0; j < b[0].length; j++) {
      let accomulator = 0;
      for (let k = 0; k < b.length; k++) {
        accomulator += a[i][k] * b[k][j];
      }
      row.push(accomulator);
    }
    matrix.push(row);
  }
  return matrix;
}

function rotateX(alpha) {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [1, 0, 0, 0],
    [0, cos, sin, 0],
    [0, -sin, cos, 0],
    [0, 0, 0, 1],
  ];
}

function rotateY(alpha) {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
}

function rotateZ(alpha) {
  const sin = Math.sin(alpha);
  const cos = Math.cos(alpha);
  return [
    [cos, sin, 0, 0],
    [-sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}
function translate(dx, dy, dz) {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [dx, dy, dz, 1],
  ];
}

function scale(sx, sy, sz) {
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

function perspective(fov, near, far) {
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

function identity() {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

function view(px, py, pz) {
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

function setupFileInput() {
  const fileInput = document.getElementById('obj-file');
  fileInput.onchange = function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile.name.match(/.?\.obj/) === null) {
      alert('This file type is not supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      parseObjFile(reader.result);
    };
    reader.onerror = function () {
      console.error(reader.error);
      alert('Error reading file');
    };
    reader.readAsText(selectedFile);
  };
}

function parseObjFile(file) {
  var newMaterial = {};
  const newVertices = [];
  const newIndices = [];
  const newLights = [];
  // parse file
  const rows = file.split('\n');
  for (const row of rows) {
    const columns = row.split(' ');
    if (columns.length) {
      const rowType = columns[0].toUpperCase();
      const values = columns.slice(1).map((v) => parseFloat(v));
      switch (rowType) {
        case 'M':
          newMaterial = {
            ambient: { red: values[0], green: values[1], blue: values[2] },
            diffuse: { red: values[3], green: values[4], blue: values[5] },
            specular: { red: values[6], green: values[7], blue: values[8] },
            shininess: values[9],
          };
          break;
        case 'V':
          newVertices.push({
            position: { x: values[0], y: values[1], z: values[2] },
            normal: { x: values[3], y: values[4], z: values[5] },
          });
          break;
        case 'F':
          newIndices.push(values);
          break;
        case 'L':
          newLights.push({
            position: { x: values[0], y: values[1], z: values[2] },
            color: { red: values[3], green: values[4], blue: values[5] },
          });
          break;
      }
    }
  }
  // center object
  const offsetTotal = newVertices.reduce(
    (acc, cur) => {
      return {
        x: acc.x + cur.position.x,
        y: acc.y + cur.position.y,
        z: acc.z + cur.position.z,
      };
    },
    { x: 0, y: 0, z: 0 }
  );
  const offsetAverage = {
    x: offsetTotal.x * (1.0 / newVertices.length),
    y: offsetTotal.y * (1.0 / newVertices.length),
    z: offsetTotal.z * (1.0 / newVertices.length),
  };
  const centeredVertices = newVertices.map((v) => {
    return {
      position: {
        x: v.position.x - offsetAverage.x,
        y: v.position.y - offsetAverage.y,
        z: v.position.z - offsetAverage.z,
      },
      normal: v.normal,
    };
  });
  const centeredLights = newLights.map((l) => {
    return {
      position: {
        x: l.position.x - offsetAverage.x,
        y: l.position.y - offsetAverage.y,
        z: l.position.z - offsetAverage.z,
      },
      color: l.color,
    };
  });
  // store values
  material = newMaterial;
  vertices = centeredVertices;
  indices = newIndices;
  lights = centeredLights;
  render();
}

// -----------------------------------------------------------------------
// Initialization --------------------------------------------------------
// -----------------------------------------------------------------------

function init() {
  setupMatrices();
  setupFileInput();
  setKeyPressListeners();
  setupCanvas();
  loadCube();
}

async function loadCube() {
  const response = await fetch('./obj/lightedCube.obj');
  const file = await response.text();
  parseObjFile(file);
}

window.addEventListener('load', init);
// })();
