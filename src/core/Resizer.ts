import { TCamera } from '@/core/types';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import settings from '@/data/settings';

class Resizer {
  constructor(container: Element, camera: TCamera, renderer: WebGLRenderer) {
    this.onResize(container, camera, renderer);
    window.addEventListener('resize', () => this.onResize(container, camera, renderer));
  }

  onResize(container: Element, camera: TCamera, renderer: WebGLRenderer) {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = container.clientWidth / container.clientHeight;
    }

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(settings.pixelRatio);
  }
}

export default Resizer;
