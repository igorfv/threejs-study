import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'
import gsap from 'gsap'

import './style.css'

/* GUIs
- https://github.com/dataarts/dat.gui
- https://lil-gui.georgealways.com/
- https://github.com/freeman-lab/control-panel
- https://github.com/automat/controlkit.js
- https://github.com/lo-th/uil
- https://cocopon.github.io/tweakpane/
- https://github.com/colejd/guify
- https://github.com/wearekuva/oui
*/

const gui = new GUI();


const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 10)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Objects
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)
scene.add(mesh)

// Debug the cube
const params = {
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + Math.PI / 2,
      duration: 0.5,
    })
  }
}

const cubeGui = gui.addFolder('Cube')

cubeGui.add(mesh.position, 'x').min(-3).max(3).step(0.1)
cubeGui.add(mesh.position, 'y').min(-3).max(3).step(0.1)
cubeGui.add(mesh.position, 'z').min(-3).max(3).step(0.1)

cubeGui.add(mesh, 'visible')
cubeGui.add(mesh.material, 'wireframe')

cubeGui.addColor(mesh.material, 'color')
  .onChange((color) => {
    mesh.material.color.set(color)
  })

  cubeGui.add(params, 'spin')


// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Fullscreen
window.addEventListener('dblclick', () => {
  const fullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
  const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
  const requestFullscreen = canvas.requestFullscreen || canvas.webkitRequestFullscreen || canvas.mozRequestFullScreen || canvas.msRequestFullscreen

  if (fullscreen) {
    exitFullscreen.apply(document)
  } else {
    requestFullscreen.apply(canvas)
  }
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Animation
const clock = new THREE.Clock()

const tick = (time) => {
  const elapsedTime = clock.getElapsedTime()

  requestAnimationFrame(tick)

  controls.update()
  renderer.render(scene, camera)
}

requestAnimationFrame(tick)