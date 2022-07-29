import './style.css'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { addContent, addStar } from './localhelper.js';
import { Composer } from './composer.js';

// import { TWEEN } from '../node_modules/@tweenjs/tween.js/dist/tween.cjs.js'

let camera, composer, renderer, capturer
let scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom
let sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask

let lutPass

var material
var sideFront, sideBack, sideLeft, sideRight, sideTop, sideBottom
var sideFrontMask, sideBackMask, sideLeftMask, sideRightMask, sideTopMask, sideBottomMask
let sideFrontMaskRoot, sideBackMaskRoot, sideLeftMaskRoot, sideRightMaskRoot, sideTopMaskRoot, sideBottomMaskRoot
let front, back, left, right, top, bottom

const textureImage01 = new THREE.TextureLoader().load('maps/image-01.jpg');
const textureImage02 = new THREE.TextureLoader().load('maps/image-02.jpg');
const textureImage03 = new THREE.TextureLoader().load('maps/image-03.jpg');
const textureImage04 = new THREE.TextureLoader().load('maps/image-04.jpg');
const textureImage05 = new THREE.TextureLoader().load('maps/image-05.jpg');
const textureImage06 = new THREE.TextureLoader().load('maps/image-06.jpg');

const cameraPosZ = 15
const cameraPosDistance = 5


const rad = Math.PI / 180
var boxRotation = 0

init()
render()

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
    camera.position.z = cameraPosZ - cameraPosDistance

    // camera.position.z = 15;
    // camera.position.x = 15;
    // camera.position.y = 15;




    // content definition for the sides
    front = addContent(textureImage01)
    sceneFront.add(front)

    back = addContent(textureImage02)
    back.rotation.y = Math.PI
    sceneBack.add(back)

    left = addContent(textureImage03)
    left.rotation.y = -Math.PI / 2;
    sceneLeft.add(left)

    right = addContent(textureImage04)
    right.rotation.y = Math.PI / 2;
    sceneRight.add(right)


    top = addContent(textureImage05)
    top.rotation.x = -Math.PI / 2
    sceneTop.add(top)

    bottom = addContent(textureImage06)
    bottom.rotation.x = Math.PI / 2;
    sceneBottom.add(bottom)



    // rendered core 
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xff0000);
    renderer.setClearAlpha(1)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.autoClearColor = true
    document.body.appendChild(renderer.domElement);






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



    sideFrontMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))
    sideBackMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))
    sideLeftMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))
    sideRightMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))
    sideTopMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))
    sideBottomMaskRoot = new THREE.Mesh(new THREE.PlaneGeometry(0, 0))

    // the cube 6 side mask definition here. if the content side size, pos, change should reflec the changes here too.
    sideFrontMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideFrontMask.position.z = 5;
    sceneFrontMask.add(sideFrontMaskRoot);
    sideFrontMaskRoot.add(sideFrontMask);

    sideBackMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideBackMask.position.z = -5;
    sideBackMask.rotation.y = Math.PI
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



    // light definition
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(6, 6, 6)
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight)

    const ambientLightFront = new THREE.AmbientLight(0xffffff);
    const ambientLightBack = new THREE.AmbientLight(0xffffff);
    const ambientLightLeft = new THREE.AmbientLight(0xffffff);
    const ambientLightRight = new THREE.AmbientLight(0xffffff);
    const ambientLightTop = new THREE.AmbientLight(0xffffff);
    const ambientLightBottom = new THREE.AmbientLight(0xffffff);

    sceneFront.add(ambientLightFront)
    sceneBack.add(ambientLightBack)
    sceneLeft.add(ambientLightLeft)
    sceneRight.add(ambientLightRight)
    sceneTop.add(ambientLightTop)
    sceneBottom.add(ambientLightBottom)

    // const lightHelper = new THREE.PointLightHelper(new THREE.PointLight(0xffffff))
    const gridHelper = new THREE.GridHelper(200, 50);
    // sceneFront.add(gridHelper)


    // 3d star definition.
    // addStar(scene)












    // if we want to controll the rotation for testing. 
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
    }
    controls.update();
    controls.listenToKeyEvents(window);




    composer = new Composer(renderer, scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom, sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask, camera)
    composer.init()



    window.addEventListener('resize', onWindowResize);
    document.addEventListener("keydown", onDocumentKeyDown, false);

}


function animation(degree) {

    const speed = 1000
    const animType = TWEEN.Easing.Quartic.InOut
    const animType2 = TWEEN.Easing.Quadratic.InOut


    new TWEEN.Tween(sideFrontMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(front.rotation).to({ y: degree * rad }, speed).easing(animType).start()

    new TWEEN.Tween(sideBackMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(back.rotation).to({ y: (degree - 180) * rad }, speed).easing(animType).start()

    new TWEEN.Tween(sideLeftMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(left.rotation).to({ y: (degree - 90) * rad }, speed).easing(animType).start()

    new TWEEN.Tween(sideRightMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(right.rotation).to({ y: (90 + degree) * rad }, speed).easing(animType).start()

    new TWEEN.Tween(sideTopMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(top.rotation).to({ z: degree * rad }, speed).easing(animType).start()

    new TWEEN.Tween(sideBottomMaskRoot.rotation).to({ y: degree * rad }, speed).easing(animType).start()
    new TWEEN.Tween(bottom.rotation).to({ z: -degree * rad }, speed).easing(animType).start()

    new TWEEN.Tween(camera.position).to({ z: cameraPosZ }, speed / 2).easing(animType2).start().onComplete(() => {
        new TWEEN.Tween(camera.position).to({ z: cameraPosZ - cameraPosDistance }, speed / 2).easing(animType2).start()
    })
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

    TWEEN.update()


    // renderer.render(scene, camera)
    // renderer.render(sceneFront, camera)
    // renderer.render(sceneBack, camera)
    // renderer.render(sceneLeft, camera)
    // renderer.render(sceneRight, camera)
    // renderer.render(sceneTop, camera)
    // renderer.render(sceneBottom, camera)


    // renderer.clear();
    // renderer.clearDepth();
    composer.render()
    if (capturer) capturer.capture(renderer.domElement);
}



function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.composer.setSize(width, height);

    if (width < 1000) camera.position.z = (cameraPosZ - cameraPosDistance) / width * 1000



}



function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        console.log('87')


    } else if (keyCode == 83) {

        console.log('83')


    } else if (keyCode == 65) {

        boxRotation -= 90
        animation(boxRotation)

    } else if (keyCode == 68) {

        boxRotation += 90
        animation(boxRotation)

    } else if (keyCode == 32) {
        // cube.position.set(0, 0, 0);
        console.log('space')
    }


};