import { CubeTextureLoader, Scene } from 'three';

function createScene() {
  const scene = new Scene();
  scene.background = new CubeTextureLoader()
    .setPath('/scene/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

  return scene;
}

export { createScene };
