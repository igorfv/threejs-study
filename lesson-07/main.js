import * as THREE from 'three'

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
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)


// Objects
const group = new THREE.Group()
group.rotation.reorder('YXZ')
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


// Controls
const cursor = {
  x: 0,
  y: 0,
}
 
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})


// Animation
const clock = new THREE.Clock()

const tick = (time) => {
  const elapsedTime = clock.getElapsedTime()

  requestAnimationFrame(tick)
 
  // group.rotation.y = Math.sin(elapsedTime)
  // group.rotation.x = Math.cos(elapsedTime)

  camera.position.x = Math.sin((cursor.x - 0.5) * Math.PI * 2) * 10
  camera.position.z = Math.cos((cursor.x - 0.5) * Math.PI * 2) * 10
  camera.position.y = cursor.y * 10

  camera.lookAt(group.position)

  renderer.render(scene, camera)
}

requestAnimationFrame(tick)