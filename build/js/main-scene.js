(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stage = require('./stage');

var _stage2 = _interopRequireDefault(_stage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stage = new _stage2.default();

//Loading Textures
// // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// // Only enable it if you actually need to.
// var renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setPixelRatio(window.devicePixelRatio);

// // Append the canvas element created by the renderer to document body element.
// document.body.appendChild(renderer.domElement);

// // Create a three.js scene.
// var scene = new THREE.Scene();

// // Create a three.js camera.
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// // Apply VR headset positional data to camera.
// var controls = new THREE.VRControls(camera);
// controls.standing = true;

// // Apply VR stereo rendering to renderer.
// var effect = new THREE.VREffect(renderer);
// effect.setSize(window.innerWidth, window.innerHeight);

// //load in scene details
// var sceneData;
// var sceneObjects=[];


// var oReq = new XMLHttpRequest();
// oReq.onload = reqListener;
// oReq.open("get", "../json/scenes/Test-Scene-01.json", true);
// oReq.send();

// function reqListener(e) {
//     sceneData = JSON.parse(this.responseText);
//     loadSkybox();
//     loadObjects();
//     loadModel();
// }


// // Add a repeating grid as a skybox.
// function loadSkybox(){
//     var boxSize = 25;
//     var loader = new THREE.TextureLoader();
//     loader.load('img/box2.png', onTextureLoaded);
//     var skycolor=sceneData.skybox.material;
//     function onTextureLoaded(texture) {
//       texture.wrapS = THREE.RepeatWrapping;
//       texture.wrapT = THREE.RepeatWrapping;
//       texture.repeat.set(boxSize, boxSize);

//       var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
//       var material = new THREE.MeshBasicMaterial({
//         map: texture,
//         color: skycolor,
//         side: THREE.BackSide
//       });

//       // Align the skybox to the floor (which is at y=0).
//       skybox = new THREE.Mesh(geometry, material);
//       skybox.position.y = boxSize/2;
//       scene.add(skybox);
//       }
//       // For high end VR devices like Vive and Oculus, take into account the stage
//       // parameters provided.
//       setupStage();
// }


// // Create a VR manager helper to enter and exit VR mode.
// var params = {
//   hideButton: false, // Default: false.
//   isUndistorted: false // Default: false.
// };
// var manager = new WebVRManager(renderer, effect, params);
// function loadModel(){
//   var manager = new THREE.LoadingManager();
//         manager.onProgress = function ( item, loaded, total ) {

//           console.log( item, loaded, total );

//         };

//         var texture = new THREE.Texture();

//         var onProgress = function ( xhr ) {
//           if ( xhr.lengthComputable ) {
//             var percentComplete = xhr.loaded / xhr.total * 100;
//             console.log( Math.round(percentComplete, 2) + '% downloaded' );
//           }
//         };

//         var onError = function ( xhr ) {
//         };


//         var loader = new THREE.ImageLoader( manager );
//         loader.load( 'img/box2.png', function ( image ) {

//           texture.image = image;
//           texture.needsUpdate = true;

//         } );

//         // model

//         var loader = new THREE.OBJLoader( manager );
//         loader.load( '../models/cube/cube.obj', function ( object ) {

//           object.traverse( function ( child ) {

//             if ( child instanceof THREE.Mesh ) {

//               child.material = new THREE.MeshBasicMaterial(
//                 {
//                   map:texture

//                 });

//             }

//           } );

//           object.position.y = 1.5;
//           object.position.x = 1;
//           object.scale.set(.1, .1, .1);
//           sceneObjects.push(object);
//           scene.add( object );

//         }, onProgress, onError );
// }
//    // Create 3D objects.
//     //var geometry, material;
//     //var cube = new THREE.Mesh(geometry, material);
// function loadObjects(){
//     for(var i=0; i<sceneData.objects.length; i++){
//       object=sceneData.objects[i];
//       var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
//       var material = new THREE.MeshNormalMaterial();
//       var sceneObj = new THREE.Mesh(geometry, material);

//       // Position cube mesh to be right in front of you.
//       sceneObj.position.set(object.position[0], object.position[1], object.position[2]);

//       // Add cube mesh to your three.js scene
//       sceneObjects.push(sceneObj);
//       scene.add(sceneObj);
//     }
//   console.log(sceneObjects);
// }


// // Kick off animation loop
// requestAnimationFrame(animate);

// window.addEventListener('resize', onResize, true);
// window.addEventListener('vrdisplaypresentchange', onResize, true);

// // Request animation frame loop function
// var lastRender = 0;
// function animate(timestamp) {
//   var delta = Math.min(timestamp - lastRender, 500);
//   lastRender = timestamp;

//   //Log fps
//   //console.log("FPS: " + 1000 / delta);

//   // Apply rotation to cube mesh
//   for(var i=0; i<sceneObjects.length; i++){
//     sceneObjects[i].rotation.y += delta * 0.0006;
//   }
//   // Update VR headset position and apply to camera.
//   controls.update();

//   // Render the scene through the manager.
//   manager.render(scene, camera, timestamp);

//   requestAnimationFrame(animate);
// }

// function onResize(e) {
//   effect.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// }

// var display;

// // Get the HMD, and if we're dealing with something that specifies
// // stageParameters, rearrange the scene.
// function setupStage() {
//   navigator.getVRDisplays().then(function(displays) {
//     if (displays.length > 0) {
//       display = displays[0];
//       if (display.stageParameters) {
//         setStageDimensions(display.stageParameters);
//       }
//     }
//   });
// }

// function setStageDimensions(stage) {
//   // Make the skybox fit the stage.
//   var material = skybox.material;
//   scene.remove(skybox);

//   // Size the skybox according to the size of the actual stage.
//   var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
//   skybox = new THREE.Mesh(geometry, material);

//   // Place it on the floor.
//   skybox.position.y = boxSize/2;
//   scene.add(skybox);

//   // Place the cube in the middle of the scene, at user height.
//   cube.position.set(0, controls.userHeight, 0);
// }

var texLoader = new THREE.TextureLoader();
texLoader.load('img/box2.png', function (texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);

  var geometry = new THREE.BoxGeometry(5, 5, 5);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x123456,
    side: THREE.BackSide
  });

  stage.setSkybox(new THREE.Mesh(geometry, material));
});

//Loading models
var modelManager = new THREE.LoadingManager();
modelManager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};

var texture = new THREE.Texture();
var textureLoader = new THREE.ImageLoader(modelManager);
textureLoader.load('img/box2.png', function (image) {
  texture.image = image;
  texture.needsUpdate = true;
});

var modelLoader = new THREE.OBJLoader(modelManager);
modelLoader.load('../models/cube/cube.obj', function (object) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshBasicMaterial({
        map: texture
      });
    }
  });

  object.position.y = stage.controls.userHeight;
  object.position.x = 0.5;
  object.scale.set(0.1, 0.1, 0.1);
  stage.scene.add(object);
});

var boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var boxMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(boxGeometry, boxMaterial);

cube.position.set(0, stage.controls.userHeight, -1);

stage.scene.add(cube);

function update(deltaTime) {
  cube.rotation.y += deltaTime * 0.0006;
}

stage.setUpdateLoop(update); //

requestAnimationFrame(stage.update.bind(stage));

},{"./stage":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stage = function () {
  function Stage() {
    _classCallCheck(this, Stage);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.lastRender = 0;

    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.controls = new THREE.VRControls(this.camera);
    this.controls.standing = true;
    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(window.innerWidth, window.innerHeight);

    this.skybox = null;

    this.updateLoop = function (deltaTime) {};

    this.manager = new WebVRManager(this.renderer, this.effect, {
      hideButton: false,
      isUndistorted: false
    });

    window.addEventListener('resize', this.onResize.bind(this), true);
    window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
  }

  _createClass(Stage, [{
    key: 'setSkybox',
    value: function setSkybox(mesh) {
      this.scene.remove(this.skybox);
      this.skybox = mesh;
      this.camera.getWorldPosition(this.skybox.position);
      this.scene.add(this.skybox);

      var self = this;

      navigator.getVRDisplays().then(function (displays) {
        if (displays.length > 0) {
          var display = displays[0];
          if (display.stageParameters) {
            var material = self.skybox.material;
            self.scene.remove(self.skybox);

            var geometry = new THREE.BoxGeometry(display.stageParameters.sizeX, 5, display.stageParameters.sizeZ);
            self.skybox = new THREE.Mesh(geometry, material);

            self.skybox.position = self.camera.position;
            self.scene.add(self.skybox);
          }
        }
      });
    }
  }, {
    key: 'onResize',
    value: function onResize(e) {
      this.effect.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
  }, {
    key: 'update',
    value: function update(timestamp) {
      var deltaTime = Math.min(timestamp - this.lastRender, 500);
      this.lastRender = timestamp;

      this.updateLoop(deltaTime);

      this.controls.update();
      this.manager.render(this.scene, this.camera, timestamp);

      requestAnimationFrame(this.update.bind(this));
    }
  }, {
    key: 'setUpdateLoop',
    value: function setUpdateLoop(func) {
      this.updateLoop = func;
    }
  }]);

  return Stage;
}();

exports.default = Stage;

},{}]},{},[1]);
