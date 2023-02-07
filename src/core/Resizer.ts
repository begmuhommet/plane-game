import { TCamera } from '@/core/types';
import { PerspectiveCamera, WebGLRenderer } from 'three';

const setSize = (container: Element, camera: TCamera, renderer: WebGLRenderer) => {
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = container.clientWidth / container.clientHeight;
  }

  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container: Element, camera: TCamera, renderer: WebGLRenderer) {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}
}

export default Resizer;
