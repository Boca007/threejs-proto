import './style.css'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from '../examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from '../examples/jsm/postprocessing/ShaderPass.js';
// import { TexturePass } from '../examples/jsm/postprocessing/TexturePass.js';
import { ClearPass } from '../examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from '../examples/jsm/postprocessing/MaskPass.js';
import { CopyShader } from '../examples/jsm/shaders/CopyShader.js';
// import { LUTPass } from '../examples/jsm/postprocessing/LUTPass.js';
// import { LUTCubeLoader } from '../examples/jsm/loaders/LUTCubeLoader.js';
// import { LUT3dlLoader } from '../examples/jsm/loaders/LUT3dlLoader.js';
import { BloomPass } from '../examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from '../examples/jsm/postprocessing/FilmPass.js';
import { DotScreenPass } from '../examples/jsm/postprocessing/DotScreenPass.js';


import { addContent } from './localhelper.js';
import { Lut } from './lut.js';


let camera, composer, renderer, capturer
let scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom
let sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask

let lutPass

var material
var sideFront, sideBack, sideLeft, sideRight, sideTop, sideBottom
var sideFrontMask, sideBackMask, sideLeftMask, sideRightMask, sideTopMask, sideBottomMask


const textureImage01 = new THREE.TextureLoader().load('maps/image-01.jpg');
const textureImage02 = new THREE.TextureLoader().load('maps/image-02.jpg');
const textureImage03 = new THREE.TextureLoader().load('maps/image-03.jpg');
const textureImage04 = new THREE.TextureLoader().load('maps/image-04.jpg');
const textureImage05 = new THREE.TextureLoader().load('maps/image-05.jpg');
const textureImage06 = new THREE.TextureLoader().load('maps/image-06.jpg');


const rad = Math.PI / 180

// const params = {
//     enabled: true,
//     lut: 'Bourbon 64.CUBE',
//     // lut: 'Cubicle 99.CUBE',
//     intensity: 1,
//     use2DLut: false,
// };

// const lutMap = {
//     'Bourbon 64.CUBE': null,
//     'Chemical 168.CUBE': null,
//     'Clayton 33.CUBE': null,
//     'Cubicle 99.CUBE': null,
//     'Remy 24.CUBE': null,
//     'Presetpro-Cinematic.3dl': null
// };

init()
render()

function init() {
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
    camera.position.z = 20;
    // camera.position.x = 15;
    // camera.position.y = 15;


    // Object.keys(lutMap).forEach(name => {

    //     if (/\.CUBE$/i.test(name)) {

    //         new LUTCubeLoader()
    //             .load('examples/luts/' + name, function(result) {

    //                 lutMap[name] = result;

    //             });

    //     } else {

    //         new LUT3dlLoader()
    //             .load('examples/luts/' + name, function(result) {

    //                 lutMap[name] = result;

    //             });

    //     }

    // });
    lutPass = new Lut()
    lutPass.lutLoad()




    // content definition for the sides
    var front = addContent(textureImage01)
    sceneFront.add(front)

    var back = addContent(textureImage02)
    back.rotation.y = Math.PI
    sceneBack.add(back)

    var left = addContent(textureImage03)
    left.rotation.y = -Math.PI / 2;
    sceneLeft.add(left)

    var right = addContent(textureImage04)
    right.rotation.y = Math.PI / 2;
    sceneRight.add(right)


    var top = addContent(textureImage05)
    top.rotation.x = -Math.PI / 2
    sceneTop.add(top)

    var bottom = addContent(textureImage06)
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


    // capturer = new CCapture({
    //     format: 'png',
    //     framerate: 60,
    //     quality: 90,
    //     verbose: true,
    //     display: true,

    // });



    capturer = null;

    var sCB = document.getElementById('start-capturing-button'),
        dVB = document.getElementById('download-video-button'),
        progress = document.getElementById('progress');

    console.log(sCB)

    sCB.addEventListener('click', function(e) {

        capturer = new CCapture({
            verbose: true,
            framerate: 60,
            // motionBlurFrames: 16,
            quality: 90,
            // format: 'gif',
            format: 'png',
            // workersPath: '.',
            onProgress: function(p) { progress.style.width = (p * 100) + '%' }
        });

        capturer.start();
        this.style.display = 'none';
        dVB.style.display = 'block';

        // start();

        e.preventDefault();
    }, false);

    dVB.addEventListener('click', function(e) {
        capturer.stop();
        this.style.display = 'none';
        //this.setAttribute( 'href',  );
        capturer.save();
    }, false);




    // the 6 side definition happening here. with material. 

    // var materialSide = new THREE.MeshLambertMaterial({ map: textureWire });
    // materialSide.minFilter = THREE.LinearFilter;
    // materialSide.blending = THREE.AdditiveBlending

    // sideFront = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // // sideFront.material.side = THREE.DoubleSide;
    // sideFront.position.z = 5;
    // // sceneFront.add(sideFront);

    // sideBack = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideBack.position.z = -5;
    // sideBack.rotation.y = Math.PI
    //     // sceneBack.add(sideBack);

    // sideLeft = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideLeft.position.x = -5;
    // sideLeft.rotation.y = -Math.PI / 2;
    // // sceneLeft.add(sideLeft);

    // sideRight = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideRight.position.x = 5;
    // sideRight.rotation.y = Math.PI / 2;
    // // sceneRight.add(sideRight);

    // sideTop = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideTop.position.y = 5;
    // sideTop.rotation.x = -Math.PI / 2;
    // // sceneTop.add(sideTop);

    // sideBottom = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideBottom.position.y = -5;
    // sideBottom.rotation.x = Math.PI / 2;
    // // sceneBottom.add(sideBottom);



    // the cube 6 side mask definition here. if the content side size, pos, change should reflec the changes here too.
    sideFrontMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideFrontMask.position.z = 5;
    sceneFrontMask.add(sideFrontMask);

    sideBackMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideBackMask.position.z = -5;
    sideBackMask.rotation.y = Math.PI
    sceneBackMask.add(sideBackMask);

    sideLeftMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideLeftMask.position.x = -5;
    sideLeftMask.rotation.y = -Math.PI / 2;
    sceneLeftMask.add(sideLeftMask);

    sideRightMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideRightMask.position.x = 5;
    sideRightMask.rotation.y = Math.PI / 2;
    sceneRightMask.add(sideRightMask);

    sideTopMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideTopMask.position.y = 5;
    sideTopMask.rotation.x = -Math.PI / 2;
    sceneTopMask.add(sideTopMask);

    sideBottomMask = new THREE.Mesh(new THREE.PlaneGeometry(10, 10));
    sideBottomMask.position.y = -5;
    sideBottomMask.rotation.x = Math.PI / 2;
    sceneBottomMask.add(sideBottomMask);



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
    Array(550).fill().forEach(addStar)



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

    // EFFECT COMPOSER
    // ***********************

    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: true };
    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

    // renderPass definitions

    var renderPass = new RenderPass(scene, camera);
    renderPass.clear = false;

    var renderPassFront = new RenderPass(sceneFront, camera);
    // renderPassFront.clearColor = new THREE.Color(0, 0, 0);
    // renderPassFront.clearAlpha = 0;
    renderPassFront.clear = false;
    // renderPassFront.renderToScreen = true;

    var renderPassBack = new RenderPass(sceneBack, camera);
    renderPassBack.clear = false;

    var renderPassLeft = new RenderPass(sceneLeft, camera);
    renderPassLeft.clear = false;

    var renderPassRight = new RenderPass(sceneRight, camera);
    renderPassRight.clear = false;

    var renderPassTop = new RenderPass(sceneTop, camera);
    renderPassTop.clear = false;

    var renderPassBottom = new RenderPass(sceneBottom, camera);
    renderPassBottom.clear = false;


    // maskPass defintions this will mask the whole scene render side by side.
    const maskPassFront = new MaskPass(sceneFrontMask, camera);
    const maskPassBack = new MaskPass(sceneBackMask, camera);
    const maskPassLeft = new MaskPass(sceneLeftMask, camera);
    const maskPassRight = new MaskPass(sceneRightMask, camera);
    const maskPassTop = new MaskPass(sceneTopMask, camera);
    const maskPassBottom = new MaskPass(sceneBottomMask, camera);


    const clearPass = new ClearPass();
    const clearMaskPass = new ClearMaskPass();
    const outputPass = new ShaderPass(CopyShader);


    // lutPass = new LUTPass();
    const effectFilm = new FilmPass(0.35, 0.025, 648, false);
    const effectBloom = new BloomPass(0.5);
    const effectFilmBW = new FilmPass(0.35, 0.5, 2048, true);
    const effectDotScreen = new DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8);


    // composition magic. mask, draw, clear mask... mask, draw, clear
    composer = new EffectComposer(renderer, renderTarget);

    composer.addPass(clearPass);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassFront);
    composer.addPass(renderPassFront);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassBack);
    composer.addPass(renderPassBack);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassLeft);
    composer.addPass(renderPassLeft);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassRight);
    composer.addPass(renderPassRight);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassTop);
    composer.addPass(renderPassTop);
    composer.addPass(clearMaskPass);

    composer.addPass(maskPassBottom);
    composer.addPass(renderPassBottom);
    composer.addPass(clearMaskPass);

    // the stars particle
    composer.addPass(renderPass);

    composer.addPass(lutPass.lutPass);

    // composer.addPass(effectFilm);
    // composer.addPass(effectFilmBW);

    // composer.addPass(effectBloom);

    // composer.addPass(effectDotScreen);


    composer.addPass(outputPass);



    window.addEventListener('resize', onWindowResize);

}








function render() {
    requestAnimationFrame(render);

    // const time = performance.now() * 0.001 + 6000;

    // lutPass.enabled = params.enabled && Boolean(lutMap[params.lut]);
    // lutPass.intensity = params.intensity;
    // if (lutMap[params.lut]) {

    //     const lut = lutMap[params.lut];
    //     lutPass.lut = params.use2DLut ? lut.texture : lut.texture3D;

    // }

    lutPass.render()


    // sceneFront.rotation.y += rad * 1

    // renderer.render(sceneFront, camera)

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
    composer.setSize(width, height);

}

// give random start. for better deept feeling.
function addStar() {
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x, y, z);
    scene.add(star)
}