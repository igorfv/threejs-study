import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

import './style.css'
import { DirectionalLightHelper } from 'three'


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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Objects
const material = new THREE.MeshStandardMaterial({ roughness: 0.4 })

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material)
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 64, 128), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10, 10), material)

scene.add(sphere, cube, torus, plane)

sphere.position.x = -3
torus.position.x = 3
plane.rotation.x = -Math.PI / 2
plane.position.y = -2

sphere.castShadow = true
cube.castShadow = true
torus.castShadow = true
plane.receiveShadow = true


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.2)
directionalLight.position.set(6, 4, 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width *= 2
directionalLight.shadow.mapSize.height *= 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 3
directionalLight.shadow.camera.bottom = -4
directionalLight.shadow.camera.left = -4
// directionalLight.shadow.radius = 20
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

const spotLight = new THREE.SpotLight(0xffffff, 0.5, 10, 2)
spotLight.position.set(0, 3, 2)
spotLight.castShadow = true
spotLight.shadow.mapSize.width *= 4
spotLight.shadow.mapSize.height *= 4
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 15
spotLight.shadow.camera.fov = 30
scene.add(spotLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(-2, 3, 2)
pointLight.castShadow = true
spotLight.shadow.mapSize.width *= 4
spotLight.shadow.mapSize.height *= 4
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 15
scene.add(pointLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(directionalLightCameraHelper)


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

  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  requestAnimationFrame(tick)

  controls.update()
  renderer.render(scene, camera)
}

requestAnimationFrame(tick)