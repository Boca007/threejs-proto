import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from '../counter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);



var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(10, 10, 10);
// var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 35;





const geometry2 = new THREE.TorusGeometry(10, 3, 16, 100)
    // const material2 = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
const material2 = new THREE.MeshStandardMaterial({ color: 0xFF6347 });

const torus = new THREE.Mesh(geometry2, material2);


function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;


    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.y += 0.01;


    renderer.render(scene, camera);
}

animate();



scene.add(torus)


const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)


const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper)



const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


function addStar() {
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x, y, z);
    scene.add(star)
}

Array(250).fill().forEach(addStar)



// const spaceTexture = new THREE.TextureLoader().load('');
// scene.background = spaceTexture;



const avatarTexture = new THREE.TextureLoader().load('javascript.svg');

const avatar = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);



const planetTexture = new THREE.TextureLoader().load('javascript.svg');


const planet = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: planetTexture, })
);

scene.add(planet);