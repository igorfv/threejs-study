import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import './style.css'

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Materials
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const light = new THREE.PointLight(0xffffff, 0.1);
light.position.set(2, 3, 4)
scene.add(light);

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Main loop
const clock = new THREE.Clock();

const tick = () => {
  const elapsed = clock.getElapsedTime();

  mesh.rotation.x = 0.5 * elapsed;
  mesh.rotation.y = 0.2 * elapsed;
  mesh.rotation.z = 0.6 * elapsed;

  controls.update();

  // Update
  renderer.render(scene, camera);

  // Call next frame
  requestAnimationFrame(tick);
}

tick()