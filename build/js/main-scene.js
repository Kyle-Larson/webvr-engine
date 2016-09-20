(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _stage = require('./stage');

var _stage2 = _interopRequireDefault(_stage);

var _simObject = require('./sim-object');

var _simObject2 = _interopRequireDefault(_simObject);

var _sceneLoader = require('./scene-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stage = new _stage2.default();

//Loaders
var loadManager = new THREE.LoadingManager();
loadManager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
var imageLoader = new THREE.ImageLoader(loadManager);
var objLoader = new THREE.OBJLoader(loadManager);

//SimObjects
var simObjects = [];
var boxTexture = new THREE.Texture();
var boxSize = 25;
boxTexture.wrapS = THREE.RepeatWrapping;
boxTexture.wrapT = THREE.RepeatWrapping;
boxTexture.repeat.set(boxSize, boxSize);

(0, _sceneLoader.loadScene)("Test-Scene-01", function (data) {
  imageLoader.load('img/box2.png', function (image) {
    boxTexture.image = image;
    boxTexture.needsUpdate = true;
  });
  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var material = new THREE.MeshBasicMaterial({
    map: boxTexture,
    color: data.skybox.material,
    side: THREE.BackSide
  });

  stage.setSkybox(new THREE.Mesh(geometry, material));

  data.objects.forEach(function (object, index, array) {
    var simObj = new _simObject2.default(stage.scene);
    simObj.setMesh(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial()));
    simObj.position.set(object.position[0], object.position[1], object.position[2]);
    simObjects.push(simObj);
  });

  simObjects.forEach(function (object, index, array) {
    object.setUpdate(function (deltaTime) {
      this.rotation.y += deltaTime * 0.0006;
    });
  });

  objLoader.load('../models/cube/cube.obj', function (object) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        var simObj = new _simObject2.default(stage.scene);
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
  simObjects.forEach(function (object, index, array) {
    object.update(deltaTime);
  });
}

stage.setUpdateLoop(update); //

requestAnimationFrame(stage.update.bind(stage));

},{"./scene-loader":2,"./sim-object":3,"./stage":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadScene = loadScene;
function loadScene(sceneFile, onLoad) {
  var oReq = new XMLHttpRequest();
  oReq.onload = function (e) {
    onLoad(JSON.parse(this.responseText));
  };
  oReq.open("get", "../json/scenes/" + sceneFile + ".json", true);
  oReq.send();
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimObject = function (_THREE$Object3D) {
  _inherits(SimObject, _THREE$Object3D);

  function SimObject(scene) {
    _classCallCheck(this, SimObject);

    var _this = _possibleConstructorReturn(this, (SimObject.__proto__ || Object.getPrototypeOf(SimObject)).call(this));

    scene.add(_this);
    _this.updateFunc = null;
    _this.add(new THREE.Object3D());
    return _this;
  }

  _createClass(SimObject, [{
    key: "setMesh",
    value: function setMesh(mesh) {
      this.remove(this.children[0]);
      this.add(mesh);
    }
  }, {
    key: "getMesh",
    value: function getMesh() {
      return this.children[0];
    }
  }, {
    key: "setUpdate",
    value: function setUpdate(func) {
      this.updateFunc = func;
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      if (this.updateFunc) {
        this.updateFunc(deltaTime);
      }
    }
  }]);

  return SimObject;
}(THREE.Object3D);

exports.default = SimObject;

},{}],4:[function(require,module,exports){
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
