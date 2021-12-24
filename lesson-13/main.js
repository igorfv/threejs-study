import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import './style.css'

// const gui = new GUI()

const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 14)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Geometries
const fontLoader = new FontLoader()

const material = new THREE.MeshNormalMaterial()

const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 20, 45)

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(
    donutGeometry,
    material,
  )

  do {
    donut.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30,
    )
  } while (donut.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 5)

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const scale = (Math.random() - 0.2) * 3
  donut.scale.set(scale, scale, scale)

  scene.add(donut)
}

const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(
    boxGeometry,
    material,
  )

  do {
    donut.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30,
    )
  } while (donut.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 5)

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const scale = (Math.random() - 0.2) * 3
  donut.scale.set(scale, scale, scale)

  scene.add(donut)
}

let mesh

fontLoader.load('/helvetiker_bold.typeface.json', (font) => {
  const text = new TextGeometry("this is\nactually\ncool", {
    font,
    size: 1,
    height: 0.4,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 5,
    bevelOffset: 0,
  })

  mesh = new THREE.Mesh(text, material)
  scene.add(mesh)

  // text.computeBoundingBox()
  // text.translate(
  //   - (text.boundingBox.max.x - 0.04) / 2,
  //   - (text.boundingBox.max.y - 0.04) / 2,
  //   - (text.boundingBox.max.z - 0.04) / 2,
  // )

  text.center()
})

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

  if (mesh) {
    mesh.rotation.y = elapsedTime * 0.5
  }

  requestAnimationFrame(tick)

  controls.update()
  renderer.render(scene, camera)
}

requestAnimationFrame(tick)