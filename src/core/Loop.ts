import { Clock, Scene, WebGLRenderer } from 'three';
import { TCamera } from '@/core/types';

const clock = new Clock();

class Loop {
  camera: TCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  updatableObjects: any[];

  constructor(camera: TCamera, scene: Scene, renderer: WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatableObjects = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    for (const object of this.updatableObjects) {
      object.tick(delta);
    }
  }
}

export default Loop;
