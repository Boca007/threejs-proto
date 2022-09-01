import "./style.css";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { addContent, addStar } from "./localhelper.js";
import { Composer } from "./composer.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import TWEEN from '@tweenjs/tween.js'

let camera, composer, renderer, capturer;
let scene
let image01Mesh

const rad = Math.PI / 180;

const speed = 500;
const animType = TWEEN.Easing.Quartic.InOut;
const animType2 = TWEEN.Easing.Quadratic.InOut;


const nullObject = new THREE.PlaneGeometry(0, 0)
var nullMesh = new THREE.Mesh(nullObject)



const textureImage01 = new THREE.TextureLoader().load("maps/image-01.jpg");
const textureImage02 = new THREE.TextureLoader().load("maps/image-02.jpg");
const textureImage03 = new THREE.TextureLoader().load("maps/image-03.jpg");
const textureImage04 = new THREE.TextureLoader().load("maps/image-04.jpg");
const textureImage05 = new THREE.TextureLoader().load("maps/image-05.jpg");
const textureImage06 = new THREE.TextureLoader().load("maps/image-06.jpg");


init();
render();


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');


    // camera definition.
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.z = cameraPosZ - cameraPosDistance;

    camera.position.z = 15;
    // camera.position.x = 15;
    // camera.position.y = 35;



    addPlane(-120, textureImage01)
    addPlane(-60, textureImage02)
    addPlane(0, textureImage03)
    addPlane(60, textureImage04)
    addPlane(120, textureImage05)


    scene.add(nullMesh)




    // rendered core
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    // renderer.setClearAlpha(0)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.autoClearColor = true;
    document.body.appendChild(renderer.domElement);






    // light definition
    // const pointLight = new THREE.PointLight(0xffffff);
    // pointLight.position.set(6, 6, 6);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // if we want to controll the rotation for testing.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.keys = {
        LEFT: "ArrowLeft", //left arrow
        UP: "ArrowUp", // up arrow
        RIGHT: "ArrowRight", // right arrow
        BOTTOM: "ArrowDown", // down arrow
    };
    controls.update();
    controls.listenToKeyEvents(window);


    window.addEventListener("resize", onWindowResize);
    document.addEventListener("keydown", onDocumentKeyDown, false);


}

function render() {
    requestAnimationFrame(render);

    const time = performance.now() * 0.001 + 6000;
    // console.log(time)



    TWEEN.update();

    renderer.render(scene, camera)

}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.composer.setSize(width, height);

    if (width < 1000)
        camera.position.z = ((cameraPosZ - cameraPosDistance) / width) * 1000; w
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {

        console.log('afds')
    }

    if (keyCode == 83) {
        console.log('222')

    }

    if (keyCode == 65) {
        rotate(-60)

    }

    if (keyCode == 68) {

        rotate(60)
    }


    if (keyCode == 32) {
        console.log("space");
    }



}




function rotate(degree) {
    new TWEEN.Tween(nullMesh.rotation).to({ y: nullMesh.rotation.y + degree * rad }, speed).easing(animType).start()
    console.log('rotate')
}

function addPlane(degree, texture) {
    // const texture = new THREE.TextureLoader().load("maps/image-01.jpg");
    var image01Plane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var imageMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: texture });
    image01Mesh = new THREE.Mesh(image01Plane, imageMaterial)
    image01Mesh.position.z = -15
    var nullMeshLocal = new THREE.Mesh(nullObject)
    nullMeshLocal.add(image01Mesh)
    nullMeshLocal.rotation.y = degree * rad

    nullMesh.add(nullMeshLocal)
}

