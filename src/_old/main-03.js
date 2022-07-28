import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { EffectComposer } from './examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from './examples/jsm/postprocessing/ShaderPass.js';
import { TexturePass } from './examples/jsm/postprocessing/TexturePass.js';
import { ClearPass } from './examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from './examples/jsm/postprocessing/MaskPass.js';
import { CopyShader } from './examples/jsm/shaders/CopyShader.js';


let camera, composer, renderer;
let scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom
let sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask


var material
var sideFront, sideBack, sideLeft, sideRight, sideTop, sideBottom
var sideFrontMask, sideBackMask, sideLeftMask, sideRightMask, sideTopMask, sideBottomMask

var textureWire = new THREE.TextureLoader().load('maps/wire.jpg');
var textureLine = new THREE.TextureLoader().load('maps/line.jpg');
var textureImage = new THREE.TextureLoader().load('maps/dj.jpg');
var textureMask = new THREE.TextureLoader().load('maps/mask.jpg');
var textureMaskInvert = new THREE.TextureLoader().load('maps/mask_invert.jpg');
var textureNoise = new THREE.TextureLoader().load('maps/noise.jpg');
var textureGrunge = new THREE.TextureLoader().load('maps/Grunge Texture Square.png');
var textureLens = new THREE.TextureLoader().load('maps/texture_01_Square.png');

const rad = Math.PI / 180

init()
animate()

function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0.6, 0.6, 0.6);
    // scene.clearColor = new THREE.Color(0, 1, 0);
    // scene.clearAlpha = 0;
    // scene.clear = false;

    // scenes, the real data must be here. 
    sceneFront = new THREE.Scene();
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
    camera.position.z = 15;
    camera.position.x = 15;
    camera.position.y = 15;

    // temporary 3d object for the holografic test
    // sceneFront.add(new THREE.Mesh(new THREE.SphereBufferGeometry(7, 20, 20), new THREE.MeshBasicMaterial({ color: 0x008800, wireframe: true })))
    // sceneFront.add(new THREE.Mesh(new THREE.SphereBufferGeometry(5, 10, 10), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })))

    var image01Plane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var image02Plane = new THREE.PlaneGeometry(14, 14, 1, 1)
    var image03Plane = new THREE.PlaneGeometry(14, 14, 1, 1)
    var image04Plane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var image05Plane = new THREE.PlaneGeometry(16, 16, 1, 1)

    var imageMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureImage });
    imageMaterial.alphaMap = textureMask;

    var imageMaterialInvert = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureImage });
    imageMaterialInvert.alphaMap = textureMaskInvert;

    var image01Mesh = new THREE.Mesh(image01Plane, imageMaterial)
    var image02Mesh = new THREE.Mesh(image02Plane, imageMaterialInvert)
    var image03Mesh = new THREE.Mesh(image03Plane, imageMaterialInvert)
    var image04Mesh = new THREE.Mesh(image04Plane, imageMaterialInvert)
    var image05Mesh = new THREE.Mesh(image05Plane, imageMaterialInvert)

    image02Mesh.position.z = 1
    image03Mesh.position.z = 2
    image04Mesh.position.z = 3
    image05Mesh.position.z = 4

    sceneFront.add(image01Mesh, image02Mesh, image03Mesh, image04Mesh, image05Mesh)


    const line01 = new THREE.BoxGeometry(15, 0.05, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0.0, opacity: 0.03, roughness: 1 });
    const line01Mesh = new THREE.Mesh(line01, material);
    material.blending = THREE.AdditiveBlending
    line01Mesh.position.x = -1
    line01Mesh.position.y = 2
    line01Mesh.position.z = 3
    line01Mesh.rotation.x = rad * 10
    line01Mesh.rotation.y = rad * 30
    line01Mesh.rotation.z = rad * 60

    const line02 = new THREE.BoxGeometry(15, 0.05, 0.05);
    const line02Mesh = new THREE.Mesh(line02, material);
    line02Mesh.position.x = -1
    line02Mesh.position.y = -2
    line02Mesh.position.z = 3
    line02Mesh.rotation.x = rad * 130
    line02Mesh.rotation.y = rad * 40
    line02Mesh.rotation.z = rad * 20

    sceneFront.add(line01Mesh, line02Mesh);



    var noise01Plane = new THREE.PlaneGeometry(45, 45, 1, 1)
    var noise02Plane = new THREE.PlaneGeometry(45, 45, 1, 1)
    var noise03Plane = new THREE.PlaneGeometry(45, 45, 1, 1)

    var noiseMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1 });
    noiseMaterial.alphaMap = textureNoise;
    noiseMaterial.blending = THREE.AdditiveBlending

    var noise01Mesh = new THREE.Mesh(noise01Plane, noiseMaterial)
    var noise02Mesh = new THREE.Mesh(noise02Plane, noiseMaterial)
    var noise03Mesh = new THREE.Mesh(noise03Plane, noiseMaterial)

    noise01Mesh.position.z = 2
    noise01Mesh.rotation.z = rad * 70
    noise02Mesh.position.z = 3
    noise02Mesh.rotation.z = rad * 30
    noise03Mesh.position.z = 4

    sceneFront.add(noise01Mesh, noise02Mesh, noise03Mesh)



    var grungePlane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var grungeMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureGrunge });
    grungeMaterial.blending = THREE.AdditiveBlending
    var grungeMesh = new THREE.Mesh(grungePlane, grungeMaterial)
    grungeMesh.position.z = 5
    sceneFront.add(grungeMesh)

    var lensPlane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var lensMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureLens });
    lensMaterial.blending = THREE.AdditiveBlending
    var lensMesh = new THREE.Mesh(lensPlane, lensMaterial)
    lensMesh.position.z = 5
    sceneFront.add(lensMesh)







    // temporary 3d object for the holografic test
    const planeRight1 = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 10, 10), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }))
    const planeRight2 = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 10, 10), new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg') }))
    planeRight1.rotation.y = Math.PI / 2
    planeRight1.position.x = 3
    planeRight2.rotation.y = Math.PI / 2
    sceneRight.add(planeRight1, planeRight2)










    // rendered core 
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x111);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);


    // the 6 side definition happening here. with material. 


    // texture = new THREE.TextureLoader().load('examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg');
    // texture.minFilter = THREE.LinearFilter;
    // texture = new THREE.TextureLoader().load('examples/textures/cube/MilkyWay/dark-s_pz.jpg');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(10, 10);

    // material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false })

    var materialSide = new THREE.MeshLambertMaterial({ map: textureWire });
    materialSide.minFilter = THREE.LinearFilter;
    materialSide.blending = THREE.AdditiveBlending



    sideFront = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    // sideFront.material.side = THREE.DoubleSide;
    sideFront.position.z = 5;
    // sceneFront.add(sideFront);

    sideBack = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    sideBack.position.z = -5;
    sideBack.rotation.y = Math.PI
    sceneBack.add(sideBack);

    sideLeft = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    sideLeft.position.x = -5;
    sideLeft.rotation.y = -Math.PI / 2;
    sceneLeft.add(sideLeft);

    sideRight = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    sideRight.position.x = 5;
    sideRight.rotation.y = Math.PI / 2;
    sceneRight.add(sideRight);

    sideTop = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    sideTop.position.y = 5;
    sideTop.rotation.x = -Math.PI / 2;
    sceneTop.add(sideTop);

    sideBottom = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), materialSide);
    sideBottom.position.y = -5;
    sideBottom.rotation.x = Math.PI / 2;
    sceneBottom.add(sideBottom);



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
    controls.update();


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

    composer.addPass(renderPass);



    composer.addPass(outputPass);



    window.addEventListener('resize', onWindowResize);

}








function animate() {
    requestAnimationFrame(animate);

    // const time = performance.now() * 0.001 + 6000;

    // renderer.render(sceneFront, camera)

    // renderer.clear();
    // renderer.clearDepth();
    composer.render();


    ;
}



function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);

}


function addStar() {
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x, y, z);
    scene.add(star)
}