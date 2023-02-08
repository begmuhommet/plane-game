import { sRGBEncoding, WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = sRGBEncoding;

  return renderer;
}

export { createRenderer };
