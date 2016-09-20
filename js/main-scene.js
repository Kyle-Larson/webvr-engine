import Stage from './stage';
import SimObject from './sim-object';
import { loadScene } from './scene-loader';

let stage = new Stage();

//Loaders
const loadManager = new THREE.LoadingManager();
loadManager.onProgress = (item, loaded, total) => {
  console.log(item, loaded, total);
}
const imageLoader = new THREE.ImageLoader(loadManager);
const objLoader = new THREE.OBJLoader(loadManager);


//SimObjects
var simObjects = [];
let boxTexture = new THREE.Texture();
const boxSize = 25;
boxTexture.wrapS = THREE.RepeatWrapping;
boxTexture.wrapT = THREE.RepeatWrapping;
boxTexture.repeat.set(boxSize, boxSize);

loadScene("Test-Scene-01", (data) => {
  imageLoader.load('img/box2.png', (image) => {
    boxTexture.image = image;
    boxTexture.needsUpdate = true;
  });
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const material = new THREE.MeshBasicMaterial({
    map: boxTexture,
    color: data.skybox.material,
    side: THREE.BackSide
  });

  stage.setSkybox(new THREE.Mesh(geometry, material));

  data.objects.forEach((object, index, array) => {
    const simObj = new SimObject(stage.scene);
    simObj.setMesh(new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshNormalMaterial()
    ));
    simObj.position.set(object.position[0], object.position[1], object.position[2]);
    simObjects.push(simObj);
  });

  simObjects.forEach((object, index, array) => {
    object.setUpdate(function (deltaTime) {
      this.rotation.y += (deltaTime * 0.0006);
    });
  });

  objLoader.load('../models/cube/cube.obj', (object) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        let simObj = new SimObject(stage.scene);
        child.material = new THREE.MeshBasicMaterial({
          map: boxTexture,
          color: 0xCC0000
        });
        simObj.setMesh(child);
        simObj.position.y = 1.5;
        simObj.position.x = 1;
        simObj.scale.set(.1, .1, .1);
        simObjects.push(simObj);
      }
    });
  });
});

// var cube = new SimObject(stage.scene);

// var boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// var boxMaterial = new THREE.MeshNormalMaterial();
// cube.setMesh(new THREE.Mesh(boxGeometry, boxMaterial));

// cube.position.set(0, stage.controls.userHeight, -1);

// simObjects.push(cube);

function update(deltaTime) {
  simObjects.forEach((object, index, array) => {
    object.update(deltaTime);
  });
}

stage.setUpdateLoop(update); //

requestAnimationFrame(stage.update.bind(stage));