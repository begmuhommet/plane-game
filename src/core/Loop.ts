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

  addUpdatableObject = (object: any) => {
    this.updatableObjects.push(object);
  };

  start() {
    this.renderer.setAnimationLoop(() => this.update());
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  update() {
    this.tick();
    this.renderer.render(this.scene, this.camera);
  }

  tick() {
    const delta = clock.getElapsedTime();
    for (const object of this.updatableObjects) {
      object.tick(delta);
    }
  }
}

export default Loop;
