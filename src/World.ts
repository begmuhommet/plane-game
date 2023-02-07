import { Scene, WebGLRenderer } from 'three';
import { createCamera } from '@/components/createCamera';
import { createRenderer } from '@/core/renderer';
import { createScene } from '@/components/createScene';
import { createLights } from '@/components/createLights';
import Loop from '@/core/Loop';
import { TCamera } from '@/core/types';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createControls } from '@/core/controls';
import Resizer from '@/core/Resizer';

class World {
  camera: TCamera;
  renderer: WebGLRenderer;
  scene: Scene;
  loop: Loop;
  controls: OrbitControls;
  resizer: Resizer;

  constructor(container: Element) {
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.scene = createScene();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.controls = createControls(this.camera, this.renderer.domElement);

    container.append(this.renderer.domElement);

    const { ambientLight, mainLight } = createLights();
    this.loop.updatableObjects.push(this.controls);
    this.scene.add(ambientLight, mainLight);
    this.resizer = new Resizer(container, this.camera, this.renderer);
  }

  async init() {
    // const { parrot, flamingo, stork } = await loadBirds();
    // move the target to the center of the front bird
    // controls.target.copy(parrot.position);
    // scene.add(parrot, flamingo, stork);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export default World;
