/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/fish.js":
/*!*********************!*\
  !*** ./lib/fish.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\nclass Fish{\n  constructor({mass,x,y,direction,pond}){\n    //x,y is only used for initially placing the fish in the pond\n\n    this.mass= mass > 50 ? mass : 50;\n    this.pond = pond;\n\n    const segmentLength = 10;\n\n    this.xvel=0;\n    this.yvel=0;\n\n    this.centerx=null;\n    this.centery=null;\n\n    //used to orient the fish on initialization\n    const radian=direction || Math.random()*Math.PI * 2;\n\n    //=POWER(F36/((5+INT(LN(F36)))*PI()),1/3)\n    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));\n\n    //mouth init\n    this.mouth=new Mouth({\n      radius: maxRadius / 2\n    });\n\n    //head init\n    this.head=new Head({\n      radius: maxRadius,\n      radian:radian,\n      prevPart: this.mouth,\n      x:x,\n      y:y\n    });\n\n    const modifier = (this.head.mass + this.mouth.mass) / this.mass;\n\n    this.parts = [];\n    this.parts.push(\n      new Part({\n        radius:maxRadius,\n        prevPart:this.head,\n        segmentLength:segmentLength\n      })\n    );\n    this.head.setNextPart(this.parts[0]);\n\n    let part;\n    for(let i = 1;this.parts[i - 1].radius > .5;i++){\n      part=new Part({\n        radius:this.parts[i - 1].radius - modifier,\n        prevPart:this.parts[i - 1],\n        segmentLength:segmentLength\n      });\n      this.parts[i - 1].setNextPart(part);\n      this.parts.push(part);\n    }\n    this.calcCenter();\n  }\n  calcCenter(){\n    let m = this.mouth.mass;\n    this.centerx = this.mouth.x;\n    this.centery = this.mouth.y;\n\n    m += this.head.mass;\n    this.centerx += (this.head.x - this.centerx) * this.head.mass / m;\n    this.centery += (this.head.y - this.centery) * this.head.mass / m;\n\n    this.parts.forEach((part)=>{\n      m += part.mass;\n      this.centerx += (part.x - this.centerx) * part.mass / m;\n      this.centery += (part.y - this.centery) * part.mass / m;\n    });\n  }\n  render(ctx){\n    /*\n    sequence of events for moving fish\n    -calculate center of mass\n    -check for closest food (or find furthest cardinal direction)\n    -move each part, which will generate a velocity (speed and direction)\n    -apply velocity to center of mass\n    -apply \"friction\" coefficient to slow down velocity\n      -(simple version is just slow it down without altering direction)\n    -move all pieces in the direction the center of mass has moved\n\n    */\n    this.head.render(ctx);\n\n    ctx.fillStyle='#f0f';\n\n    ctx.beginPath();\n    ctx.arc(this.centerx, this.centery,\n      10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Mouth{\n  constructor({radius}){\n    this.x=null;\n    this.y=null;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n  }\n  render(ctx){\n    ctx.fillStyle='#f00';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Head{\n  constructor({radius,radian,prevPart,x,y}){\n    this.x=x;\n    this.y=y;\n    this.radian = radian;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n\n    this.prevPart=prevPart;\n    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);\n    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);\n\n    this.nextPart=null;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      this.nextPart.x=this.x + this.radius * 10 * Math.cos(this.radian + Math.PI);\n      this.nextPart.y=this.y + this.radius * 10 * Math.sin(this.radian + Math.PI);\n      this.nextPart.radian=this.radian;\n      return true;\n    }\n    return false;\n  }\n  render(ctx){\n    ctx.fillStyle='#0f0';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n    this.prevPart.render(ctx);\n    this.nextPart.render(ctx);\n  }\n}\n\n// -----------------------------------------------------------------------------\n/*\npart=new Part({\n  radius:this.parts[i - 1].radius * this.multiplier,\n  prevPart:this.parts[i - 1],\n  segmentLength:segmentLength,\n  number:i\n});\n*/\nclass Part{\n  constructor({radius,prevPart,segmentLength}){\n    this.x=null;\n    this.y=null;\n    this.prevPart=prevPart;\n    this.segmentLength=segmentLength;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n\n    this.nextPart = null;\n    this.radian = null;\n  }\n  updateRadian(){\n    const xdiff = this.prevPart.x - this.x;\n    const ydiff = this.prevPart.y - this.y;\n    if(xdiff === 0){\n      if(ydiff < 0)\n        return this.radian = Math.PI * 3 / 2;\n      return this.radian = Math.PI / 2;\n    }\n    const radian = Math.atan(ydiff / xdiff);\n    if(xdiff < 0)\n      return this.radian = radian + Math.PI;\n    return this.radian = radian;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      this.updateRadian();\n      this.nextPart.x=this.x + this.segmentLength * Math.cos(this.radian + Math.PI);\n      this.nextPart.y=this.y + this.segmentLength * Math.sin(this.radian + Math.PI);\n      return true;\n    }\n    return false;\n  }\n  render(ctx){\n    ctx.fillStyle='#00f';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n    if(this.nextPart)\n      this.nextPart.render(ctx);\n  }\n}\n\nmodule.exports = Fish;\n\n\n//# sourceURL=webpack:///./lib/fish.js?");

/***/ }),

/***/ "./lib/fish_pond.js":
/*!**************************!*\
  !*** ./lib/fish_pond.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Fish = __webpack_require__(/*! ./fish */ \"./lib/fish.js\");\n\nclass FishPond {\n  constructor(window){\n    this.window=window;\n    this.height=this.window.innerHeight;\n    this.width=this.window.innerWidth;\n\n    this.fish=[\n      new Fish({\n        mass:50,\n        x:200,\n        y:200,\n        pond:this\n      }),\n      new Fish({\n        mass:100,\n        x:400,\n        y:200,\n        pond:this\n      }),\n      new Fish({\n        mass:200,\n        x:600,\n        y:200,\n        pond:this\n      }),\n      new Fish(100,400,200),\n      new Fish(200,600,200)\n    ];\n  }\n\n  start(canvas){\n    const ctx = canvas.getContext(\"2d\");\n\n    const startAnimation = () => {\n      canvas.height = this.window.innerHeight-20;\n      canvas.width = this.window.innerWidth-20;\n      this.height = this.window.innerHeight-20;\n      this.width = this.window.innerWidth-20;\n      this.render(ctx);\n\n      // setTimeout(startAnimation, 1000/4);\n    }\n    startAnimation();\n  }\n\n  render(ctx){\n    ctx.fillRect(5, 5,this.width,this.height);\n    ctx.clearRect(5, 5, this.width/2, this.height/2);\n    for(let i = 0;i < this.fish.length;i++)\n      this.fish[i].render(ctx);\n  }\n}\n\nmodule.exports = FishPond;\n\n\n//# sourceURL=webpack:///./lib/fish_pond.js?");

/***/ }),

/***/ "./lib/main.js":
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const FishPond = __webpack_require__(/*! ./fish_pond.js */ \"./lib/fish_pond.js\")\n\nconst canvas = document.getElementsByTagName(\"canvas\")[0];\nnew FishPond(window).start(canvas);\n\n\n//# sourceURL=webpack:///./lib/main.js?");

/***/ })

/******/ });