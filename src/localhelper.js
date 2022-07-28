var textureWire = new THREE.TextureLoader().load('maps/wire.jpg');
var textureMask = new THREE.TextureLoader().load('maps/mask.jpg');
var textureMaskInvert = new THREE.TextureLoader().load('maps/mask_invert.jpg');
var textureNoise = new THREE.TextureLoader().load('maps/noise.jpg');
var textureGrunge = new THREE.TextureLoader().load('maps/Grunge Texture Square.png');
var textureLens = new THREE.TextureLoader().load('maps/texture_01_Square.png');

const rad = Math.PI / 180



// content generator function. 
export function addContent(texture) {

    // create a null object. this will be the top of the hirearchy. so very simple to rotate, and every child will rotate too. the nullMesh is the return value
    const nullObject = new THREE.PlaneGeometry(0, 0)
    var nullMesh = new THREE.Mesh(nullObject)

    // image holographics area
    var image01Plane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var image02Plane = new THREE.PlaneGeometry(14, 14, 1, 1)
    var image03Plane = new THREE.PlaneGeometry(14, 14, 1, 1)
    var image04Plane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var image05Plane = new THREE.PlaneGeometry(16, 16, 1, 1)

    var imageMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: texture });
    imageMaterial.alphaMap = textureMask;

    var imageMaterialInvert = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: texture });
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

    nullMesh.add(image01Mesh, image02Mesh, image03Mesh, image04Mesh, image05Mesh)


    // two small rotated line for the bette depth feeling.
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

    nullMesh.add(line01Mesh, line02Mesh);


    // plane noises in 3 layer. depth feeling
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

    nullMesh.add(noise01Mesh, noise02Mesh, noise03Mesh)


    // top of the grunge
    var grungePlane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var grungeMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureGrunge });
    grungeMaterial.blending = THREE.AdditiveBlending
    var grungeMesh = new THREE.Mesh(grungePlane, grungeMaterial)
    grungeMesh.position.z = 5
    nullMesh.add(grungeMesh)


    // top of the lanes plane
    var lensPlane = new THREE.PlaneGeometry(15, 15, 1, 1)
    var lensMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureLens });
    lensMaterial.blending = THREE.AdditiveBlending
    var lensMesh = new THREE.Mesh(lensPlane, lensMaterial)
    lensMesh.position.z = 5
    nullMesh.add(lensMesh)


    // top of the wire 
    var wirePlane = new THREE.PlaneGeometry(10, 10)
    var wireMaterial = new THREE.MeshStandardMaterial({ color: "#fff", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 1, roughness: 1, map: textureWire });
    wireMaterial.blending = THREE.AdditiveBlending
    var wireMesh = new THREE.Mesh(wirePlane, wireMaterial)
    wireMesh.position.z = 5
    nullMesh.add(wireMesh)



    return nullMesh
}