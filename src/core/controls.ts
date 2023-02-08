import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TCamera } from '@/core/types';

function createControls(camera: TCamera, canvas: HTMLCanvasElement) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  return { controls, tick: () => tick(controls) };
}

function tick(controls: OrbitControls) {
  controls.update();
}

export { createControls };
