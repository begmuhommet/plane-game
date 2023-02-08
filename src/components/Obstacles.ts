import { Group, LoadingManager, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Obstacles {
  star: Group | null = null;
  bomb: Group | null = null;
  obstacles: Group[] = [];
  loader: GLTFLoader;
  scene: Scene;
  obstacleSpawn = { pos: 20, offset: 5 };

  constructor(scene: Scene) {
    this.scene = scene;
    const loadingManager = new LoadingManager();
    this.loader = new GLTFLoader(loadingManager);
  }

  async loadStar() {
    const model = await this.loader.loadAsync('/assets/star.glb');
    this.star = model.scene;
    if (this.bomb) {
      this.initialize();
    }
  }

  async loadBomb() {
    const model = await this.loader.loadAsync('/assets/bomb.glb');
    this.bomb = model.scene;
    if (this.star) {
      this.initialize();
    }
  }

  initialize() {
    if (!this.bomb || !this.star) {
      return;
    }

    const obstacle = new Group();
    obstacle.add(this.star);

    this.bomb.rotation.x = -Math.PI * 0.5;
    this.bomb.position.y = 7.5;
    obstacle.add(this.bomb);

    let rotate = true;

    for (let y = 5; y > -8; y -= 2.5) {
      rotate = !rotate;
      if (y === 0) continue;
      const bomb = this.bomb.clone();
      bomb.rotation.x = rotate ? -Math.PI * 0.5 : 0;
      bomb.position.y = y;
      obstacle.add(bomb);
    }

    this.obstacles.push(obstacle);
    this.scene.add(obstacle);

    for (let i = 0; i < 30; i++) {
      const newObstacle = obstacle.clone();
      this.scene.add(newObstacle);
      this.obstacles.push(newObstacle);
    }

    this.reset();
  }

  reset() {
    this.obstacles.forEach(obstacle => this.respawnObstacle(obstacle));
  }

  respawnObstacle(obstacle: Group) {
    this.obstacleSpawn.pos += 30;
    const offset = (Math.random() * 2 - 1) * this.obstacleSpawn.offset;
    this.obstacleSpawn.offset += 0.2;
    obstacle.position.set(0, offset, this.obstacleSpawn.pos);
    obstacle.children[0].rotation.y = Math.random() * Math.PI * 2;
    obstacle.userData.hit = false;
    obstacle.children.forEach(child => (child.visible = true));
  }
}

export default Obstacles;
