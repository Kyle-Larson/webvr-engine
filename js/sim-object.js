class SimObject extends THREE.Object3D {
  constructor(scene) {
    super();
    scene.add(this);
    this.updateFunc = null;
    this.cameracast = null;
    this.add(new THREE.Object3D());
  }

  setMesh(mesh) {
    this.remove(this.children[0]);
    this.add(mesh);
  }

  getMesh() {
    return this.children[0];
  }

  setUpdate(func) {
    this.updateFunc = func;
  }

  setOnCameracast(func) {
    this.cameracast = func;
  }

  update(deltaTime) {
    if (this.updateFunc) {
      this.updateFunc(deltaTime)
    }
  }
}

export default SimObject;