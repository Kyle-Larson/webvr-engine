import SimObject from './sim-object';

class Camera extends SimObject {
  constructor(scene) {
    super(scene);
    this.threeCam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.controls = new THREE.VRControls(this.threeCam);
    this.controls.standing = true;

    this.raycaster = new THREE.Raycaster();
  }

  onResize(e) {
    this.threeCam.aspect = window.innerWidth / window.innerHeight;
    this.threeCam.updateProjectionMatrix();
  }

  update(deltaTime) {
    this.controls.update();
  }

  checkRaycast(scene) {

    this.raycaster.setFromCamera({x: 0, y: 0}, this.threeCam);
    
    let intersects = this.raycaster.intersectObjects(scene.children, true);

    intersects.forEach((object) => {
      if(object.object instanceof SimObject &&
      object.object.cameracast) {
        object.object.cameracast();
      }
      object.object.traverseAncestors((obj) => {
        if(obj instanceof SimObject &&
        obj.cameracast) {
          obj.cameracast();
        }
      });
    })
  }
}

export default Camera;