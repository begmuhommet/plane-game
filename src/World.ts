import { EventDispatcher, Scene, Vector3, WebGLRenderer } from 'three';
import { createRenderer } from '@/core/renderer';
import { createScene } from '@/components/createScene';
import { createLights } from '@/components/createLights';
import Loop from '@/core/Loop';
import Resizer from '@/core/Resizer';
import CameraController from '@/components/CameraController';
import settings from '@/data/settings';
import Plane from '@/components/Plane';
import Obstacles from '@/components/Obstacles';

export let worldInstance: World | null = null;

export class World extends EventDispatcher {
  renderer: WebGLRenderer;
  scene: Scene;
  loop: Loop | null = null;

  cameraController: CameraController | null = null;
  resizer: Resizer | null = null;
  plane: Plane;
  container: Element;
  obstacles: Obstacles;

  loading = false;
  active = false;

  planeCount = 3;
  starCount = 0;

  constructor(container: Element) {
    super();
    if (worldInstance === null) {
      worldInstance = this;
    }
    this.container = container;
    this.renderer = createRenderer();
    this.scene = createScene();
    this.plane = new Plane();
    this.obstacles = new Obstacles(this.scene);

    this.obstacles.addEventListener('inc_score', () => this.incScore());
    this.obstacles.addEventListener('dec_score', () => this.decScore());
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
    this.loop.addUpdatableObject(this.obstacles);
    this.cameraController.setControllerPosition();
    this.setLoading(false);
  }

  incScore() {
    this.starCount++;
    this.dispatchEvent({ type: 'score_inc', count: this.starCount });
  }

  decScore() {
    // if (this.planeCount > 1) {
    //   this.planeCount--;
    // } else {
    //   this.setActive(false);
    //   this.stop();
    //   this.planeCount = 3;
    //   this.starCount = 0;
    // }
    this.planeCount--;
    this.dispatchEvent({ type: 'score_dec', count: this.planeCount });
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  setActive(value: boolean) {
    this.active = value;
    this.plane?.setIsGameActive(value);
  }

  resetScore() {
    this.planeCount = 3;
    this.starCount = 0;
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
