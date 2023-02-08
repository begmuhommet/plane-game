import { Object3D, PerspectiveCamera, Vector3 } from 'three';

class CameraController {
  camera: PerspectiveCamera;
  controller: Object3D;
  target: Vector3;

  constructor(fov: number, aspect: number, near: number, far: number, target: Vector3) {
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.controller = new Object3D();
    this.controller.add(this.camera);
    this.target = target;
  }

  setControllerPosition() {
    this.controller.position.copy(this.target);
    this.controller.position.y = 0;
  }

  setTargetPosition() {
    this.target.copy(this.target);
    // this.target.z += 0.001;
  }

  setCameraPosition(position: Vector3, lookAt: Vector3) {
    const { x, y, z } = position;
    this.camera.position.set(x, y, z);
    this.camera.lookAt(lookAt);
  }

  tick() {
    this.setControllerPosition();
    this.setTargetPosition();
  }
}

export default CameraController;
