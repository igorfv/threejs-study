import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import GUI from 'lil-gui'

import './style.css'


function placeObjectOnPlanet(object, lat, lon, radius) {
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    object.position.set(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius
    );
    object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
}


const gui = new GUI()

const scene = new THREE.Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 40)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Loader
const loader = new THREE.TextureLoader()
const fontLoader = new FontLoader()

const worldTexture =  loader.load('/earth_latlon.jpg')

// Objects
const worldMaterial = new THREE.MeshPhongMaterial({ map: worldTexture, color: 0xff0033 })
const worldRadius = 10


const globe = new THREE.Mesh(new THREE.SphereGeometry(worldRadius, 64, 64), worldMaterial)
scene.add(globe)


const pointHeight = 2
const pointGeometry = new THREE.BoxGeometry(0.1, pointHeight, 0.1)
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x55dd33 })

const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })


const cities = [
  { name: 'London', lat: 51.509865, lon: -0.118092 },
  { name: 'Sao Paulo', lat: -23.533773, lon: -46.625290 },
  { name: 'Los Angeles', lat: 34.052235, lon: -118.243683 },
  { name: 'Toronto', lat: 43.651070, lon: -79.347015 },
  { name: 'Bogota', lat: 4.624335, lon: -74.063644 },
  { name: 'Cairo', lat: 30.033333, lon: 31.233334 },
  { name: 'Cape Town', lat: -33.918861, lon: 18.423300 },
  { name: 'Lagos', lat: 6.465422, lon: 3.406448 },
  { name: 'Sidney', lat: -33.865143, lon: 151.209900 },
  { name: 'Port Moresby', lat: -9.44314, lon: 147.17972 },
  { name: 'Tokio', lat: 35.652832, lon: 139.839478 },
  { name: 'Dhaka', lat: 23.777176, lon: 90.399452 },
  { name: 'Brockton', lat: -80.033333, lon: -178.7 },
]

const citiesDuples = []

fontLoader.load('/helvetiker_regular.typeface.json', (font) => {

  cities.forEach(city => {
    const { name, lat, lon } = city

    const point = new THREE.Mesh(pointGeometry, pointMaterial)
    scene.add(point)
    placeObjectOnPlanet(point, lat, lon, worldRadius)

    const textGeometry = new TextGeometry(name, {
      font,
      size: 0.5,
      height: 0.01,
      curveSegments: 6,
      bevelEnabled: false,
    })

    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(textMesh)
    // textGeometry.center()
    placeObjectOnPlanet(textMesh, lat, lon, worldRadius + pointHeight)

    citiesDuples.push([point, textMesh])
  })
})


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// const hemisphereLight = new THREE.HemisphereLight(0xff00ff, 0xff0000, 0.7)
// scene.add(hemisphereLight)



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

  citiesDuples.forEach(([_point, textMesh]) => {
    // textMesh.lookAt(camera.position)
    textMesh.quaternion.copy(camera.quaternion)
  })

  controls.update()
  renderer.render(scene, camera)
}

requestAnimationFrame(tick)