import * as THREE from 'three';

//Till line 36 is basic setup of the scene. After that is the acctual contents of the scene
const canvas = document.querySelector("#experience-canvas"); //grabs canvas

const scene = new THREE.Scene(); //creats a variable for a new scene

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true}); //web renderer details
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera( 70, 1, 0.1, 1000 ); //camera details; aspect set by syncRenderer
camera.position.set(5, 0, 0);
camera.lookAt(0, 0, 0);

// reads the canvas's actual CSS display size so the renderer always matches what is on screen,
// even when window.innerWidth/Height are stale during a page transition on mobile
function syncRenderer() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}
syncRenderer();
new ResizeObserver(syncRenderer).observe(canvas);


//scene background
scene.background = new THREE.Color('#000000');  // gray/blue

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

function rotation() {
  //simiply rotates sphere
  pointSphere.rotation.y += 0.0003;
  //animation to get shpere spinning with mouse movment
  pointSphere.position.set(-6, mouseY, mouseX);
  pointSphere.rotation.y += mouseX/30;
  pointSphere.rotation.z += mouseY/30;

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