import { EffectComposer } from '../examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from '../examples/jsm/postprocessing/ShaderPass.js';
// import { TexturePass } from '../examples/jsm/postprocessing/TexturePass.js';
import { ClearPass } from '../examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from '../examples/jsm/postprocessing/MaskPass.js';
import { CopyShader } from '../examples/jsm/shaders/CopyShader.js';


import { BloomPass } from '../examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from '../examples/jsm/postprocessing/FilmPass.js';
import { DotScreenPass } from '../examples/jsm/postprocessing/DotScreenPass.js';


// import { Lut } from './lut.js';

class Composer {

    constructor(renderer, scene, sceneFront, sceneBack, sceneLeft, sceneRight, sceneTop, sceneBottom, sceneFrontMask, sceneBackMask, sceneLeftMask, sceneRightMask, sceneTopMask, sceneBottomMask, camera) {

        this.renderer = renderer;

        this.scene = scene
        this.sceneFront = sceneFront
        this.sceneBack = sceneBack
        this.sceneLeft = sceneLeft
        this.sceneRight = sceneRight
        this.sceneTop = sceneTop
        this.sceneBottom = sceneBottom
        this.sceneFrontMask = sceneFrontMask
        this.sceneBackMask = sceneBackMask
        this.sceneLeftMask = sceneLeftMask
        this.sceneRightMask = sceneRightMask
        this.sceneTopMask = sceneTopMask
        this.sceneBottomMask = sceneBottomMask

        this.camera = camera
    }




    composer = null
    lutPass = null

    init() {

        const parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: true };
        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

        // this.lutPass = new Lut()
        // this.lutPass.lutLoad()

        var renderPass = new RenderPass(this.scene, this.camera);
        renderPass.clear = false;

        var renderPassFront = new RenderPass(this.sceneFront, this.camera);
        // renderPassFront.clearColor = new THREE.Color(0, 0, 0);
        // renderPassFront.clearAlpha = 0;
        renderPassFront.clear = false;
        // renderPassFront.renderToScreen = true;

        var renderPassBack = new RenderPass(this.sceneBack, this.camera);
        renderPassBack.clear = false;

        var renderPassLeft = new RenderPass(this.sceneLeft, this.camera);
        renderPassLeft.clear = false;

        var renderPassRight = new RenderPass(this.sceneRight, this.camera);
        renderPassRight.clear = false;

        var renderPassTop = new RenderPass(this.sceneTop, this.camera);
        renderPassTop.clear = false;

        var renderPassBottom = new RenderPass(this.sceneBottom, this.camera);
        renderPassBottom.clear = false;


        // maskPass defintions this will mask the whole scene render side by side.
        const maskPassFront = new MaskPass(this.sceneFrontMask, this.camera);
        const maskPassBack = new MaskPass(this.sceneBackMask, this.camera);
        const maskPassLeft = new MaskPass(this.sceneLeftMask, this.camera);
        const maskPassRight = new MaskPass(this.sceneRightMask, this.camera);
        const maskPassTop = new MaskPass(this.sceneTopMask, this.camera);
        const maskPassBottom = new MaskPass(this.sceneBottomMask, this.camera);


        const clearPass = new ClearPass();
        const clearMaskPass = new ClearMaskPass();
        const outputPass = new ShaderPass(CopyShader);


        // lutPass = new LUTPass();
        const effectFilm = new FilmPass(0.35, 0.025, 648, false);
        const effectBloom = new BloomPass(0.5);
        const effectFilmBW = new FilmPass(0.35, 0.5, 2048, true);
        const effectDotScreen = new DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8);


        // composition magic. mask, draw, clear mask... mask, draw, clear
        this.composer = new EffectComposer(this.renderer, renderTarget);

        this.composer.addPass(clearPass);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassFront);
        this.composer.addPass(renderPassFront);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassBack);
        this.composer.addPass(renderPassBack);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassLeft);
        this.composer.addPass(renderPassLeft);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassRight);
        this.composer.addPass(renderPassRight);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassTop);
        this.composer.addPass(renderPassTop);
        this.composer.addPass(clearMaskPass);

        this.composer.addPass(maskPassBottom);
        this.composer.addPass(renderPassBottom);
        this.composer.addPass(clearMaskPass);

        // the stars particle
        this.composer.addPass(renderPass);

        // this.composer.addPass(this.lutPass.lutPass);

        // this.composer.addPass(effectFilm);
        // this.composer.addPass(effectFilmBW);

        // this.composer.addPass(effectBloom);

        // this.composer.addPass(effectDotScreen);


        this.composer.addPass(outputPass);

    }


    render() {
        // this.lutPass.render()
        this.composer.render()
    }



}

export { Composer }