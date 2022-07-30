import "./style.css";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { addContent, addStar } from "./localhelper.js";
import { Composer } from "./composer.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// import { TWEEN } from '../node_modules/@tweenjs/tween.js/dist/tween.cjs.js'

let camera, composer, renderer, capturer;
let scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom;
let sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask;

let lutPass;

var material;
var sideFront, sideBack, sideLeft, sideRight, sideTop, sideBottom;
var sideFrontMask, sideBackMask, sideLeftMask, sideRightMask, sideTopMask, sideBottomMask;
let sideFrontMaskRoot, sideBackMaskRoot, sideLeftMaskRoot, sideRightMaskRoot, sideTopMaskRoot, sideBottomMaskRoot;
let front, back, left, right, top, bottom;
let pointLightFront;

var [cubeRotation, meshPositionXY, meshPositionZ, meshRotationXY, meshRotationZ, meshScale, cameraOrbit] = [true, true, true, true, true, true, false]

const textureImage01 = new THREE.TextureLoader().load("maps/image-01.jpg");
const textureImage02 = new THREE.TextureLoader().load("maps/image-02.jpg");
const textureImage03 = new THREE.TextureLoader().load("maps/image-03.jpg");
const textureImage04 = new THREE.TextureLoader().load("maps/image-04.jpg");
const textureImage05 = new THREE.TextureLoader().load("maps/image-05.jpg");
const textureImage06 = new THREE.TextureLoader().load("maps/image-06.jpg");
const textureImageBG = new THREE.TextureLoader().load("maps/bg_sreg.jpg");
const textureImageBG1 = new THREE.TextureLoader().load("maps/bg_hexgon.jpg");
const textureImageBG2 = new THREE.TextureLoader().load("maps/bg_dune.jpg");
const textureImageBG3 = new THREE.TextureLoader().load("maps/bg_leather.jpg");
const textureImageBG4 = new THREE.TextureLoader().load("maps/bg_gradient.jpg");


const cameraPosZ = 15
const cameraPosDistance = 5;
var componentMeshArray = [];

let componentPosZ = 0.1

const rad = Math.PI / 180;
var boxRotation = 0;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

init();
render();
createPanel();

function init() {
    // cubeRoot= new THREE.Mesh(new THREE.PlaneGeometry(0, 0))

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0.6, 0.6, 0.6);
    // scene.clearColor = new THREE.Color(0, 1, 0);
    // scene.clearAlpha = 1;
    // scene.clear = false;

    // scenes, the real data must be here.
    sceneFront = new THREE.Scene();
    // scene.background = new THREE.Color(0.6, 0.6, 0.6);
    // scene.clearColor = new THREE.Color(0, 1, 0);
    // scene.clearAlpha = 1;
    // scene.clear = false;

    sceneBack = new THREE.Scene();
    sceneLeft = new THREE.Scene();
    sceneRight = new THREE.Scene();
    sceneTop = new THREE.Scene();
    sceneBottom = new THREE.Scene();

    // only the cube side mask mesh should be here. this will mask the whole scene.
    sceneFrontMask = new THREE.Scene();
    sceneBackMask = new THREE.Scene();
    sceneLeftMask = new THREE.Scene();
    sceneRightMask = new THREE.Scene();
    sceneTopMask = new THREE.Scene();
    sceneBottomMask = new THREE.Scene();

    // camera definition.
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = cameraPosZ - cameraPosDistance;

    // camera.position.z = 15;
    // camera.position.x = 15;
    // camera.position.y = 15;

    // content definition for the sides
    // front = addContent(textureImage01)
    front = addContent(textureImageBG4);
    sceneFront.add(front);

    back = addContent(textureImage02);
    back.rotation.y = Math.PI;
    sceneBack.add(back);

    left = addContent(textureImage03);
    left.rotation.y = -Math.PI / 2;
    sceneLeft.add(left);

    right = addContent(textureImage04);
    right.rotation.y = Math.PI / 2;
    sceneRight.add(right);

    top = addContent(textureImage05);
    top.rotation.x = -Math.PI / 2;
    sceneTop.add(top);

    bottom = addContent(textureImage06);
    bottom.rotation.x = Math.PI / 2;
    sceneBottom.add(bottom);

    // rendered core
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    // renderer.setClearAlpha(0)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.autoClearColor = true;
    document.body.appendChild(renderer.domElement);


    //TODO: make it work.
    //capturer part 
    // capturer = null;

    // var sCB = document.getElementById('start-capturing-button'),
    //     dVB = document.getElementById('download-video-button'),
    //     progress = document.getElementById('progress');

    // console.log(sCB)

    // sCB.addEventListener('click', function(e) {

    //     capturer = new CCapture({
    //         verbose: true,
    //         display: true,

    //         framerate: 60,
    //         // motionBlurFrames: 16,
    //         quality: 90,
    //         // format: 'gif',
    //         format: 'png',
    //         // workersPath: '.',
    //         onProgress: function(p) { progress.style.width = (p * 100) + '%' }
    //     });

    //     capturer.start();
    //     this.style.display = 'none';
    //     dVB.style.display = 'block';

    //     // start();

    //     e.preventDefault();
    // }, false);

    // dVB.addEventListener('click', function(e) {
    //     capturer.stop();
    //     this.style.display = 'none';
    //     //this.setAttribute( 'href',  );
    //     capturer.save();
    // }, false);



    sideFrontMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));
    sideBackMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));
    sideLeftMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));
    sideRightMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));
    sideTopMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));
    sideBottomMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0));

    // the cube 6 side mask definition here. if the content side size, pos, change should reflec the changes here too.
    sideFrontMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideFrontMask.position.z = 5;
    sceneFrontMask.add(sideFrontMaskRoot);
    sideFrontMaskRoot.add(sideFrontMask);

    sideBackMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideBackMask.position.z = -5;
    sideBackMask.rotation.y = Math.PI;
    sceneBackMask.add(sideBackMaskRoot);
    sideBackMaskRoot.add(sideBackMask);

    sideLeftMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideLeftMask.position.x = -5;
    sideLeftMask.rotation.y = -Math.PI / 2;
    sceneLeftMask.add(sideLeftMaskRoot);
    sideLeftMaskRoot.add(sideLeftMask);

    sideRightMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideRightMask.position.x = 5;
    sideRightMask.rotation.y = Math.PI / 2;
    sceneRightMask.add(sideRightMaskRoot);
    sideRightMaskRoot.add(sideRightMask);

    sideTopMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideTopMask.position.y = 5;
    sideTopMask.rotation.x = -Math.PI / 2;
    sceneTopMask.add(sideTopMaskRoot);
    sideTopMaskRoot.add(sideTopMask);

    sideBottomMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideBottomMask.position.y = -5;
    sideBottomMask.rotation.x = Math.PI / 2;
    sceneBottomMask.add(sideBottomMaskRoot);
    sideBottomMaskRoot.add(sideBottomMask);



    // thumnail panel generation. create a 4 x 5 grid. 
    const panelSize = 1.5
    const panelSpace = panelSize + 0.2
    const textureImageArray = [textureImage01, textureImage02, textureImage03, textureImage04, textureImage05, textureImage06]
    var componentPlane = new THREE.PlaneGeometry(panelSize, panelSize);

    var diff = 0;
    const allCount = 20

    for (let i = 0; i < allCount; i++) {

        var componentMaterial = new THREE.MeshStandardMaterial({
            color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureImageArray[Math.floor(Math.random() * 5)],
        });

        var componentMesh = new THREE.Mesh(componentPlane, componentMaterial);
        componentMesh.position.z = panelSpace;
        componentMesh.position.x = (Math.round(i / 5 - 0.5) + panelSize / 2) * panelSpace;
        componentMesh.position.y = -(5 * panelSpace) / 2 + i * panelSpace - diff + panelSize / 2;
        componentMesh.position.z = componentPosZ

        componentMeshArray.push(componentMesh);
        front.add(componentMesh);



        if (i > 5 - 2) diff = (5 * panelSpace) * 1;
        if (i > 10 - 2) diff = (5 * panelSpace) * 2;
        if (i > 15 - 2) diff = (5 * panelSpace) * 3;


        if (i > 5 - 1) componentMesh.position.y += panelSpace / 2
        if (i > 10 - 1) componentMesh.position.y -= panelSpace / 2
        if (i > 15 - 1) componentMesh.position.y += panelSpace / 2
        componentMesh.userData = { 'x': componentMesh.position.x, 'y': componentMesh.position.y, 'z': componentMesh.position.z }
    }







    // light definition
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(6, 6, 6);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    sceneFront.add(new THREE.AmbientLight(0xffffff));
    sceneBack.add(new THREE.AmbientLight(0xffffff));
    sceneLeft.add(new THREE.AmbientLight(0xffffff));
    sceneRight.add(new THREE.AmbientLight(0xffffff));
    sceneTop.add(new THREE.AmbientLight(0xffffff));
    sceneBottom.add(new THREE.AmbientLight(0xffffff));

    // const lightHelper = new THREE.PointLightHelper(new THREE.PointLight(0xffffff))
    const gridHelper = new THREE.GridHelper(200, 50);
    // sceneFront.add(gridHelper)

    // 3d star definition.
    addStar(scene);

    pointLightFront = new THREE.PointLight(0xffffff);
    pointLightFront.position.set(110, 110, componentPosZ + 1);
    sceneFront.add(pointLightFront);

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

    composer = new Composer(
        renderer,
        scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom, sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask,
        camera
    );
    composer.init();

    window.addEventListener("resize", onWindowResize);
    document.addEventListener("keydown", onDocumentKeyDown, false);

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    document.addEventListener("mousedown", onMouseDown, false);
}

function animationSide(degree) {
    const speed = 1000;
    const animType = TWEEN.Easing.Quartic.InOut;
    const animType2 = TWEEN.Easing.Quadratic.InOut;

    new TWEEN.Tween(sideFrontMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(front.rotation).to({ y: degree * rad }, speed).easing(animType).start();

    new TWEEN.Tween(sideBackMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(back.rotation).to({ y: (degree - 180) * rad }, speed).easing(animType).start();

    new TWEEN.Tween(sideLeftMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(left.rotation).to({ y: (degree - 90) * rad }, speed).easing(animType).start();

    new TWEEN.Tween(sideRightMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(right.rotation).to({ y: (90 + degree) * rad }, speed).easing(animType).start();

    new TWEEN.Tween(sideTopMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(top.rotation).to({ z: degree * rad }, speed).easing(animType).start();

    new TWEEN.Tween(sideBottomMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start();
    new TWEEN.Tween(bottom.rotation).to({ z: -degree * rad }, speed).easing(animType).start();

    new TWEEN.Tween(camera.position).to({ z: cameraPosZ }, speed / 2).easing(animType2).start()
        .onComplete(() => {
            new TWEEN.Tween(camera.position).to({ z: cameraPosZ - cameraPosDistance }, speed / 2).easing(animType2).start();
        });
}




function render() {
    requestAnimationFrame(render);

    const time = performance.now() * 0.001 + 6000;
    // console.log(time)

    // sideFrontMaskRoot.rotation.y += rad * 1
    // front.rotation.y += rad * 1
    // sideBackMaskRoot.rotation.y += rad * 1
    // back.rotation.y += rad * 1
    // sideLeftMaskRoot.rotation.y += rad * 1
    // left.rotation.y += rad * 1
    // sideRightMaskRoot.rotation.y += rad * 1
    // right.rotation.y += rad * 1
    // sideTopMaskRoot.rotation.y += rad * 1
    // top.rotation.z += rad * 1
    // sideBottomMaskRoot.rotation.y += rad * 1
    // bottom.rotation.z += -rad * 1

    // camera.position.z -= +0.05

    TWEEN.update();

    // renderer.render(scene, camera)
    // renderer.render(sceneFront, camera)
    // renderer.render(sceneBack, camera)
    // renderer.render(sceneLeft, camera)
    // renderer.render(sceneRight, camera)
    // renderer.render(sceneTop, camera)
    // renderer.render(sceneBottom, camera)

    // renderer.clear();
    // renderer.clearDepth();
    composer.render();
    if (capturer) capturer.capture(renderer.domElement);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.composer.setSize(width, height);

    if (width < 1000)
        camera.position.z = ((cameraPosZ - cameraPosDistance) / width) * 1000;
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        animationTop(90)
    } else if (keyCode == 83) {
        animationTop(0)
    } else if (keyCode == 65) {
        boxRotation -= 90;
        animationSide(boxRotation);
    } else if (keyCode == 68) {
        boxRotation += 90;
        animationSide(boxRotation);
    } else if (keyCode == 32) {
        // cube.position.set(0, 0, 0);
        console.log("space");
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (cubeRotation) {
        camera.position.x = -mouse.x / 2
        camera.position.y = -mouse.y / 2
        camera.lookAt(new THREE.Vector3(0, 0, 0))
    } else {
        camera.position.x = 0
        camera.position.y = 0
        camera.lookAt(new THREE.Vector3(0, 0, 0))
    }

    componentMeshArray.forEach((mesh) => {
        // var rotX = (mesh.position.y / 10 - mouse.y) / 5;
        // var rotY = (mesh.position.x / 10 - mouse.x) / 5;

        const meshPos = getMesh2dCoords(mesh)

        const crit = 100
        const angle = 2
        const critRange = 50
        const moveMailtiplyer = 10000

        var posX = mesh.position.x
        var posY = mesh.position.y
        var posZ = componentPosZ

        var rotX = 0
        var rotY = 0
        var rotZ = 0

        var scale = 0

        var critRangeRatioX = 1
        var critRangeRatioY = 1

        // this if is needed otherwise will do the whole X or Y range.
        if ((Math.abs(event.clientX - meshPos.x) < crit + critRange) && (Math.abs(event.clientY - meshPos.y) < crit + critRange)) {

            if (Math.abs(event.clientX - meshPos.x) < crit + critRange) {
                // criteria calculator. if the mouse in the criteria range the critRangeRatio will be the accelerator. 
                // from 0 - 1. 0 is the far position. 1 is inside the cirt range now. 
                critRangeRatioX = 1 - Math.abs(Math.abs(event.clientX - meshPos.x) - crit) / critRange

                // the critRangeRation range should be 0 - 1. avoid the chaotich glitch 
                if (critRangeRatioX > 0 && critRangeRatioX < 1) {
                } else {
                    critRangeRatioX = 1
                }

                // if the mouse inside the crit ....
                if (Math.abs(event.clientX - meshPos.x) < crit) {
                    critRangeRatioX = 1
                }
                rotY = (event.clientX - meshPos.x) / crit * (angle * rad) * critRangeRatioX
                posX = mesh.userData.x + (event.clientX - meshPos.x) / moveMailtiplyer * critRangeRatioX


            }

            if (Math.abs(event.clientY - meshPos.y) < crit + critRange) {
                // criteria calculator. if the mouse in the criteria range the critRangeRatio will be the accelerator. 
                // from 0 - 1. 0 is the far position. 1 is inside the cirt range now. 
                critRangeRatioY = 1 - Math.abs(Math.abs(event.clientY - meshPos.y) - crit) / critRange

                // the critRangeRation range should be 0 - 1. avoid the chaotich glitch 
                if (critRangeRatioY > 0 && critRangeRatioY < 1) {
                } else {
                    critRangeRatioY = 1
                }

                // if the mouse inside the crit ....
                if (Math.abs(event.clientY - meshPos.y) < crit) {
                    critRangeRatioY = 1
                }
                rotX = (event.clientY - meshPos.y) / crit * (angle * rad) * critRangeRatioY
                posY = mesh.userData.y - (event.clientY - meshPos.y) / moveMailtiplyer * critRangeRatioY
            }

            // event.clientY - meshPos.y
            posZ = (componentPosZ + 0.1) - Math.abs(event.clientX - meshPos.x) / 1000
            // scale = 

        } else {
            posX = mesh.userData.x
            posY = mesh.userData.y
        }

        if (meshPositionXY) {
            mesh.position.x = posX
            mesh.position.y = posY
        }

        if (meshPositionZ) {
            mesh.position.z = posZ
        }

        if (meshRotationXY) {
            mesh.rotation.x = rotX
            mesh.rotation.y = rotY
        }

        if (meshRotationZ) {
            mesh.rotation.z = (rotX + rotY) / 2 / 5
        }

        if (meshScale) {
            mesh.scale.x = 1 + (rotX + rotY) / 2
            mesh.scale.y = 1 + (rotX + rotY) / 2
        }


    });

    pointLightFront.position.x = mouse.x * 5.5;
    pointLightFront.position.y = mouse.y * 5.5;
}

function onMouseDown(event) {
    console.log("mouse position: (" + mouse.x + ", " + mouse.y + ")");
}

function manageRaycasterIntersections(scene, camera) {
    camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) { } else { }
}

function getMesh2dCoords(mesh) {

    var vector = new THREE.Vector3();
    var canvas = renderer.domElement;

    vector.set(mesh.position.x, mesh.position.y, mesh.position.z);

    // map to normalized device coordinate (NDC) space
    vector.project(camera);

    // map to 2D screen space
    vector.x = Math.round((vector.x + 1) * canvas.width / 2);
    vector.y = Math.round((- vector.y + 1) * canvas.height / 2);
    vector.z = 0;

    return (vector)
}





// for the GUI part.d
function createPanel() {

    const panel = new GUI({ width: 120 });

    var settings = {
        'Cube Rotation': true,

        'Mesh Position XY': true,
        'Mesh Position Z': true,
        'Mesh Rotation XY': true,
        'Mesh Rotation Z': true,

        'Mesh Scale': true,

        'Spot Light': true,
        'Camera Orbit': false,

    };

    panel.add(settings, 'Cube Rotation').onChange((e) => { cubeRotation = e })
    panel.add(settings, 'Mesh Position XY').onChange((e) => { meshPositionXY = e })
    panel.add(settings, 'Mesh Position Z').onChange((e) => { meshPositionZ = e })
    panel.add(settings, 'Mesh Rotation XY').onChange((e) => { meshRotationXY = e })
    panel.add(settings, 'Mesh Rotation Z').onChange((e) => { meshRotationZ = e })
    panel.add(settings, 'Mesh Scale').onChange((e) => { meshScale = e })
    panel.add(settings, 'Spot Light').onChange((e) => { pointLightFront.intensity = e })
    panel.add(settings, 'Camera Orbit').onChange((e) => { cameraOrbit = e })

}





