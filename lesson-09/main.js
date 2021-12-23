import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './style.css'

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
const geometry = new THREE.BufferGeometry()

const count = 500 * 3 * 3
const positions = new Float32Array(count)

for(let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 4
}

const positionsAttribute = new THREE.Float32BufferAttribute(positions, 3)

geometry.setAttribute('position', positionsAttribute)



const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
)
scene.add(mesh)


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