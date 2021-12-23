import * as THREE from 'three'
import './style.css'

const scene = new THREE.Scene()

const cube = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

const mesh = new THREE.Mesh(cube, material)
scene.add(mesh)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)


// Transform
mesh.scale.set(2, 0.5, 0.5)

mesh.rotation.reorder('YXZ')
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0)

mesh.position.set(0.7, -1, 1)

// Axes Helper
const helper = new THREE.AxesHelper(0.5)
scene.add(helper)

// Look at
camera.lookAt(mesh.position)


renderer.render(scene, camera)