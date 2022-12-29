import * as THREE from "three";

let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;
let renderer: THREE.Renderer | undefined;

export function setSize(width: number, height: number) {
  renderer?.setSize(width, height);

  if (camera) {
    camera.aspect = width / height;

    camera.updateProjectionMatrix();
  }
}

export function setup(): HTMLCanvasElement {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();

  camera.position.z = 5;

  return renderer.domElement;
}

export function render() {
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

export function add(...args: Parameters<THREE.Scene["add"]>) {
  scene?.add(...args);
}

export function getCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  return cube;
}

export function destroy() {
  scene = undefined;
  camera = undefined;
  renderer = undefined;
}
