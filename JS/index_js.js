//Three.JS import
import * as THREE from 'three';

//Text related
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';


//Till line 36 is basic setup of the scene. After that is the acctual contents of the scene
const canvas = document.querySelector("#experience-canvas"); //grabs canvas
const sizes ={ //intilizes width and height as variables
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene(); //creats a variable for a new scene

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true}); //web renderer details
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize( sizes.width, sizes.height ); //size of render details
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 ); //camera details
camera.position.set(5, 0, 0);
camera.lookAt(0, 0, 0);

//responds to resizies
window.addEventListener("resize", () => {
    //is updating everything needed to resize the renderer correctly
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
})

//scene background
scene.background = new THREE.Color('#000000');  // gray/blue

//lights
const mainlight = new THREE.DirectionalLight( 0xffffff, 2 );
mainlight.lookAt(0, 0, 0);
mainlight.position.set(4, 2, 0);
scene.add( mainlight );
const backlight = new THREE.AmbientLight( 0xffffff, 2);
backlight.position.set(-4, -1, 0);
scene.add( backlight );

//3D font
let strokeGroup;
const textloader = new FontLoader();
textloader.load('website_media/other/baumans_regular.json', function (font) {
  const textGeometry = new TextGeometry('N o u r   N a d a', {
    font: font,
    size: 1,
    depth: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10,
  });
  textGeometry.computeBoundingBox();
  const textMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.4,
    transmission: 1.0,
    transparent: true,
    thickness: 1.0,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(0, -1.1, 4.4);
  textMesh.rotation.y += Math.PI/2;
  scene.add(textMesh);

  //moving text outline
  strokeGroup = new THREE.Group();
  strokeGroup.userData.update = (t) => {
    strokeGroup.children.forEach((child) => {
      child.userData.update?.(t);
    })
  }
  strokeGroup.position.set(.13, -1.1, 4.4);
  strokeGroup.rotation.y += Math.PI / 2;
  const lineMaterial = new LineMaterial({
    color: 0xffffff,
    linewidth: 3,
    dashed: true,
    dashSize: 0.3,
    gapSize: 0.7,
    dashOffset: 0.0,
  });
  const shapes = font.generateShapes('N o u r   N a d a', 1);
  shapes.forEach((s) => {
    let points = s.getPoints();
    let points3d = [];
    points.forEach((p) => {
      points3d.push(p.x, p.y, 0);
    });
    const lineGeo = new LineGeometry();
    lineGeo.setPositions(points3d);
    const strokeMesh = new Line2(lineGeo, lineMaterial);
    strokeMesh.computeLineDistances();
    strokeMesh.userData.update = (t) => {
      lineMaterial.dashOffset = t * 0.1;
    }
    strokeGroup.add(strokeMesh);
    
    if (s.holes?.length > 0) {
      s.holes.forEach((h) => {
        let points = h.getPoints();
        let points3d = [];
        points.forEach((p) => {
          points3d.push(p.x, p.y, 0);
        });
        const lineGeo = new LineGeometry();
        lineGeo.setPositions(points3d);
        const strokeMesh = new Line2(lineGeo, lineMaterial);
        strokeMesh.computeLineDistances();
        strokeGroup.add(strokeMesh);
      });
    }
  });
  scene.add(strokeGroup);
  text_animate();
});


//Sphere with points on it
const sphereMeshParticles = new THREE.SphereGeometry(5, 32, 10);
const sphereMaterialParticles = new THREE.PointsMaterial({
  size: 0.1,
})
const pointSphere = new THREE.Points(sphereMeshParticles, sphereMaterialParticles);
pointSphere.position.set(-6, 0, 0);
scene.add(pointSphere);

//adds particle enviorment effect
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterialParticles = new THREE.PointsMaterial({
  size: 0.008,
  color: 'gray',
})
const particlesCnt = 2000;
const posArray = new Float32Array(particlesCnt * 3);
for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5)*15;
}
particlesGeometry.setAttribute ('position', new THREE.BufferAttribute(posArray, 3));
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterialParticles);
scene.add(particlesMesh);

document.addEventListener('mousemove', mousePos);
let mouseX = 0;
let mouseY = 0;
function mousePos(event) {
  //checks locatino of mouse
  mouseY= (event.clientY - (window.innerHeight/2)) * -1;
  mouseX = event.clientX - (window.innerWidth/2);

  //ensures right number is feed out depending on where the mouse is
  if (mouseY <= 0 && mouseX <= 0) {
    mouseY = (Math.pow((mouseY/(window.innerHeight/2)), 2))*-1;
    mouseX = (Math.pow((mouseX/(window.innerWidth/2)), 2))*-1;
  }
  else if (mouseY <= 0) {
    mouseY = (Math.pow((mouseY/(window.innerHeight/2)), 2))*-1;
    mouseX = Math.pow((mouseX/(window.innerWidth/2)), 2);
  }
  else if (mouseX <= 0) {
    mouseY = Math.pow((mouseY/(window.innerHeight/2)), 2);
    mouseX = (Math.pow((mouseX/(window.innerWidth/2)), 2))*-1;
  }
  else {
    mouseY = Math.pow((mouseY/(window.innerHeight/2)), 2);
    mouseX = Math.pow((mouseX/(window.innerWidth/2)), 2);
  }

  //Ensures that if mouse goes off screen everything resets
  document.documentElement.addEventListener('mouseleave', () => {
    mouseY = 0;
    mouseX = 0;
  });
} 

animate();

//animation call
function text_animate(t = 0) {
  requestAnimationFrame(text_animate);
  strokeGroup.userData.update(t * 0.008);
}
function rotation() {
  //simiply rotates sphere
  pointSphere.rotation.y += 0.004;
  //animation to get shpere spinnign with mouse movment
  pointSphere.position.set(-6, mouseY, mouseX);
  pointSphere.rotation.y += mouseX/10;
  pointSphere.rotation.z += mouseY/10;

  //animation to get atmoshpere particles to move with mouse
  particlesMesh.rotation.y += Math.random() * 0.001;
  particlesMesh.rotation.x += Math.random() * 0.001;
  particlesMesh.rotation.z += Math.random() * 0.001;

  particlesMesh.rotation.y += mouseX/40;
  particlesMesh.rotation.z += mouseY/40;
}
function animate() {
  requestAnimationFrame(animate);
  rotation();

  renderer.render( scene, camera );
}