import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import golfNormalUrl from './golfball_normal.jpg'

import './style.css'

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(7, 128, 128);

// Materials
const textureLoader = new THREE.TextureLoader()
const golfNormal = textureLoader.load(golfNormalUrl)

const material = new THREE.MeshStandardMaterial({
  color: 0x334488,
  metalness: 0.5,
  roughness: 0.1,
  normalMap: golfNormal,
})

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const light = new THREE.PointLight(0x9999ff, 3);
light.position.set(10, 10, 10)
scene.add(light);

const light2 = new THREE.PointLight(0xff0000, 6);
light2.position.set(-10, 8, 15)
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 20);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
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

  mesh.rotation.x = 0.2 * elapsed;
  mesh.rotation.y = 0.1 * elapsed;
  mesh.rotation.z = 0.3 * elapsed;

  controls.update();

  // Update
  renderer.render(scene, camera);

  // Call next frame
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);