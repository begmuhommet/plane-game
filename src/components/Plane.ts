import { Group, LoadingManager, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Plane {
  loadingManager: LoadingManager;
  loader: GLTFLoader;
  scene: Group;

  velocity: Vector3;
  keyPressed = false;
  isGameActive = false;

  constructor() {
    this.loadingManager = new LoadingManager();
    this.loader = new GLTFLoader(this.loadingManager);
    this.velocity = new Vector3(0, 0, 0.1);
    this.scene = new Group();
    this.addEvents();
  }

  async loadModel() {
    const plane = await this.loader.loadAsync('/assets/plane.glb');
    this.scene = plane.scene;
  }

  addEvents() {
    document.addEventListener('mousedown', this.mouseDown.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));
    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));
  }

  mouseDown(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this.setKeyPressed(true);
    }
  }

  mouseUp(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this.setKeyPressed(false);
    }
  }

  keyDown(event: KeyboardEvent) {
    if (event.code.toLowerCase() === 'space') {
      this.setKeyPressed(true);
    }
  }

  keyUp(event: KeyboardEvent) {
    if (event.code.toLowerCase() === 'space') {
      this.setKeyPressed(false);
    }
  }

  setKeyPressed = (value: boolean) => {
    this.keyPressed = value;
  };

  setIsGameActive(value: boolean) {
    this.isGameActive = value;
  }

  tick(time: number) {
    const propeller = this.scene.getObjectByName('propeller');
    const zRotation = Math.sin(time * 3) * 0.1;
    const yPosition = Math.sin(time);

    if (propeller) {
      propeller.rotateZ(2);
    }

    if (!this.isGameActive) {
      this.scene.rotation.set(0, 0, zRotation, 'XYZ');
      this.scene.position.y = yPosition;
      return;
    }

    if (this.keyPressed) {
      this.velocity.y += 0.0002;
    } else {
      this.velocity.y -= 0.0002;
    }

    this.velocity.z += 0.000001;
    this.scene.rotation.set(0, 0, zRotation, 'XYZ');
    this.scene.translateZ(this.velocity.z);
    this.scene.translateY(this.velocity.y);
  }
}

export default Plane;
