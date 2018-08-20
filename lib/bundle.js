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

eval("\n\nclass Fish{\n  constructor({mass,x,y,direction}){\n    //x,y is only used for initially placing the fish in the pond\n\n    this.mass= mass > 50 ? mass : 50;\n\n    const segmentLength = 10;\n\n    this.velx=0;\n    this.vely=0;\n\n    this.centerx=null;\n    this.centery=null;\n\n    //used to orient the fish on initialization\n    const radian=direction || Math.random()*Math.PI * 2;\n\n    //=POWER(F36/((5+INT(LN(F36)))*PI()),1/3)\n    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));\n\n    //mouth init\n    this.mouth=new Mouth({\n      radius: maxRadius / 2\n    });\n\n    //head init\n    this.head=new Head({\n      radius: maxRadius,\n      radian:radian,\n      prevPart: this.mouth,\n      x:x,\n      y:y\n    });\n\n    const modifier = (this.head.mass + this.mouth.mass) / this.mass;\n\n    this.parts = [];\n    this.parts.push(\n      new Part({\n        radius:maxRadius,\n        prevPart:this.head,\n        segmentLength:this.head.radius * 10,\n        fish:this\n      })\n    );\n    this.head.setNextPart(this.parts[0]);\n\n    let part;\n    for(let i = 1;this.parts[i - 1].radius > .5;i++){\n      part=new Part({\n        radius:this.parts[i - 1].radius - modifier,\n        prevPart:this.parts[i - 1],\n        segmentLength:segmentLength,\n        fish:this\n      });\n      this.parts[i - 1].setNextPart(part);\n      this.parts.push(part);\n    }\n    this.calcCenter();\n  }\n  calcCenter(){\n    let m = this.mouth.mass;\n    this.centerx = this.mouth.x;\n    this.centery = this.mouth.y;\n\n    m += this.head.mass;\n    this.centerx += (this.head.x - this.centerx) * this.head.mass / m;\n    this.centery += (this.head.y - this.centery) * this.head.mass / m;\n\n    this.parts.forEach((part)=>{\n      m += part.mass;\n      this.centerx += (part.x - this.centerx) * part.mass / m;\n      this.centery += (part.y - this.centery) * part.mass / m;\n    });\n  }\n  bend(){//text method to \"fully\" bend the fish\n    this.parts[1].bend(this);\n  }\n  render(ctx){\n    /*\n    sequence of events for moving fish\n    -calculate center of mass\n    -check for closest food (or find furthest cardinal direction)\n    -generate wantDirection\n    -move each part, which will generate a newvelocity (speed and direction)\n    -apply velocity to center of mass (done in move)\n    -apply \"friction\" coefficient to slow down velocity\n      -(simple version is just slow it down without altering direction)\n    -move all pieces in the direction the center of mass has moved\n    */\n    this.calcCenter();\n\n    //find target and calculate direaction when not testing\n    this.targetDir=0;\n    // this.targetDir=this.head.radian;\n\n    this.newvelx=0;\n    this.newvely=0;\n    this.parts[0].act(this);\n    console.log('new velocity = ',this.newvelx,', ',this.newvely);\n\n    //move fish with newvel\n    this.move(this.newvelx,this.newvely);\n    // if(velx < )\n    // this.velx=\n    // this.vely=\n\n    this.head.render(ctx);\n\n    //render center of mass as purple dot\n    ctx.fillStyle='#f0f';\n    ctx.beginPath();\n    ctx.arc(this.centerx, this.centery,\n      5,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n  }\n  move(x,y){\n    this.head.move(x,y);\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Mouth{\n  constructor({radius}){\n    this.x=null;\n    this.y=null;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n  }\n  render(ctx){\n    ctx.fillStyle='#f00';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Head{\n  constructor({radius,radian,prevPart,x,y}){\n    this.x=x;\n    this.y=y;\n    this.radian = radian;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n\n    this.prevPart=prevPart;\n    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);\n    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);\n\n    this.nextPart=null;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      return true;\n    }\n    return false;\n  }\n  render(ctx){\n    ctx.fillStyle='#0f0';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n    this.prevPart.render(ctx);\n    this.nextPart.render(ctx);\n  }\n  move(x,y){\n    this.radian = this.nextPart.radian;\n    this.x += x;\n    this.y += y;\n    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);\n    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Part{\n  constructor({radius,prevPart,segmentLength,fish}){\n    this.x=null;\n    this.y=null;\n    this.prevPart=prevPart;\n    this.segmentLength=segmentLength;\n\n    //x = prevPart.x + segmentLength * cos(prevPart.radian + PI + PI/pow(Math.log(fish.mass),1.5));\n    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1.5));\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n\n    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);\n    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);\n    this.updateRadian();\n\n    this.nextPart = null;\n  }\n  updateRadian(){\n    const xdiff = this.prevPart.x - this.x;\n    const ydiff = this.prevPart.y - this.y;\n    if(xdiff === 0){\n      if(ydiff < 0)\n        return this.radian = Math.PI * 3 / 2;\n      return this.radian = Math.PI / 2;\n    }\n    const radian = Math.atan(ydiff / xdiff);\n    if(xdiff < 0)\n      return this.radian = radian + Math.PI;\n    return this.radian = radian;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      return true;\n    }\n    return false;\n  }\n  bend(fish){\n    //pulling self to prev(if needed)\n    //aligns itself with radian of prevPart\n    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);\n    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);\n\n    //bending part\n    const s=Math.sin(this.maxAngle);\n    const c=Math.cos(this.maxAngle);\n\n    const dx=this.x-this.prevPart.x;\n    const dy=this.y-this.prevPart.y;\n\n    this.x=dx*c-dy*s + this.prevPart.x;\n    this.y=dx*s+dy*c + this.prevPart.y;\n\n    this.updateRadian();\n\n    if(this.nextPart)\n      this.nextPart.bend(fish);\n  }\n  rotate(angle){\n    const s = Math.sin(angle);\n    const c = Math.cos(angle);\n\n    const dx = this.x - this.prevPart.x;\n    const dy = this.y - this.prevPart.y;\n\n    this.x=dx*c-dy*s + this.prevPart.x;\n    this.y=dx*s+dy*c + this.prevPart.y;\n  }\n  act(fish){\n    const oldx = this.x;\n    const oldy = this.y;\n    //pull self to prevPart\n    this.updateRadian();\n    if(Math.sqrt( Math.pow(this.prevPart.x - this.x,2)\n        + Math.pow(this.prevPart.y - this.y,2))){\n      this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);\n      this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);\n    }\n    //calculate angle diff (if too large, fix angle and dont move)\n    let angleDiff = this.radian - this.prevPart.radian;\n    if(angleDiff > Math.PI)\n      angleDiff -= Math.PI * 2;\n    else if(angleDiff < -Math.PI)\n      angleDiff += Math.PI * 2;\n    console.log('part radian = ',this.radian / Math.PI * 180);\n    console.log('anglediff = ',angleDiff / Math.PI * 180);\n\n    if(Math.abs(angleDiff) > this.maxAngle){//angle correction\n      if(angleDiff > 0)\n        this.rotate(this.maxAngle - angleDiff);\n      else\n        this.rotate(angleDiff + this.maxAngle);\n    }\n    else{//movement\n      angleDiff = this.radian - fish.targetDir;\n      if(angleDiff > Math.PI)\n        angleDiff -= Math.PI * 2;\n      else if(angleDiff < -Math.PI)\n        angleDiff += Math.PI * 2;\n\n      if(angleDiff > 0)\n        this.rotate(this.maxAngle/-5);\n      else\n        this.rotate(this.maxAngle/5);\n    }\n    // console.log('part change = ',oldx - this.x,', ',oldy-this.y);\n\n    if(this.nextPart){\n      const ratio = this.mass / fish.mass;\n      fish.newvelx += (oldx - this.x) * ratio;\n      fish.newvely += (oldy - this.y) * ratio;\n      this.nextPart.act(fish);\n    }\n    else{\n      const ratio = 1;\n      fish.newvelx += (oldx - this.x) * ratio;\n      fish.newvely += (oldy - this.y) * ratio;\n    }\n  }\n  move(x,y){\n    this.x += x;\n    this.y += y;\n\n    if(this.nextPart)\n      this.nextPart.move(x,y);\n  }\n  render(ctx){\n    /*\n\n    */\n    ctx.fillStyle='#00f';\n\n    ctx.beginPath();\n    ctx.arc(this.x, this.y,\n      this.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n    if(this.nextPart)\n      this.nextPart.render(ctx);\n  }\n}\n\n\nmodule.exports = Fish;\n\n\n//# sourceURL=webpack:///./lib/fish.js?");

/***/ }),

/***/ "./lib/fish_pond.js":
/*!**************************!*\
  !*** ./lib/fish_pond.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Fish = __webpack_require__(/*! ./fish */ \"./lib/fish.js\");\n\nclass FishPond {\n  constructor(window){\n    this.window=window;\n    this.height=this.window.innerHeight;\n    this.width=this.window.innerWidth;\n\n    this.fish=[\n      new Fish({\n        mass:50,\n        x:200,\n        y:200\n      }),\n      new Fish({\n        mass:50,\n        x:400,\n        y:200\n      }),\n      // new Fish({\n      //   mass:75,\n      //   x:600,\n      //   y:300\n      // }),\n    ];\n\n    // // bends fish to the max and calculates center of mass\n    // this.fish[1].bend();\n    // this.fish[1].calcCenter();\n  }\n\n  start(canvas){\n    const ctx = canvas.getContext(\"2d\");\n\n    const startAnimation = () => {\n      canvas.height = this.window.innerHeight-20;\n      canvas.width = this.window.innerWidth-20;\n      this.height = this.window.innerHeight-20;\n      this.width = this.window.innerWidth-20;\n      this.render(ctx);\n\n      // setTimeout(startAnimation, 1000/10);\n    }\n    startAnimation();\n  }\n\n  render(ctx){\n    ctx.fillRect(5, 5,this.width,this.height);\n    ctx.clearRect(5, 5, this.width/2, this.height/2);\n    for(let i = 0;i < this.fish.length;i++)\n      this.fish[i].render(ctx);\n  }\n}\n\nmodule.exports = FishPond;\n\n\n//# sourceURL=webpack:///./lib/fish_pond.js?");

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