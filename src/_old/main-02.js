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
let box, torus;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 10;

    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const scene3 = new THREE.Scene();

    box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4));
    scene1.add(box);

    torus = new THREE.Mesh(new THREE.TorusGeometry(3, 1, 16, 32));
    scene2.add(torus);

    var material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), material);
    scene3.add(box2);



    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xe0e0e0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    //

    const clearPass = new ClearPass();

    const clearMaskPass = new ClearMaskPass();

    const maskPass1 = new MaskPass(scene1, camera);
    const maskPass2 = new MaskPass(scene2, camera);

    const texture1 = new THREE.TextureLoader().load('examples/textures/758px-Canestra_di_frutta_(Caravaggio).jpg');
    texture1.minFilter = THREE.LinearFilter;
    const texture2 = new THREE.TextureLoader().load('examples/textures/2294472375_24a3b8ef46_o.jpg');

    const texturePass1 = new TexturePass(texture1);
    const texturePass2 = new TexturePass(texture2);

    // const cameraPass1 = new Camerap

    const outputPass = new ShaderPass(CopyShader);

    const parameters = {
        stencilBuffer: true
    };

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);



    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();




    var renderPass = new RenderPass(scene3, camera);
    renderPass.clearColor = new THREE.Color(0, 0, 0);
    renderPass.clearAlpha = 0;
    renderPass.clear = false;




    composer = new EffectComposer(renderer, renderTarget);

    composer.addPass(clearPass);

    composer.addPass(maskPass1);
    composer.addPass(texturePass1);

    composer.addPass(clearMaskPass);

    composer.addPass(maskPass2);
    composer.addPass(texturePass2);

    composer.addPass(clearMaskPass);
    composer.addPass(renderPass);
    composer.addPass(outputPass);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);

}

function animate() {

    requestAnimationFrame(animate);

    const time = performance.now() * 0.001 + 6000;

    // box.position.x = Math.cos(time / 1.5) * 2;
    // box.position.y = Math.sin(time) * 2;
    // box.rotation.x = time;
    // box.rotation.y = time / 2;

    // torus.position.x = Math.cos(time) * 2;
    // torus.position.y = Math.sin(time / 1.5) * 2;
    // torus.rotation.x = time;
    // torus.rotation.y = time / 2;

    renderer.clear();
    composer.render(time);

}