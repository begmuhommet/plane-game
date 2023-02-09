import { EventDispatcher, Group, LoadingManager, Object3D, Scene, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { worldInstance } from '@/World';

class Obstacles extends EventDispatcher {
  star: Group | null = null;
  bomb: Group | null = null;
  obstacles: Group[] = [];
  loader: GLTFLoader;
  scene: Scene;
  tmpPos = new Vector3();
  obstacleSpawn = { pos: 20, offset: 5 };

  constructor(scene: Scene) {
    super();
    this.scene = scene;
    const loadingManager = new LoadingManager();
    this.loader = new GLTFLoader(loadingManager);
  }

  async loadStar() {
    const model = await this.loader.loadAsync('/assets/star.glb');
    this.star = model.scene;
    this.star.name = 'Star';
    if (this.bomb) {
      this.initialize();
    }
  }

  async loadBomb() {
    const model = await this.loader.loadAsync('/assets/bomb.glb');
    this.bomb = model.scene;
    this.bomb.name = 'Bomb';
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

    for (let i = 0; i < 3; i++) {
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

  tick() {
    let collisionObstacle: Group;
    const plane = worldInstance?.plane.scene;
    if (!plane) {
      return;
    }
    this.obstacles.forEach(obstacle => {
      obstacle.children[0].rotateY(0.01);
      const relPositionZ = obstacle.position.z - plane.position.z;
      if (Math.abs(relPositionZ) < 2 && !obstacle.userData.hit) {
        collisionObstacle = obstacle;
      }
      if (relPositionZ < -20) {
        this.respawnObstacle(obstacle);
      }
    });

    // @ts-ignore
    if (collisionObstacle) {
      collisionObstacle.children.some(child => {
        child.getWorldPosition(this.tmpPos);
        const dist = this.tmpPos.distanceToSquared(plane.position);
        if (dist < 5) {
          collisionObstacle.userData.hit = true;
          this.hit(child);
        }
      });
    }
  }

  hit(obj: Object3D) {
    if (obj.name === 'Star') {
      this.dispatchEvent({ type: 'inc_score' });
    } else {
      this.dispatchEvent({ type: 'dec_score' });
    }
    obj.visible = false;
  }
}

export default Obstacles;
