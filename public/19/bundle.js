(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory(require("three"));
	else
		root["app"] = factory(root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 75);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var processShader = __webpack_require__(10);

function Pass() {
  this.shader = null;
  this.loaded = null;
  this.params = {};
  this.isSim = false;
}

module.exports = Pass;

Pass.prototype.setShader = function(vs, fs) {
  this.shader = processShader(vs, fs);
};

Pass.prototype.run = function(composer) {
  composer.pass(this.shader);
};

Pass.prototype.getOfflineTexture = function(w, h, useRGBA) {
  return new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: useRGBA ? THREE.RGBAFormat : THREE.RGBFormat
  });
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}"

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(11);

function CopyPass() {
  Pass.call(this);
  this.setShader(vertex, fragment);
}

module.exports = CopyPass;

CopyPass.prototype = Object.create(Pass.prototype);
CopyPass.prototype.constructor = CopyPass;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.Composer = __webpack_require__(5);
module.exports.CopyPass = __webpack_require__(3);
module.exports.BlendMode = {
  Normal: 1,
  Dissolve: 2, // UNAVAILABLE
  Darken: 3,
  Multiply: 4,
  ColorBurn: 5,
  LinearBurn: 6,
  DarkerColor: 7, // UNAVAILABLE
  Lighten: 8,
  Screen: 9,
  ColorDodge: 10,
  LinearDodge: 11,
  LighterColor: 12, // UNAVAILABLE
  Overlay: 13,
  SoftLight: 14,
  HardLight: 15,
  VividLight: 16, // UNAVAILABLE
  LinearLight: 17,
  PinLight: 18, // UNAVAILABLE
  HardMix: 19, // UNAVAILABLE
  Difference: 20,
  Exclusion: 21,
  Substract: 22, // UNAVAILABLE
  Divide: 23 // UNAVAILABLE
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var CopyPass = __webpack_require__(3);
var Stack = __webpack_require__(12);
var Pass = __webpack_require__(1);

function Composer(renderer, settings) {
  var pixelRatio = renderer.getPixelRatio();

  this.width  = Math.floor(renderer.context.canvas.width  / pixelRatio) || 1;
  this.height = Math.floor(renderer.context.canvas.height / pixelRatio) || 1;

  this.output = null;
  this.input = null;
  this.read = null;
  this.write = null;

  this.settings = settings || {};
  this.useRGBA = this.settings.useRGBA || false;

  this.renderer = renderer;
  this.copyPass = new CopyPass(this.settings);

  this.defaultMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false});
  this.scene = new THREE.Scene();
  this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this.defaultMaterial);
  this.scene.add(this.quad);
  this.camera = new THREE.OrthographicCamera(1, 1, 1, 1, -10000, 10000);

  this.front = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: this.settings.minFilter !== undefined ? this.settings.minFilter : THREE.LinearFilter,
    magFilter: this.settings.magFilter !== undefined ? this.settings.magFilter : THREE.LinearFilter,
    wrapS: this.settings.wrapS !== undefined ? this.settings.wrapS : THREE.ClampToEdgeWrapping,
    wrapT: this.settings.wrapT !== undefined ? this.settings.wrapT : THREE.ClampToEdgeWrapping,
    format: this.useRGBA ? THREE.RGBAFormat : THREE.RGBFormat,
    type: this.settings.type !== undefined ? this.settings.type : THREE.UnsignedByteType,
    stencilBuffer: this.settings.stencilBuffer !== undefined ? this.settings.stencilBuffer : true
  });

  this.back = this.front.clone();
  this.startTime = Date.now();
  this.passes = {};

  this.setSize(this.width, this.height);
}

module.exports = Composer;

Composer.prototype.swapBuffers = function() {
  this.output = this.write;
  this.input = this.read;

  var t = this.write;
  this.write = this.read;
  this.read = t;
};

Composer.prototype.render = function(scene, camera, keep, output) {
  if (keep) this.swapBuffers();
  this.renderer.render(scene, camera, output ? output : this.write, true);
  if (!output) this.swapBuffers();
};

Composer.prototype.toScreen = function() {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = this.read;
  this.quad.material.uniforms.resolution.value.set(this.width, this.height);
  this.renderer.render(this.scene, this.camera);
};

Composer.prototype.toTexture = function(t) {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = this.read;
  this.renderer.render(this.scene, this.camera, t, false);
};

Composer.prototype.pass = function(pass) {
  if (pass instanceof Stack) {
    this.passStack(pass);
  }
  else {
    if (pass instanceof THREE.ShaderMaterial) {
      this.quad.material = pass;
    }
    if (pass instanceof Pass) {
      pass.run(this);
      return;
    }

    if (!pass.isSim) {
      this.quad.material.uniforms.tInput.value = this.read;
    }

    this.quad.material.uniforms.resolution.value.set(this.width, this.height);
    this.quad.material.uniforms.time.value = 0.001 * (Date.now() - this.startTime);
    this.renderer.render(this.scene, this.camera, this.write, false);
    this.swapBuffers();
  }
};

Composer.prototype.passStack = function(stack) {
  stack.getPasses().forEach(function(pass) {
    this.pass(pass);
  }.bind(this));
};

Composer.prototype.reset = function() {
  this.read = this.front;
  this.write = this.back;
  this.output = this.write;
  this.input = this.read;
};

Composer.prototype.setSource = function(src) {
  this.quad.material = this.copyPass.shader;
  this.quad.material.uniforms.tInput.value = src;
  this.renderer.render(this.scene, this.camera, this.write, true);
  this.swapBuffers();
};

Composer.prototype.setSize = function(w, h) {
  this.width = w;
  this.height = h;

  this.camera.projectionMatrix.makeOrthographic( w / - 2, w / 2, h / 2, h / - 2, this.camera.near, this.camera.far );
  this.quad.scale.set( w, h, 1 );

  this.front.setSize( w, h );
  this.back.setSize( w, h );
};



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (window.location.search) {
  var params = window.location.search.substr(1).split('&');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var param = _step.value;

      var _param$split = param.split('='),
          _param$split2 = _slicedToArray(_param$split, 2),
          prop = _param$split2[0],
          value = _param$split2[1];

      if (prop === 'video') {
        document.querySelector('#info').style.display = 'none';
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _stats = __webpack_require__(8);

var _stats2 = _interopRequireDefault(_stats);

var _inject = __webpack_require__(9);

var _inject2 = _interopRequireDefault(_inject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CCAPTURE_OPTIONS = {
  framerate: 60,
  format: 'webm'
};

var App = function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

    if (window.location.search) {
      var params = window.location.search.substr(1).split('&');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var param = _step.value;

          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              prop = _param$split2[0],
              value = _param$split2[1];

          if (prop === 'debug') {
            this.stats = new _stats2.default();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
          }
          if (prop === 'record') {
            (0, _inject2.default)('../scripts/CCapture.all.min.js').then(function () {
              _this.capturer = new window.CCapture(CCAPTURE_OPTIONS);
              _this.capturer.start();
            });
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    this.renderer = new _three.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new _three.Scene();

    this.camera = new _three.PerspectiveCamera(60, this.getAspect(), 0.1, 1000);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.init();

    this.lastTick = 0;
    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  _createClass(App, [{
    key: 'onTick',
    value: function onTick() {
      var t = performance.now();
      var delta = performance.now() - this.lastTick;
      if (this.stats) {
        this.stats.begin();
      }
      this.update(t, delta);
      this.render(t, delta);
      if (this.stats) {
        this.stats.end();
      }
      this.lastTick = t;
      requestAnimationFrame(this.onTick);
      if (this.capturer) {
        this.capturer.capture(this.renderer.domElement);
      }
    }
  }, {
    key: 'getAspect',
    value: function getAspect() {
      return window.innerWidth / window.innerHeight;
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.camera.aspect = this.getAspect();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inject;
function inject(url) {
  return new Promise(function (resolve) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);

module.exports = function processShader(vertexShaderCode, fragmentShaderCode) {

  var regExp = /uniform\s+([^\s]+)\s+([^\s]+)\s*;/gi;
  var regExp2 = /uniform\s+([^\s]+)\s+([^\s]+)\s*\[\s*(\w+)\s*\]*\s*;/gi;

  var typesMap = {
    sampler2D: { type: 't', value: function() { return new THREE.Texture(); } },
    samplerCube: { type: 't', value: function() {} },

    bool: { type: 'b', value: function() { return 0; } },
    int: { type: 'i', value: function() { return 0; } },
    float: { type: 'f', value: function() { return 0; } },

    vec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    vec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    vec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    bvec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    bvec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    bvec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    ivec2: { type: 'v2', value: function() { return new THREE.Vector2(); } },
    ivec3: { type: 'v3', value: function() { return new THREE.Vector3(); } },
    ivec4: { type: 'v4', value: function() { return new THREE.Vector4(); } },

    mat2: { type: 'v2', value: function() { return new THREE.Matrix2(); } },
    mat3: { type: 'v3', value: function() { return new THREE.Matrix3(); } },
    mat4: { type: 'v4', value: function() { return new THREE.Matrix4(); } }
  };

  var arrayTypesMap = {
    float: { type: 'fv', value: function() { return []; } },
    vec3: { type: 'v3v', value: function() { return []; } }
  };

  var matches;
  var uniforms = {
    resolution: { type: 'v2', value: new THREE.Vector2( 1, 1 ), default: true },
    time: { type: 'f', value: Date.now(), default: true },
    tInput: { type: 't', value: new THREE.Texture(), default: true }
  };

  var uniformType, uniformName, arraySize;

  while ((matches = regExp.exec(fragmentShaderCode)) !== null) {
    if (matches.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }
    uniformType = matches[1];
    uniformName = matches[2];

    uniforms[uniformName] = {
      type: typesMap[uniformType].type,
      value: typesMap[uniformType].value()
    };
  }

  while ((matches = regExp2.exec(fragmentShaderCode)) !== null) {
    if (matches.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }
    uniformType = matches[1];
    uniformName = matches[2];
    arraySize = matches[3];

    uniforms[uniformName] = {
      type: arrayTypesMap[uniformType].type,
      value: arrayTypesMap[uniformType].value()
    };
  }

  var shader = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    shading: THREE.FlatShading,
    depthWrite: false,
    depthTest: false,
    transparent: true
  });

  return shader;
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\n\nvoid main() {\n  gl_FragColor = texture2D( tInput, vUv );\n\n}"

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Stack(shadersPool) {
  this.passItems = [];
  this.shadersPool = shadersPool;
  this.passes = [];
}

module.exports = Stack;

Stack.prototype.addPass = function(shaderName, enabled, params, index) {
  var length = 0;
  var passItem = {
    shaderName: shaderName,
    enabled: enabled || false
  };

  // TODO use and store params values

  this.passItems.push(passItem);
  length = this.passItems.length;

  this.updatePasses();

  if (index) {
    return this.movePassToIndex(this.passItems[length], index);
  }
  else {
    return length - 1;
  }
};

Stack.prototype.removePass = function(index) {
  this.passItems.splice(index, 1);
  this.updatePasses();
};

Stack.prototype.enablePass = function(index) {
  this.passItems[index].enabled = true;
  this.updatePasses();
};

Stack.prototype.disablePass = function(index) {
  this.passItems[index].enabled = false;
  this.updatePasses();
};

Stack.prototype.isPassEnabled = function(index) {
  return this.passItems[index].enabled;
};

Stack.prototype.movePassToIndex = function(index, destIndex) {
  this.passItems.splice(destIndex, 0, this.passItems.splice(index, 1)[0]);
  this.updatePasses();

  // TODO check if destIndex is final index
  return destIndex;
};

Stack.prototype.reverse = function() {
  this.passItems.reverse();
  this.updatePasses();
};

Stack.prototype.updatePasses = function() {
  this.passes = this.shadersPool.getPasses(this.passItems);

  // init default params for new passItems
  this.passItems.forEach(function(passItem, index) {
    if (passItem.params === undefined) {
      passItem.params = JSON.parse(JSON.stringify(this.passes[index].params)); // clone params without reference to the real shader instance params
    }
  }.bind(this));
};

Stack.prototype.getPasses = function() {
  return this.passes;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var BoxBlurPass = __webpack_require__(15);

function FullBoxBlurPass(amount) {
  Pass.call(this);

  amount = amount || 2;

  this.boxPass = new BoxBlurPass(amount, amount);
  this.params.amount = amount;
}

module.exports = FullBoxBlurPass;

FullBoxBlurPass.prototype = Object.create(Pass.prototype);
FullBoxBlurPass.prototype.constructor = FullBoxBlurPass;

FullBoxBlurPass.prototype.run = function(composer) {
  var s = this.params.amount;
  this.boxPass.params.delta.set( s, 0 );
  composer.pass( this.boxPass );
  this.boxPass.params.delta.set( 0, s );
  composer.pass( this.boxPass );
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var Composer = __webpack_require__(5);
var BlendMode = __webpack_require__(4).BlendMode;
var FullBoxBlurPass = __webpack_require__(13);
var BlendPass = __webpack_require__(17);
var ZoomBlurPass = __webpack_require__(19);
var BrightnessContrastPass = __webpack_require__(21);

function MultiPassBloomPass(options) {
  Pass.call(this);

  options = options || {};

  this.composer = null;

  this.tmpTexture = this.getOfflineTexture( options.width, options.height, true );
  this.blurPass = new FullBoxBlurPass(2);
  this.blendPass = new BlendPass();
  this.zoomBlur = new ZoomBlurPass();
  this.brightnessContrastPass = new BrightnessContrastPass();

  this.width = options.width || 512;
  this.height = options.height || 512;

  this.params.blurAmount = options.blurAmount || 2;
  this.params.applyZoomBlur = options.applyZoomBlur || false;
  this.params.zoomBlurStrength = options.zoomBlurStrength || 0.2;
  this.params.useTexture = options.useTexture || false;
  this.params.zoomBlurCenter = options.zoomBlurCenter || new THREE.Vector2(0.5, 0.5);
  this.params.blendMode = options.blendMode || BlendMode.Screen;
  this.params.glowTexture = null;
}

module.exports = MultiPassBloomPass;

MultiPassBloomPass.prototype = Object.create(Pass.prototype);
MultiPassBloomPass.prototype.constructor = MultiPassBloomPass;

MultiPassBloomPass.prototype.run = function(composer) {
  if (!this.composer) {
    this.composer = new Composer(composer.renderer, {useRGBA: true});
    this.composer.setSize(this.width, this.height);
  }

  this.composer.reset();

  if (this.params.useTexture === true) {
    this.composer.setSource(this.params.glowTexture);
  } else {
    this.composer.setSource(composer.output);
  }

  this.blurPass.params.amount = this.params.blurAmount;
  this.composer.pass(this.blurPass);
  
  if (this.params.applyZoomBlur) {
    this.zoomBlur.params.center.set(0.5, 0.5);
    this.zoomBlur.params.strength = this.params.zoomBlurStrength;
    this.composer.pass(this.zoomBlur);
  }

  if (this.params.useTexture === true) {
    this.blendPass.params.mode = BlendMode.Screen;
    this.blendPass.params.tInput = this.params.glowTexture;
    composer.pass(this.blendPass);
  }

  this.blendPass.params.mode = this.params.blendMode;
  this.blendPass.params.tInput2 = this.composer.output;
  composer.pass(this.blendPass);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(16);

function BoxBlurPass(deltaX, deltaY) {
  Pass.call(this);

  this.setShader(vertex, fragment);
  this.params.delta = new THREE.Vector2(deltaX || 0, deltaY || 0);
}

module.exports = BoxBlurPass;

BoxBlurPass.prototype = Object.create(Pass.prototype);
BoxBlurPass.prototype.constructor = BoxBlurPass;

BoxBlurPass.prototype.run = function(composer) {
  this.shader.uniforms.delta.value.copy(this.params.delta);
  composer.pass(this.shader);

};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform vec2 delta;\nuniform vec2 resolution;\n\nvoid main() {\n\n  vec4 sum = vec4( 0. );\n  vec2 inc = delta / resolution;\n\n  sum += texture2D( tInput, ( vUv - inc * 4. ) ) * 0.051;\n  sum += texture2D( tInput, ( vUv - inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv - inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv - inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 0. ) ) * 0.1633;\n  sum += texture2D( tInput, ( vUv + inc * 1. ) ) * 0.1531;\n  sum += texture2D( tInput, ( vUv + inc * 2. ) ) * 0.12245;\n  sum += texture2D( tInput, ( vUv + inc * 3. ) ) * 0.0918;\n  sum += texture2D( tInput, ( vUv + inc * 4. ) ) * 0.051;\n\n  gl_FragColor = sum;\n\n}"

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(18);

function BlendPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.params.mode = options.mode || 1;
  this.params.opacity = options.opacity || 1;
  this.params.tInput2 = options.tInput2 || null;
  this.params.resolution2 = options.resolution2 || new THREE.Vector2();
  this.params.sizeMode = options.sizeMode || 1;
  this.params.aspectRatio = options.aspectRatio || 1;
  this.params.aspectRatio2 = options.aspectRatio2 || 1;
}

module.exports = BlendPass;

BlendPass.prototype = Object.create(Pass.prototype);
BlendPass.prototype.constructor = BlendPass;

BlendPass.prototype.run = function(composer) {
  this.shader.uniforms.mode.value = this.params.mode;
  this.shader.uniforms.opacity.value = this.params.opacity;
  this.shader.uniforms.tInput2.value = this.params.tInput2;
  this.shader.uniforms.sizeMode.value = this.params.sizeMode;
  this.shader.uniforms.aspectRatio.value = this.params.aspectRatio;
  this.shader.uniforms.aspectRatio2.value = this.params.aspectRatio2;
  composer.pass(this.shader);
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\nuniform sampler2D tInput2;\nuniform vec2 resolution;\nuniform vec2 resolution2;\nuniform float aspectRatio;\nuniform float aspectRatio2;\nuniform int mode;\nuniform int sizeMode;\nuniform float opacity;\n\nvec2 vUv2;\n\nfloat applyOverlayToChannel( float base, float blend ) {\n\n  return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));\n\n}\n\nfloat applySoftLightToChannel( float base, float blend ) {\n\n  return ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)));\n\n}\n\nfloat applyColorBurnToChannel( float base, float blend ) {\n\n  return ((blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0));\n\n}\n\nfloat applyColorDodgeToChannel( float base, float blend ) {\n\n  return ((blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0));\n\n}\n\nfloat applyLinearBurnToChannel( float base, float blend ) {\n\n  return max(base + blend - 1., 0.0 );\n\n}\n\nfloat applyLinearDodgeToChannel( float base, float blend ) {\n\n  return min( base + blend, 1. );\n\n}\n\nfloat applyLinearLightToChannel( float base, float blend ) {\n\n  return ( blend < .5 ) ? applyLinearBurnToChannel( base, 2. * blend ) : applyLinearDodgeToChannel( base, 2. * ( blend - .5 ) );\n\n}\n\nvoid main() {\n\n  vUv2 = vUv;\n  \n  if( sizeMode == 1 ) {\n    \n    if( aspectRatio2 > aspectRatio ) {\n      vUv2.x = vUv.x * aspectRatio / aspectRatio2;\n      vUv2.x += .5 * ( 1. - aspectRatio / aspectRatio2 ); \n      vUv2.y = vUv.y;\n    }\n\n    if( aspectRatio2 < aspectRatio ) {\n      vUv2.x = vUv.x;\n      vUv2.y = vUv.y * aspectRatio2 / aspectRatio;\n      vUv2.y += .5 * ( 1. - aspectRatio2 / aspectRatio );\n    }\n\n  }\n\n  vec4 base = texture2D( tInput, vUv );\n  vec4 blend = texture2D( tInput2, vUv2 );\n\n  if( mode == 1 ) { // normal\n\n    gl_FragColor = base;\n    gl_FragColor.a *= opacity;\n    return;\n\n  }\n\n  if( mode == 2 ) { // dissolve\n\n  }\n\n  if( mode == 3 ) { // darken\n\n    gl_FragColor = min( base, blend );\n    return;\n\n  }\n\n  if( mode == 4 ) { // multiply\n\n    gl_FragColor = base * blend;\n    return;\n\n  }\n\n  if( mode == 5 ) { // color burn\n\n    gl_FragColor = vec4(\n      applyColorBurnToChannel( base.r, blend.r ),\n      applyColorBurnToChannel( base.g, blend.g ),\n      applyColorBurnToChannel( base.b, blend.b ),\n      applyColorBurnToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 6 ) { // linear burn\n\n    gl_FragColor = max(base + blend - 1.0, 0.0);\n    return;\n\n  }\n\n  if( mode == 7 ) { // darker color\n\n  }\n\n  if( mode == 8 ) { // lighten\n\n    gl_FragColor = max( base, blend );\n    return;\n\n  }\n\n  if( mode == 9 ) { // screen\n\n    gl_FragColor = (1.0 - ((1.0 - base) * (1.0 - blend)));\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 10 ) { // color dodge\n\n    gl_FragColor = vec4(\n      applyColorDodgeToChannel( base.r, blend.r ),\n      applyColorDodgeToChannel( base.g, blend.g ),\n      applyColorDodgeToChannel( base.b, blend.b ),\n      applyColorDodgeToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 11 ) { // linear dodge\n\n    gl_FragColor = min(base + blend, 1.0);\n    return;\n\n  }\n\n  if( mode == 12 ) { // lighter color\n\n  }\n\n  if( mode == 13 ) { // overlay\n\n    gl_FragColor = gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n  \n    return;\n\n  }\n\n  if( mode == 14 ) { // soft light\n\n    gl_FragColor = vec4( \n      applySoftLightToChannel( base.r, blend.r ),\n      applySoftLightToChannel( base.g, blend.g ),\n      applySoftLightToChannel( base.b, blend.b ),\n      applySoftLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 15 ) { // hard light\n\n    gl_FragColor = vec4( \n      applyOverlayToChannel( base.r, blend.r ),\n      applyOverlayToChannel( base.g, blend.g ),\n      applyOverlayToChannel( base.b, blend.b ),\n      applyOverlayToChannel( base.a, blend.a )\n    );\n    gl_FragColor = gl_FragColor * opacity + base * ( 1. - opacity );\n    return;\n\n  }\n\n  if( mode == 16 ) { // vivid light\n\n  }\n\n  if( mode == 17 ) { // linear light\n\n    gl_FragColor = vec4( \n      applyLinearLightToChannel( base.r, blend.r ),\n      applyLinearLightToChannel( base.g, blend.g ),\n      applyLinearLightToChannel( base.b, blend.b ),\n      applyLinearLightToChannel( base.a, blend.a )\n    );\n    return;\n\n  }\n\n  if( mode == 18 ) { // pin light\n\n  }\n\n  if( mode == 19 ) { // hard mix\n\n  }\n\n  if( mode == 20 ) { // difference\n\n    gl_FragColor = abs( base - blend );\n    gl_FragColor.a = base.a + blend.b;\n    return;\n\n  }\n\n  if( mode == 21 ) { // exclusion\n\n    gl_FragColor = base + blend - 2. * base * blend;\n    \n  }\n\n  if( mode == 22 ) { // substract\n\n  }\n\n  if( mode == 23 ) { // divide\n\n  }\n\n  gl_FragColor = vec4( 1., 0., 1., 1. );\n\n}"

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(20);

function ZoomBlurPass(options) {
  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.params.center = new THREE.Vector2(options.centerX || 0.5, options.centerY || 0.5);
  this.params.strength = options.strength || 0.1;
}

module.exports = ZoomBlurPass;

ZoomBlurPass.prototype = Object.create(Pass.prototype);
ZoomBlurPass.prototype.constructor = ZoomBlurPass;

ZoomBlurPass.prototype.run = function(composer) {
  this.shader.uniforms.center.value.set(composer.width * this.params.center.x, composer.height * this.params.center.y);
  this.shader.uniforms.strength.value = this.params.strength;
  composer.pass(this.shader);
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform sampler2D tInput;\nuniform vec2 center;\nuniform float strength;\nuniform vec2 resolution;\nvarying vec2 vUv;\n\nfloat random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}\n\nvoid main(){\n  vec4 color=vec4(0.0);\n  float total=0.0;\n  vec2 toCenter=center-vUv*resolution;\n  float offset=random(vec3(12.9898,78.233,151.7182),0.0);\n  for(float t=0.0;t<=40.0;t++){\n    float percent=(t+offset)/40.0;\n    float weight=4.0*(percent-percent*percent);\n    vec4 sample=texture2D(tInput,vUv+toCenter*percent*strength/resolution);\n    sample.rgb*=sample.a;\n    color+=sample*weight;\n    total+=weight;\n  }\n  gl_FragColor=color/total;\n  gl_FragColor.rgb/=gl_FragColor.a+0.00001;\n}"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pass = __webpack_require__(1);
var vertex = __webpack_require__(2);
var fragment = __webpack_require__(22);

function BrightnessContrastPass(brightness, contrast) {
  Pass.call(this);

  this.setShader(vertex, fragment);

  this.params.brightness = brightness || 1;
  this.params.contrast = contrast || 1;
}

module.exports = BrightnessContrastPass;

BrightnessContrastPass.prototype = Object.create(Pass.prototype);
BrightnessContrastPass.prototype.constructor = BrightnessContrastPass;

BrightnessContrastPass.prototype.run = function(composer) {
  this.shader.uniforms.brightness.value = this.params.brightness;
  this.shader.uniforms.contrast.value = this.params.contrast;
  composer.pass(this.shader);
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float brightness;\nuniform float contrast;\nuniform sampler2D tInput;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 color = texture2D(tInput, vUv).rgb;\n  vec3 colorContrasted = (color) * contrast;\n  vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);\n  gl_FragColor.rgb = bright;\n  gl_FragColor.a = 1.;\n\n}"

/***/ }),
/* 23 */,
/* 24 */
/***/ (function(module, exports) {

module.exports = function( THREE ) {
	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

	function OrbitControls( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {

					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	};

	OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	OrbitControls.prototype.constructor = OrbitControls;

	Object.defineProperties( OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );

	return OrbitControls;
};


/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//  USAGE :
//  https://gist.github.com/Samsy/7219c148e6cbd179883a

//  Port by Samsy for Wagner from http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html



var THREE = __webpack_require__(0);
var Pass = __webpack_require__(1);

var FullBoxBlurPass = __webpack_require__(13);

var vertex = __webpack_require__(2);
var fragment = __webpack_require__(30);

function Godray(options) {

  Pass.call(this);

  options = options || {};

  this.setShader(vertex, fragment);

  this.blurPass = new FullBoxBlurPass(2);

  this.width = options.width || 512;
  this.height = options.height || 512;

  this.params.blurAmount = options.blurAmount || 2;

  this.params.fX = 0.5;
  this.params.fY = 0.5;
  this.params.fExposure = 0.6;
  this.params.fDecay = 0.93;
  this.params.fDensity = 0.88
  this.params.fWeight = 0.4
  this.params.fClamp = 1.0

}

module.exports = Godray;

Godray.prototype = Object.create(Pass.prototype);
Godray.prototype.constructor = Godray;

Godray.prototype.run = function(composer) {

  this.shader.uniforms.fX.value = this.params.fX;
  this.shader.uniforms.fY.value = this.params.fY;
  this.shader.uniforms.fExposure.value = this.params.fExposure;
  this.shader.uniforms.fDecay.value = this.params.fDecay;
  this.shader.uniforms.fDensity.value = this.params.fDensity;
  this.shader.uniforms.fWeight.value = this.params.fWeight;
  this.shader.uniforms.fClamp.value = this.params.fClamp;

  this.blurPass.params.amount = this.params.blurAmount;

  composer.pass(this.blurPass);
  composer.pass(this.blurPass);

  composer.pass(this.shader);

};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tInput;\n\nuniform float fX;\nuniform float fY;\nuniform float fExposure;\nuniform float fDecay;\nuniform float fDensity;\nuniform float fWeight;\nuniform float fClamp;\n\nconst int iSamples = 20;\n\nvoid main()\n{\n\tvec2 deltaTextCoord = vec2(vUv - vec2(fX,fY));\n\tdeltaTextCoord *= 1.0 /  float(iSamples) * fDensity;\n\tvec2 coord = vUv;\n\tfloat illuminationDecay = 1.0;\n\tvec4 FragColor = vec4(0.0);\n\tfor(int i=0; i < iSamples ; i++)\n\t{\n\t\tcoord -= deltaTextCoord;\n\t\tvec4 texel = texture2D(tInput, coord);\n\t\ttexel *= illuminationDecay * fWeight;\n\t\tFragColor += texel;\n\t\tilluminationDecay *= fDecay;\n\t}\n\tFragColor *= fExposure;\n\tFragColor = clamp(FragColor, 0.0, fClamp);\n\tgl_FragColor = FragColor;\n}"

/***/ }),
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  var CopyShader = EffectComposer.CopyShader = __webpack_require__(38)
    , RenderPass = EffectComposer.RenderPass = __webpack_require__(39)(THREE)
    , ShaderPass = EffectComposer.ShaderPass = __webpack_require__(40)(THREE, EffectComposer)
    , MaskPass = EffectComposer.MaskPass = __webpack_require__(41)(THREE)
    , ClearMaskPass = EffectComposer.ClearMaskPass = __webpack_require__(42)(THREE)

  function EffectComposer( renderer, renderTarget ) {
    this.renderer = renderer;

    if ( renderTarget === undefined ) {
      var width = window.innerWidth || 1;
      var height = window.innerHeight || 1;
      var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

      renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );
    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    this.copyPass = new ShaderPass( CopyShader );
  };

  EffectComposer.prototype = {
    swapBuffers: function() {

      var tmp = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = tmp;

    },

    addPass: function ( pass ) {

      this.passes.push( pass );

    },

    insertPass: function ( pass, index ) {

      this.passes.splice( index, 0, pass );

    },

    render: function ( delta ) {

      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;

      var maskActive = false;

      var pass, i, il = this.passes.length;

      for ( i = 0; i < il; i ++ ) {

        pass = this.passes[ i ];

        if ( !pass.enabled ) continue;

        pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

        if ( pass.needsSwap ) {

          if ( maskActive ) {

            var context = this.renderer.context;

            context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

            this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

            context.stencilFunc( context.EQUAL, 1, 0xffffffff );

          }

          this.swapBuffers();

        }

        if ( pass instanceof MaskPass ) {

          maskActive = true;

        } else if ( pass instanceof ClearMaskPass ) {

          maskActive = false;

        }

      }

    },

    reset: function ( renderTarget ) {

      if ( renderTarget === undefined ) {

        renderTarget = this.renderTarget1.clone();

        renderTarget.width = window.innerWidth;
        renderTarget.height = window.innerHeight;

      }

      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();

      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;

    },

    setSize: function ( width, height ) {

      var renderTarget = this.renderTarget1.clone();

      renderTarget.width = width;
      renderTarget.height = height;

      this.reset( renderTarget );

    }

  };

  // shared ortho camera

  EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

  EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );

  EffectComposer.scene = new THREE.Scene();
  EffectComposer.scene.add( EffectComposer.quad );

  return EffectComposer
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

module.exports = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "opacity":  { type: "f", value: 1.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform float opacity;",

    "uniform sampler2D tDiffuse;",

    "varying vec2 vUv;",

    "void main() {",

      "vec4 texel = texture2D( tDiffuse, vUv );",
      "gl_FragColor = opacity * texel;",

    "}"
  ].join("\n")
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function RenderPass( scene, camera, overrideMaterial, clearColor, clearAlpha ) {
    if (!(this instanceof RenderPass)) return new RenderPass(scene, camera, overrideMaterial, clearColor, clearAlpha);

    this.scene = scene;
    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;
    this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

    this.oldClearColor = new THREE.Color();
    this.oldClearAlpha = 1;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

  };

  RenderPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

      this.scene.overrideMaterial = this.overrideMaterial;

      if ( this.clearColor ) {

        this.oldClearColor.copy( renderer.getClearColor() );
        this.oldClearAlpha = renderer.getClearAlpha();

        renderer.setClearColor( this.clearColor, this.clearAlpha );

      }

      renderer.render( this.scene, this.camera, readBuffer, this.clear );

      if ( this.clearColor ) {

        renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

      }

      this.scene.overrideMaterial = null;

    }

  };

  return RenderPass;

};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE, EffectComposer) {
  function ShaderPass( shader, textureID ) {
    if (!(this instanceof ShaderPass)) return new ShaderPass(shader, textureID);

    this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader

    } );

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;

  };

  ShaderPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

      if ( this.uniforms[ this.textureID ] ) {

        this.uniforms[ this.textureID ].value = readBuffer;

      }

      EffectComposer.quad.material = this.material;

      if ( this.renderToScreen ) {

        renderer.render( EffectComposer.scene, EffectComposer.camera );

      } else {

        renderer.render( EffectComposer.scene, EffectComposer.camera, writeBuffer, this.clear );

      }

    }

  };

  return ShaderPass;

};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function MaskPass( scene, camera ) {
    if (!(this instanceof MaskPass)) return new MaskPass(scene, camera);

    this.scene = scene;
    this.camera = camera;

    this.enabled = true;
    this.clear = true;
    this.needsSwap = false;

    this.inverse = false;
  };

  MaskPass.prototype = {

    render: function ( renderer, writeBuffer, readBuffer, delta ) {

      var context = renderer.context;

      // don't update color or depth

      context.colorMask( false, false, false, false );
      context.depthMask( false );

      // set up stencil

      var writeValue, clearValue;

      if ( this.inverse ) {

        writeValue = 0;
        clearValue = 1;

      } else {

        writeValue = 1;
        clearValue = 0;

      }

      context.enable( context.STENCIL_TEST );
      context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
      context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
      context.clearStencil( clearValue );

      // draw into the stencil buffer

      renderer.render( this.scene, this.camera, readBuffer, this.clear );
      renderer.render( this.scene, this.camera, writeBuffer, this.clear );

      // re-enable update of color and depth

      context.colorMask( true, true, true, true );
      context.depthMask( true );

      // only render where stencil is set to 1

      context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
      context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

    }

  };

  return MaskPass
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = function(THREE) {
  function ClearMaskPass() {
    if (!(this instanceof ClearMaskPass)) return new ClearMaskPass(scene, camera);
    this.enabled = true;
  };

  ClearMaskPass.prototype = {
    render: function ( renderer, writeBuffer, readBuffer, delta ) {
      var context = renderer.context;
      context.disable( context.STENCIL_TEST );
    }
  };

  return ClearMaskPass
};

/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(6);

var _three = __webpack_require__(0);

var _ThreeApp2 = __webpack_require__(7);

var _ThreeApp3 = _interopRequireDefault(_ThreeApp2);

var _vert = __webpack_require__(76);

var _vert2 = _interopRequireDefault(_vert);

var _frag = __webpack_require__(77);

var _frag2 = _interopRequireDefault(_frag);

var _wagner = __webpack_require__(4);

var _wagner2 = _interopRequireDefault(_wagner);

var _MultiPassBloomPass = __webpack_require__(14);

var _MultiPassBloomPass2 = _interopRequireDefault(_MultiPassBloomPass);

var _godraypass = __webpack_require__(29);

var _godraypass2 = _interopRequireDefault(_godraypass);

var _threeEffectcomposer = __webpack_require__(37);

var _threeEffectcomposer2 = _interopRequireDefault(_threeEffectcomposer);

var _threeOrbitControls = __webpack_require__(24);

var _threeOrbitControls2 = _interopRequireDefault(_threeOrbitControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EffectComposer = (0, _threeEffectcomposer2.default)(window.THREE);

var OrbitControls = (0, _threeOrbitControls2.default)(window.THREE);
var RenderPass = EffectComposer.RenderPass,
    ShaderPass = EffectComposer.ShaderPass;


var OBJ_PATH = '../assets/fan.obj';
var MODEL_PATH = '../assets/luigi.obj';
var ROOM_SCALE = 2;
var FAN_SCALE = 0.002;
var MODEL_SCALE = 0.01;
var AMBIENT = 0.1;
var DEFAULT_LAYER = 0;
var OCCLUSION_LAYER = 1;
var CLEAR_COLOR = 0x111111;
// Inspired by https://medium.com/@andrew_b_berg/volumetric-light-scattering-in-three-js-6e1850680a41
var projectOnScreen = function projectOnScreen(object, camera) {
  var mat = new _three.Matrix4();
  mat.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
  mat.multiplyMatrices(camera.projectionMatrix, mat);

  var c = mat.elements[15];
  var lPos = new _three.Vector2(mat.elements[12] / c, mat.elements[13] / c);
  lPos.multiplyScalar(0.5);
  lPos.addScalar(0.5);
  return lPos;
};

var AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value: null },
    tAdd: { value: null }
  },

  vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),

  fragmentShader: ["uniform sampler2D tDiffuse;", "uniform sampler2D tAdd;", "varying vec2 vUv;", "void main() {", "vec4 color = texture2D( tDiffuse, vUv );", "vec4 add = texture2D( tAdd, vUv );", "gl_FragColor = color + add;", "}"].join("\n")
};

var OcclusionCloner = function () {
  function OcclusionCloner(scene) {
    _classCallCheck(this, OcclusionCloner);

    this.scene = scene;
    this.objects = new Map();
  }

  _createClass(OcclusionCloner, [{
    key: 'add',
    value: function add(object) {
      var blackMat = new _three.MeshBasicMaterial({ color: 0x000000 });
      if (object.material.opacity !== 1) {
        //  blackMat.color = new Color(0xffffff - (0xffffff * object.material.opacity));
      }
      var clone = new _three.Mesh(object.geometry, blackMat);
      clone.layers.set(OCCLUSION_LAYER);
      clone.matrixAutoUpdate = false;
      this.scene.add(clone);
      this.objects.set(object, clone);
    }
  }, {
    key: 'addLight',
    value: function addLight(light) {
      var clone = new _three.Mesh(new _three.SphereBufferGeometry(0.3, 10, 10), new _three.MeshBasicMaterial({ color: 0xffffff }));
      clone.layers.set(OCCLUSION_LAYER);
      clone.matrixAutoUpdate = false;
      this.scene.add(clone);
      this.objects.set(light, clone);
    }
  }, {
    key: 'update',
    value: function update() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              object = _step$value[0],
              clone = _step$value[1];

          clone.matrix = object.matrix;
          clone.matrixWorld = object.matrixWorld;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return OcclusionCloner;
}();

var VolumetricLightMaterial = new _three.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new _three.Vector2(0.5, 0.5) },
    exposure: { value: 0.1 },
    decay: { value: 0.96 },
    density: { value: 2 },
    weight: { value: 0.5 },
    samples: { value: 100 }
  },
  vertexShader: _vert2.default,
  fragmentShader: _frag2.default
});

var Experiment = function (_ThreeApp) {
  _inherits(Experiment, _ThreeApp);

  function Experiment() {
    _classCallCheck(this, Experiment);

    return _possibleConstructorReturn(this, (Experiment.__proto__ || Object.getPrototypeOf(Experiment)).apply(this, arguments));
  }

  _createClass(Experiment, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      new OrbitControls(this.camera);
      this.renderer.setClearColor(0x222222);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = _three.PCFSoftShadowMap;

      this.occlusionTarget = new _three.WebGLRenderTarget(window.innerWidth * 0.5, window.innerHeight * 0.5);
      this.occlusionComposer = new EffectComposer(this.renderer, this.occlusionTarget);
      this.occlusionComposer.addPass(new RenderPass(this.scene, this.camera));
      var pass = new ShaderPass(VolumetricLightMaterial);
      pass.needsSwap = false;
      this.occlusionComposer.addPass(pass);
      this.volumetricPass = pass;
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      pass = new ShaderPass(AdditiveBlendingShader);
      pass.uniforms.tAdd.value = this.occlusionTarget.texture;
      this.composer.addPass(pass);
      pass.renderToScreen = true;

      this.cloner = new OcclusionCloner(this.scene);
      this.pivot = new _three.Object3D();

      this.objLoader = new THREE.OBJLoader();
      this.objLoader.load(OBJ_PATH, function (model) {
        _this2.fan = model.children[0];
        _this2.fan.material = new _three.MeshStandardMaterial({
          metalness: 0.5,
          roughness: 0.5,
          color: 0x111111
        });
        _this2.fan.scale.set(FAN_SCALE, FAN_SCALE, FAN_SCALE);
        _this2.fan.position.y = 1.7;
        _this2.fan.position.z = -0.1;
        _this2.fan.rotation.x = Math.PI;

        _this2.fan.castShadow = true;
        _this2.scene.add(_this2.fan);
        _this2.cloner.add(_this2.fan);

        _this2.sideFan = _this2.fan.clone();
        _this2.scene.add(_this2.sideFan);
        _this2.sideFan.position.set(0, 1, 1.5);
        _this2.sideFan.rotation.x = -Math.PI / 2;
        _this2.sideFan.castShadow = true;
        _this2.sideLight = new _three.SpotLight({ color: 0xffffff });
        _this2.scene.add(_this2.sideLight);
        _this2.sideLight.position.set(0, 1, 1.8);
        _this2.sideLight.castShadow = true;
      });
      this.objLoader.load(MODEL_PATH, function (model) {
        _this2.model = model.children[0];
        _this2.model.material = new _three.MeshStandardMaterial({
          metalness: 1,
          roughness: 0.4,
          color: 0xDAA520
        });
        _this2.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);

        _this2.model.castShadow = true;
        _this2.model.receiveShadow = true;
        _this2.scene.add(_this2.model);
        _this2.cloner.add(_this2.model);
      });

      this.room = new _three.Mesh(new _three.BoxBufferGeometry(1, 1, 1), new _three.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.5,
        roughness: 0.5,
        side: _three.DoubleSide
      }));
      this.roomShadow = new _three.Mesh(new _three.PlaneBufferGeometry(1, 10, 10), new _three.ShadowMaterial({
        color: 0x111111,
        opacity: 0.9
      }));
      this.room.scale.set(ROOM_SCALE * 200, ROOM_SCALE, ROOM_SCALE * 20);
      this.roomShadow.receiveShadow = true;
      this.room.position.y = ROOM_SCALE / 2;
      this.roomShadow.rotation.x = Math.PI / -2;
      this.roomShadow.position.y = 0.001;
      this.roomShadow.scale.set(this.room.scale.x - 0.01, this.room.scale.y - 0.01, this.room.scale.z - 0.01);
      this.scene.add(this.room);
      this.scene.add(this.roomShadow);

      this.light = new _three.AmbientLight(0xff0000, AMBIENT);
      this.vLight = new _three.PointLight();
      this.vLight.position.set(0, 1.8, -0.1);
      this.vLight.castShadow = true;
      this.scene.add(this.light);
      this.scene.add(this.vLight);
      this.cloner.addLight(this.vLight);

      //this.pivot.add(this.camera);
      this.scene.add(this.pivot);
      this.camera.position.set(-0.8, 0.1, 1);
      this.camera.rotation.x = 0.5;
      this.camera.rotation.y = -0.6;
      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'updateLightPosition',
    value: function updateLightPosition() {
      this.volumetricPass.uniforms.lightPosition.value = projectOnScreen(this.vLight, this.camera);
    }
  }, {
    key: 'update',
    value: function update(t, delta) {
      if (this.fan) {
        this.fan.rotation.y = t * 0.001;
        this.sideFan.rotation.y = t * 0.001;
      }
      this.pivot.rotation.y = t * 0.0001;
      this.pivot.updateMatrixWorld(true);
      this.vLight.updateMatrixWorld(true);
      this.updateLightPosition();
      this.cloner.update();
    }
  }, {
    key: 'render',
    value: function render() {
      this.camera.layers.set(OCCLUSION_LAYER);
      this.renderer.setClearColor(0x000000);
      this.occlusionComposer.render();

      this.camera.layers.set(DEFAULT_LAYER);
      this.renderer.setClearColor(CLEAR_COLOR);
      this.composer.render();
    }
  }]);

  return Experiment;
}(_ThreeApp3.default);

exports.default = new Experiment();

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nuniform sampler2D tDiffuse;\nuniform vec2 lightPosition;\nuniform float exposure;\nuniform float decay;\nuniform float density;\nuniform float weight;\nuniform int samples;\nconst int MAX_SAMPLES = 100;\nvoid main(){\n  vec2 texCoord = vUv;\n  // Calculate vector from pixel to light source in screen space\n  vec2 deltaTextCoord = texCoord - lightPosition;\n  // Divide by number of samples and scale by control factor\n  deltaTextCoord *= 1.0 / float(samples) * density;\n  // Store initial sample\n  vec4 color = texture2D(tDiffuse, texCoord);\n  // set up illumination decay factor\n  float illuminationDecay = 1.0;\n\n  // evaluate the summation for samples number of iterations up to 100\n  for(int i=0; i < MAX_SAMPLES; i++){\n    // work around for dynamic number of loop iterations\n    if(i == samples){\n      break;\n    }\n\n    // step sample location along ray\n    texCoord -= deltaTextCoord;\n    // retrieve sample at new location\n    vec4 sample = texture2D(tDiffuse, texCoord);\n    // apply sample attenuation scale/decay factors\n    sample *= illuminationDecay * weight;\n    // accumulate combined color\n    color += sample;\n    // update exponential decay factor\n    illuminationDecay *= decay;\n\n  }\n  // output final color with a further scale control factor\n  gl_FragColor = color * exposure;\n}\n"

/***/ })
/******/ ]);
});