import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Plane } from "three";

// creating a scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color('whitesmoke');

// // adding a 3d helmet model to the scene
// const loader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
// loader.setDRACOLoader(dracoLoader);
// // Load a glTF resource
// loader.load(
//   // resource URL
//   "/models/gltf/DamagedHelmet.gltf",
//   // called when the resource is loaded
//   function (gltf) {
//     console.log(gltf.scene);
//     gltf.scene.scale.set(5, 5, 5);
//     gltf.scene.position.x = 0; //Position (x = right+ left-)
//     gltf.scene.position.y = 0; //Position (y = up+, down-)
//     gltf.scene.position.z = 0;
//     scene.add(gltf.scene);
//   },
//   // called while loading is progressing
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// );

// creating a sphere with geometry
const geometry = new THREE.SphereGeometry( 25, 64, 32 );

const material = new THREE.MeshStandardMaterial( { color: '#00ff83',wireframe:true } );
const mesh = new THREE.Mesh( geometry, material );
mesh.position.set(0,100,0);
scene.add(mesh);


// size of the viewport
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// create light (it is needed for viewing the shapes)
const light = new THREE.AmbientLight(0xffffff, 1, 1000);
light.position.set(0, 0, 0);
scene.add(light);

const light1 = new THREE.DirectionalLight(0xffffff, 1, 1000);
light1.position.set(10, 10, 0);
scene.add(light1);


// const light2 = new THREE.DirectionalLight(0xffffff, 1, 1000);
// light2.position.set(-10, 10, 0);
// scene.add(light2);

// const light3 = new THREE.DirectionalLight(0xffffff, 1, 1000);
// light3.position.set(0, -10, -2);
// scene.add(light3);

// adding a camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  1000
);
// change the camera position
camera.position.set(-200, 5, 30);
scene.add(camera);

 
// locating and catching the canvas on the index.html
const canvas = document.querySelector(".webgl");
// adding a worlder
const renderer = new THREE.WebGLRenderer({ canvas,antialias: true,alpha:true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// changing the background
new RGBELoader().load("/models/gltf/hilly_terrain_01_4k.hdr",function(texture){
  texture.mapping=THREE.EquirectangularReflectionMapping;
  scene.background=texture;
  scene.environment=texture;
});

// adding a heightmap
const planeGeometry = new THREE.PlaneGeometry(700,450,5400,2700);
const material1 = new THREE.MeshPhongMaterial();
let texture = new THREE.TextureLoader().load("/models/gltf/worldColour.jpg");
material1.map=texture;
material.wireframe=true;
const displacementMap = new THREE.TextureLoader().load("/models/gltf/gebco_bathy.jpg");
material1.displacementMap = displacementMap
material1.displacementScale = 15;   
const plane1=new THREE.Mesh(planeGeometry, material1)
plane1.rotation.x = -Math.PI * 0.5;
plane1.position.y = 0.0;
plane1.rotation.z = 0.15;
// plane.lookAt(new THREE.Vector3(1, 7, 2));
plane1.position.set(0,0,0);
scene.add(plane1)


// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 5;
controls.dampingFactor=0.5;
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}
// resize the scene accordingly to the window dimensions
window.addEventListener("resize", () => {
  // update the canvas size to the window size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update the camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// timeline magic
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale,{z:0,x:0,y:0},{z:1,x:1,y:1})

// mouse animation and color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));