import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

import './style.css'

import mapSource from './textures/door/color.jpg'
import alphaSource from './textures/door/alpha.jpg'
import bumpSource from './textures/door/height.jpg'
import normalSource from './textures/door/normal.jpg'
import occlusionSource from './textures/door/ambientOcclusion.jpg'
import metalnessSource from './textures/door/metalness.jpg'
import roughnessSource from './textures/door/roughness.jpg'
import matcapSource from './textures/matcaps/1.png'
import gradientSource from './textures/gradients/5.jpg'

import nx from './textures/environmentMaps/2/nx.jpg'
import ny from './textures/environmentMaps/2/ny.jpg'
import nz from './textures/environmentMaps/2/nz.jpg'
import px from './textures/environmentMaps/2/px.jpg'
import py from './textures/environmentMaps/2/py.jpg'
import pz from './textures/environmentMaps/2/pz.jpg'

/* HDRIs
- https://polyhaven.com/
- https://matheowis.github.io/HDRI-to-CubeMap/
*/

const gui = new GUI()

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
const matcap = textureLoader.load(matcapSource)
const gradient = textureLoader.load(gradientSource)

gradient.minFilter = THREE.NearestFilter
gradient.magFilter = THREE.NearestFilter
gradient.generateMipmaps = false

normal.minFilter = THREE.NearestFilter
normal.magFilter = THREE.NearestFilter
gradient.generateMipmaps = false

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const envMap = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

// Objects

// const material = new THREE.MeshBasicMaterial()
// material.map = color
// material.alphaMap = alpha
// material.transparent = true
// // material.wireframe = true
// // material.color = new THREE.Color(0x00ff00)
// // material.opacity = 0.5
// // material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// // material.wireframe = true
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcap
// // Matcap textures https://github.com/nidorx/matcaps

// const material = new THREE.MeshDepthMaterial()

// Adding light for the next materials
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradient

const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0
// material.map = color
// material.aoMap = occlusion
// material.aoMapIntensity = 0.5
// material.displacementMap = bump
// material.displacementScale = 0.05
// material.metalnessMap = metalness
// material.roughnessMap = roughness
// material.normalMap = normal
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = alpha
// material.transparent = true
material.envMap = envMap

gui.add(material, 'metalness', 0, 1)
gui.add(material, 'roughness', 0, 1)
// gui.add(material, 'aoMapIntensity', 0, 10)
// gui.add(material, 'displacementScale', 0, 1)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 128, 128), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 64, 128), material)

// For Ambient Occlusion
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

sphere.position.x = -3
torus.position.x = 3

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

  // sphere.rotation.y = 0.1 * elapsedTime
  // plane.rotation.y = 0.1 * elapsedTime
  // torus.rotation.y = 0.1 * elapsedTime

  // sphere.rotation.x = 0.15 * elapsedTime
  // plane.rotation.x = 0.15 * elapsedTime
  // torus.rotation.x = 0.15 * elapsedTime

  requestAnimationFrame(tick)

  controls.update()
  renderer.render(scene, camera)
}

requestAnimationFrame(tick)