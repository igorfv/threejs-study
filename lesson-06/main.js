import * as THREE from 'three'
import './style.css'

const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)


// Objects
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
)

group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
)

cube2.position.x = -2

group.add(cube2)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
)

cube3.position.x = 2

group.add(cube3)

// Transformation
group.scale.y = 2

// Axes Helper
// const helper = new THREE.AxesHelper(0.5)
// scene.add(helper)

// Look at
camera.lookAt(group.position)


// Animation
const clock = new THREE.Clock()

const tick = (time) => {
  const deltaTime = clock.getElapsedTime()

  requestAnimationFrame(tick)
 
  group.rotation.y = Math.sin(deltaTime)
  group.rotation.x = Math.cos(deltaTime)

  renderer.render(scene, camera)
}

requestAnimationFrame(tick)