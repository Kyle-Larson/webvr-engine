(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simObject = require('./sim-object');

var _simObject2 = _interopRequireDefault(_simObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = function (_SimObject) {
  _inherits(Camera, _SimObject);

  function Camera(scene) {
    _classCallCheck(this, Camera);

    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this, scene));

    _this.threeCam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    _this.controls = new THREE.VRControls(_this.threeCam);
    _this.controls.standing = true;

    _this.raycaster = new THREE.Raycaster();
    return _this;
  }

  _createClass(Camera, [{
    key: 'onResize',
    value: function onResize(e) {
      this.threeCam.aspect = window.innerWidth / window.innerHeight;
      this.threeCam.updateProjectionMatrix();
    }
  }, {
    key: 'update',
    value: function update(deltaTime) {
      this.controls.update();
    }
  }, {
    key: 'checkRaycast',
    value: function checkRaycast(scene) {

      this.raycaster.setFromCamera({ x: 0, y: 0 }, this.threeCam);

      var intersects = this.raycaster.intersectObjects(scene.children, true);

      intersects.forEach(function (object) {
        if (object.object instanceof _simObject2.default && object.object.cameracast) {
          object.object.cameracast();
        }
        object.object.traverseAncestors(function (obj) {
          if (obj instanceof _simObject2.default && obj.cameracast) {
            obj.cameracast();
          }
        });
      });
    }
  }]);

  return Camera;
}(_simObject2.default);

exports.default = Camera;

},{"./sim-object":4}],2:[function(require,module,exports){
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

    simObjects[2].setOnCameracast(function () {
      var geometry = this.getMesh().geometry;
      var material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xFFFFFF << 0
      });

      this.setMesh(new THREE.Mesh(geometry, material));
    });
  });
});

function update(deltaTime) {
  simObjects.forEach(function (object, index, array) {
    object.update(deltaTime);
  });
}

stage.setUpdateLoop(update); //

requestAnimationFrame(stage.update.bind(stage));

},{"./scene-loader":3,"./sim-object":4,"./stage":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
    _this.cameracast = null;
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
    key: "setOnCameracast",
    value: function setOnCameracast(func) {
      this.cameracast = func;
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _camera = require('./camera');

var _camera2 = _interopRequireDefault(_camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stage = function () {
  function Stage() {
    _classCallCheck(this, Stage);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.lastRender = 0;

    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('touchstart', this.onTouch.bind(this), false);
    this.scene = new THREE.Scene();
    this.camera = new _camera2.default(this.scene);
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
      this.camera.onResize(e);
      this.effect.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'update',
    value: function update(timestamp) {
      var deltaTime = Math.min(timestamp - this.lastRender, 500);
      this.lastRender = timestamp;

      this.updateLoop(deltaTime);

      this.camera.update(deltaTime);
      this.manager.render(this.scene, this.camera.threeCam, timestamp);

      requestAnimationFrame(this.update.bind(this));
    }
  }, {
    key: 'setUpdateLoop',
    value: function setUpdateLoop(func) {
      this.updateLoop = func;
    }
  }, {
    key: 'onTouch',
    value: function onTouch(evt) {
      evt.preventDefault();
      console.log("Canvas touched!");

      this.camera.checkRaycast(this.scene);
    }
  }]);

  return Stage;
}();

exports.default = Stage;

},{"./camera":1}]},{},[2]);
