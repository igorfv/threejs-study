import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './style.css'
import mapSource from './textures/minecraft.png'
import alphaSource from './textures/door/alpha.jpg'
import bumpSource from './textures/door/height.jpg'
import normalSource from './textures/door/normal.jpg'
import occlusionSource from './textures/door/ambientOcclusion.jpg'
import metalnessSource from './textures/door/metalness.jpg'
import roughnessSource from './textures/door/roughness.jpg'



const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Load
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (image, itemsLoaded, itemsTotal) => console.log('starting', image, `${itemsLoaded} of ${itemsTotal}`)
loadingManager.onProgress = ( url, itemsLoaded, itemsTotal ) => console.log( 'starting', url, `${itemsLoaded} of ${itemsTotal}`)
loadingManager.onLoad = () => console.log( 'Loading complete!')
loadingManager.onError = ( url ) => console.log( 'Error', url)

const textureLoader = new THREE.TextureLoader(loadingManager)
const color = textureLoader.load(mapSource)
const alpha = textureLoader.load(alphaSource)
const bump = textureLoader.load(bumpSource)
const normal = textureLoader.load(normalSource)
const occlusion = textureLoader.load(occlusionSource)
const metalness = textureLoader.load(metalnessSource)
const roughness = textureLoader.load(roughnessSource)

// Filter
color.generateMipmaps = false // Not necessary when using minFilter Nearest
color.minFilter = THREE.NearestFilter
color.magFilter = THREE.NearestFilter

// Objects
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: color }),
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