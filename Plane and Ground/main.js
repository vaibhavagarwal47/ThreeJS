import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


// Canvas
const canvas = document.querySelector('canvas.webgl') //TODO: should this be included in the snippe

// Scene
const scene = new THREE.Scene()


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
cubeRenderTarget.texture.type = THREE.HalfFloatType;

var cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );


// Objects
const geometry = new THREE.BoxGeometry( 1,1,1 );

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0x0ffff0)

// Mesh
const box = new THREE.Mesh(geometry,material)
scene.add(box)

// Lights

const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(1,1,1)
scene.add(light)


/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0,0,4);
scene.add(camera)




const gui = new dat.GUI()
const positionFolder = gui.addFolder('positions')
positionFolder.add (box.position, 'x', -10, 10, 0.1)
positionFolder.add (box.position, 'y', -10, 10, 0.1)
positionFolder.add (box.position, 'z', -10, 10, 0.1)
// positionFolder.add (box.widthSegments, 'widthSegments', 1, 100)
positionFolder.open ();
const miscFolder = gui.addFolder('misc');
miscFolder.add(material, 'wireframe').onChange(setValue());
miscFolder.open();
const cameraFolder = gui.addFolder('camera');
cameraFolder.add(camera.position,'z',-10,10,0.1);
cameraFolder.open();



function setValue() {
  if(material.wireframe===true)
  {
    material.wireframe = false;
  }
  else{
    material.wireframe = true;
  }
}
/**
 * Renderer
 */
material.wireframe = false;
const controls = new OrbitControls( camera, canvas );


const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight)

new RGBELoader().load("./qua.hdr",function(texture){
  texture.mapping=THREE.EquirectangularReflectionMapping;
  scene.environment=texture;
  scene.background=texture;
});


window.addEventListener('resize',(event) => {
  renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})

// scene.add(cubeCamera)
console.dir(scene);
/**
 * Animate
 */
const animate = () =>
{
    // Render
    renderer.render(scene, camera)
    cubeCamera.update( renderer, scene );
    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
    controls.update();
}

animate()
