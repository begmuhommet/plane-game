import { Scene, Vector3, WebGLRenderer } from 'three';
import { createRenderer } from '@/core/renderer';
import { createScene } from '@/components/createScene';
import { createLights } from '@/components/createLights';
import Loop from '@/core/Loop';
import Resizer from '@/core/Resizer';
import CameraController from '@/components/CameraController';
import settings from '@/data/settings';
import Plane from '@/components/Plane';
import Obstacles from '@/components/Obstacles';

class World {
  protected renderer: WebGLRenderer;
  protected scene: Scene;
  protected loop: Loop | null = null;

  protected cameraController: CameraController | null = null;
  protected resizer: Resizer | null = null;
  protected plane: Plane;
  protected container: Element;
  obstacles: Obstacles;

  protected loading = false;
  protected active = false;

  planeCount = 3;
  starCount = 0;

  constructor(container: Element) {
    this.container = container;
    this.renderer = createRenderer();
    this.scene = createScene();
    this.plane = new Plane();
    this.obstacles = new Obstacles(this.scene);
  }

  async init() {
    this.setLoading(true);

    await this.plane.loadModel();
    this.scene.add(this.plane.scene);

    await this.obstacles.loadStar();
    await this.obstacles.loadBomb();

    this.cameraController = new CameraController(75, settings.aspect, 0.1, 100, this.plane.scene.position);
    this.scene.add(this.cameraController.controller);

    this.cameraController.setControllerPosition();
    this.cameraController.setCameraPosition(new Vector3(-4.37, 0, -4.57), new Vector3(0, 0, 6));

    this.loop = new Loop(this.cameraController.camera, this.scene, this.renderer);

    this.container.append(this.renderer.domElement);

    const { ambientLight, mainLight } = createLights();
    this.scene.add(ambientLight, mainLight);

    this.resizer = new Resizer(this.container, this.cameraController.camera, this.renderer);

    this.loop.addUpdatableObject(this.plane);
    this.loop.addUpdatableObject(this.cameraController);
    this.cameraController.setControllerPosition();
    this.setLoading(false);
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  setActive(value: boolean) {
    this.active = value;
    this.plane?.setIsGameActive(value);
  }

  render() {
    if (this.cameraController) {
      this.renderer.render(this.scene, this.cameraController.camera);
    }
  }

  start() {
    if (this.loop) {
      this.loop.start();
    }
  }

  stop() {
    if (this.loop) {
      this.loop.stop();
    }
  }
}

export default World;
