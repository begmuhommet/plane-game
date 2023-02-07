import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TCamera } from '@/core/types';

function createControls(camera: TCamera, canvas: HTMLCanvasElement) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;

  // forward controls.update to our custom .tick method
  (controls as any).tick = () => controls.update();

  return controls;
}

export { createControls };
