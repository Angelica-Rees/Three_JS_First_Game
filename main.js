import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

//Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.BasicShadowMap
renderer.setClearColor(0x111111)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Floor
const geometryP = new THREE.PlaneGeometry(10, 10);
const materialP = new THREE.MeshStandardMaterial({color:0xffffff})
const plane = new THREE.Mesh(geometryP, materialP);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(20, 100, 10)
directionalLight.target.root
directionalLight.castShadow = true;
scene.add(directionalLight);

// Camera Controls (Taken out until I can figure out how to get it to work with my third person camera)
// const orbitControls = new OrbitControls( camera, renderer.domElement );
// orbitControls.update();

//Models
const models = {
  pig:    { url: 'resources/Pig.glb' },
  cow:    { url: 'resources/Cow.glb' },
  llama:  { url: 'resources/Llama.glb' },
  pug:    { url: 'resources/Pug.glb' },
  sheep:  { url: 'resources/Sheep.glb' },
  zebra:  { url: 'resources/Zebra.glb' },
  horse:  { url: 'resources/Horse.glb' },
  robot: { url: 'resources/Robot.glb' },
};

//CharacterController
class CharacterControls{
  // listens to keys to move forward, back and rotate left/right based on world direction
  mixer;
  keys = {}

  currentState = 2

  constructor(animations, model) {
    this.model = model
    this.animations = animations
    this.mixer = new THREE.AnimationMixer(model);
    this.moveDistance = 0.02;

    this.action = this.mixer.clipAction(animations[2]);
    this.action.play();
    this.forward = new THREE.Vector3()

    document.addEventListener('keydown', ev => this.onkeydown(ev))
    document.addEventListener('keyup', ev => this.onkeyup(ev))
  }

  update(){
    var play = this.currentState
    if (this.keys['s'] || this.keys['w'] || this.keys['a'] || this.keys['d']) {
      if (this.keys[' ']) {
        play = 3
      }
      else {
        play = 10
      }
    } else {
      play = 2
    }

    if (this.currentState != play) {
      const toPlay = this.mixer.clipAction(this.animations[play])
      const current = this.mixer.clipAction(this.animations[this.currentState])

      current.fadeOut(0.25)
      toPlay.reset().fadeIn(0.25).play()

      this.currentState = play
    }


    this.model.getWorldDirection(this.forward)

    if (this.keys['s']) this.model.position.add(this.forward.clone().multiplyScalar(-this.moveDistance)) 
    if (this.keys['w']) this.model.position.add(this.forward.clone().multiplyScalar(this.moveDistance))

    if (this.keys['a']) this.model.rotateY(0.025)
    if (this.keys['d']) this.model.rotateY(-0.025)
    
    this.mixer.update(0.01);
  }

  onkeydown(event) {
    this.keys[event.key.toLowerCase()] = true
  }

  onkeyup(event) {
    this.keys[event.key.toLowerCase()] = false
  }
  

}

//Loading robot, camera, controller, etc.
const gltfLoader = new GLTFLoader();
var model;
gltfLoader.load(models['robot'].url, function(gltf) {
  model = gltf.scene;

  // ThirdPersonCamera
  model.add( camera );
  camera.position.set(0,10,-20);
  camera.lookAt(model.position)

  model.traverse( function( node ) {
    if ( node.isMesh ) { node.castShadow = true; model.scale.set(0.2, 0.2, 0.2)}
  } );
  scene.add(model); 
  
  const robot = new CharacterControls(gltf.animations, model)

  //Animate (constantly checks for updates to animations)
  function animate() {
    requestAnimationFrame( animate );
    robot.update();
    renderer.render( scene, camera );
  }

  animate();
  
}, undefined, function(error) {
  console.error('Error loading model:', error);
});





