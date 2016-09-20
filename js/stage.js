import Camera from './camera';

class Stage {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.lastRender = 0;

    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('touchstart', this.onTouch.bind(this), false);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.scene);
    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(window.innerWidth, window.innerHeight);

    this.skybox = null;

    this.updateLoop = (deltaTime) => { };

    this.manager = new WebVRManager(this.renderer, this.effect, {
      hideButton: false,
      isUndistorted: false
    });

    window.addEventListener('resize', this.onResize.bind(this), true);
    window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
  }

  setSkybox(mesh) {
    this.scene.remove(this.skybox);
    this.skybox = mesh;
    this.camera.getWorldPosition(this.skybox.position);
    this.scene.add(this.skybox);

    var self = this;

    navigator.getVRDisplays().then((displays) => {
      if (displays.length > 0) {
        let display = displays[0];
        if (display.stageParameters) {
          let material = self.skybox.material;
          self.scene.remove(self.skybox);

          let geometry = new THREE.BoxGeometry(display.stageParameters.sizeX, 5, display.stageParameters.sizeZ);
          self.skybox = new THREE.Mesh(geometry, material);

          self.skybox.position = self.camera.position;
          self.scene.add(self.skybox);
        }
      }
    });
  }

  onResize(e) {
    this.camera.onResize(e);
    this.effect.setSize(window.innerWidth, window.innerHeight);
  }

  update(timestamp) {
    var deltaTime = Math.min(timestamp - this.lastRender, 500);
    this.lastRender = timestamp;

    this.updateLoop(deltaTime);

    this.camera.update(deltaTime);
    this.manager.render(this.scene, this.camera.threeCam, timestamp);

    requestAnimationFrame(this.update.bind(this));
  }

  setUpdateLoop(func) {
    this.updateLoop = func;
  }

  onTouch(evt) {
    evt.preventDefault();
    console.log("Canvas touched!");

    this.camera.checkRaycast(this.scene);
  }
}

export default Stage;