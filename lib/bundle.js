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

eval("\n\nclass Fish{\n  constructor({mass,x,y,direction,pond}){\n    this.pond=pond;\n\n    this.mass= mass || 50;\n\n    this.segmentLength = 10;\n\n    this.velx=0;\n    this.vely=0;\n    this.target=null;\n\n    this.targetDir=Math.PI/4+Math.PI/2;\n    //used to orient the fish on initialization\n    const radian=direction || Math.random()*Math.PI * 2;\n\n    //=POWER(F36/((5+INT(LN(F36)))*PI()),1/3)\n    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));\n\n    //mouth init\n    this.mouth=new Mouth({\n      radius: maxRadius / 2\n    });\n\n    //head init\n    this.head=new Head({\n      radius: maxRadius,\n      radian:radian,\n      prevPart: this.mouth,\n      x:x,\n      y:y\n    });\n\n    const modifier = (this.head.mass + this.mouth.mass) / this.mass;\n\n    this.parts = [];\n    this.parts.push(\n      new Part({\n        radius:maxRadius,\n        prevPart:this.head,\n        segmentLength:this.head.radius * 10,\n        fish:this\n      })\n    );\n    this.head.setNextPart(this.parts[0]);\n    let part;\n    for(let i = 1;this.parts[i - 1].radius > 0.5;i++){\n      part=new Part({\n        radius:this.parts[i - 1].radius - modifier,\n        prevPart:this.parts[i - 1],\n        segmentLength:this.segmentLength,\n        fish:this\n      });\n      this.parts[i - 1].setNextPart(part);\n      this.parts.push(part);\n    }\n    this.tail = new Tail(this, this.head.radius);\n  }\n  updateTargetDir(x,y){\n    if(!this.target)\n      return this.target=null;\n    const xdiff = this.target.x - this.mouth.x;\n    const ydiff = this.target.y - this.mouth.y;\n    if(xdiff === 0){\n      if(ydiff < 0)\n        this.targetDir = Math.PI * 3 / 2;\n      this.targetDir = Math.PI / 2;\n    }\n    const radian = Math.atan(ydiff / xdiff);\n    if(xdiff > 0)\n        this.targetDir=radian\n    else\n        this.targetDir=-Math.PI+radian;\n  }\n  foodNotify(food){\n    if(this.target && food.getDistance(this.mouth.x,this.mouth.y) <\n      this.target.getDistance(this.mouth.x,this.mouth.y))\n      this.target=food;\n    else if(!this.target)\n      this.target=food;\n\n  }\n  feed(x){\n    this.updateMass(this.mass+x);\n  }\n  updateMass(mass){\n    // return;\n    this.mass= mass > 50 ? mass : 50;\n\n    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));\n\n    //mouth update\n    this.mouth.updateRadius(maxRadius/2);\n\n    //head update\n    this.head.updateRadius(maxRadius);\n\n    this.parts[0].updateRadius(maxRadius,this);\n\n    const modifier = (this.head.mass + this.mouth.mass) / this.mass;\n    let part;\n    for(let i = 1;this.parts[i - 1].radius > 0.5;i++){\n      if(this.parts[i]){\n        this.parts[i].updateRadius(this.parts[i - 1].radius - modifier,this);\n      }\n      else{\n        part=new Part({\n          radius:this.parts[i - 1].radius - modifier,\n          prevPart:this.parts[i - 1],\n          segmentLength:this.segmentLength,\n          fish:this\n        });\n        this.parts[i - 1].setNextPart(part);\n        this.parts.push(part);\n      }\n    }\n    this.tail.updateRadius(this.head.radius);\n  }\n  render(ctx){\n\n    //find target and calculate direction\n    if(!this.target){\n      this.target=this.pond.getClosestFood(this.mouth.x,this.mouth.y);\n      if(!this.target)\n        this.target=this.pond.getSpot();\n    }\n    else{\n      if(this.target.value === 0){\n        let tempTarget = this.pond.getClosestFood();\n        if(tempTarget)\n          this.target=tempTarget;\n      }\n      else if(this.target.value < 0){\n        this.target=this.pond.getClosestFood();\n        if(this.target === null)\n          this.target=this.pond.getSpot(this.mouth.x,this.mouth.y);\n      }\n    }\n    this.updateTargetDir();\n\n    //begin calculating movement from all parts\n    this.newvelx=0;\n    this.newvely=0;\n    this.parts[0].act(this);\n    this.velx *=0.97;\n    this.vely *=0.97;\n\n    //move fish based on net movement and tail movement\n    this.move(this.newvelx+this.velx,this.newvely+this.vely);\n\n    //checks mouth for food\n    this.pond.bite(this.mouth.x,this.mouth.y,this.mouth.radius,this);\n\n    //begin drawing\n    this.drawFish(ctx);\n  }\n  drawFish(ctx){\n\n    //temp for mouth\n    ctx.fillStyle='#f0f';\n\n    ctx.beginPath();\n    ctx.arc(this.mouth.x, this.mouth.y,\n      this.mouth.radius * 10,\n      0, 2 * Math.PI, true);\n    ctx.fill();\n    ctx.closePath();\n    if(this.nextPart)\n      this.nextPart.render(ctx);\n\n\n    //draw body\n    ctx.fillStyle='#f00';\n    ctx.beginPath();\n    ctx.moveTo(...this.head.getPoint(this.head.radius*8,Math.PI/2));\n    let i;\n    for(i = 0;i < this.parts.length - 1;i++)\n      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*8,Math.PI/2));\n    ctx.lineTo(...this.parts[this.parts.length - 1].getPoint(0,0));\n    for(i = this.parts.length - 2;i >-1;i--)\n      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*8,-Math.PI/2));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*8,-Math.PI/2));\n    ctx.fill();\n    ctx.closePath();\n\n\n    //draw dorsal\n    ctx.fillStyle='#0f0';\n    ctx.beginPath();\n    ctx.moveTo(...this.parts[Math.floor(this.parts.length / 5)].getPoint(0,0));\n    // right side\n    for(i = Math.floor(this.parts.length / 5)+1;i < Math.floor(this.parts.length*3/4) + 1;i++)\n      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*2,Math.PI/2));\n    // center\n    ctx.lineTo(...this.parts[Math.floor(this.parts.length*3/4)].getPoint(0,0));\n    // left side\n    for(i = Math.floor(this.parts.length*3/4) + 1;i > Math.floor(this.parts.length / 5);i--)\n      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*2,-Math.PI/2));\n    ctx.fill();\n    ctx.closePath();\n\n    //draw head\n    ctx.fillStyle='#ff0';\n    ctx.beginPath();\n    ctx.moveTo(...this.head.getPoint(this.head.radius*8,Math.PI/2));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*9,Math.PI/3));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*11,Math.PI/5));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*12,Math.PI/6));\n    ctx.quadraticCurveTo(...this.head.getPoint(this.head.radius*17,0),\n      ...this.head.getPoint(this.head.radius*12,-Math.PI/6));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*11,-Math.PI/5));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*9,-Math.PI/3));\n    ctx.lineTo(...this.head.getPoint(this.head.radius*8,-Math.PI/2));\n    ctx.fill();\n    ctx.closePath();\n\n    //draw tail\n    this.tail.render(ctx);\n  }\n  move(x,y){\n    this.head.move(x,y);\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Mouth{\n  constructor({radius}){\n    this.x=null;\n    this.y=null;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n  }\n  updateRadius(radius){\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Head{\n  constructor({radius,radian,prevPart,x,y}){\n    this.x=x;\n    this.y=y;\n    this.radian = radian;\n\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n\n    this.prevPart=prevPart;\n    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);\n    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);\n\n    this.nextPart=null;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      return true;\n    }\n    return false;\n  }\n  updateRadius(radius){\n      this.radius = radius;\n      this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n    // this.nextPart.segmentLength=this.radius;\n  }\n  getPoint(radius,angle){\n    return [\n      this.x+radius*Math.cos(angle+this.radian),\n      this.y+radius*Math.sin(angle+this.radian)\n    ];\n  }\n  move(x,y){\n    this.nextPart.move(x,y);\n    this.radian = this.nextPart.radian;\n    this.x=this.nextPart.x + this.radius * 10 * Math.cos(this.radian);\n    this.y=this.nextPart.y + this.radius * 10 * Math.sin(this.radian);\n    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);\n    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Part{\n  constructor({radius,prevPart,segmentLength,fish}){\n    //one time sets\n    this.prevPart=prevPart;\n    this.segmentLength=segmentLength;\n    this.nextPart = null;\n    this.commitMove = 0;\n    this.dirCount=0;\n    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);\n    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);\n    this.atTarget=null;\n\n    //set on mass change\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1.1));\n    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;\n    this.moveAngle = this.maxAngle / 3;\n    this.commitMax=3+Math.floor(Math.pow(fish.mass,1/2.5));\n\n    //run at the end of init\n    this.updateRadian();\n  }\n  updateRadian(){\n    const xdiff = this.prevPart.x - this.x;\n    const ydiff = this.prevPart.y - this.y;\n    if(xdiff === 0){\n      if(ydiff < 0)\n        this.radian = Math.PI * 3 / 2;\n      this.radian = Math.PI / 2;\n    }\n    const radian = Math.atan(ydiff / xdiff);\n    if(xdiff > 0)\n        this.radian=radian\n    else\n        this.radian=-Math.PI+radian;\n  }\n  setNextPart(part){\n    if(this.nextPart === null){\n      this.nextPart = part;\n      return true;\n    }\n    return false;\n  }\n  updateRadius(radius,fish){\n    this.radius = radius;\n    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);\n    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1));\n    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;\n    this.moveAngle = this.maxAngle / 3;\n    this.commitMax=1+Math.floor(Math.pow(fish.mass,1/2.7));\n    this.updateRadian();\n  }\n  rotate(angle){\n    const s = Math.sin(angle);\n    const c = Math.cos(angle);\n\n    const dx = this.x - this.prevPart.x;\n    const dy = this.y - this.prevPart.y;\n\n    this.x=dx*c-dy*s + this.prevPart.x;\n    this.y=dx*s+dy*c + this.prevPart.y;\n  }\n  act(fish){\n    let oldx = this.x;\n    let oldy = this.y;\n    this.updateRadian();\n    let angleDiff = this.radian - this.prevPart.radian;\n    if(angleDiff > Math.PI)\n      angleDiff -= Math.PI * 2;\n    else if(angleDiff < -Math.PI)\n      angleDiff += Math.PI * 2;\n\n    //pull self to prevPart\n    if(Math.abs(angleDiff) > this.maxAngle){//angle correction\n      this.commitMove = 0;\n      if(angleDiff > 0){\n        if(angleDiff - this.maxAngle > this.moveAngle * 2){\n          const rad = this.prevPart.radian + Math.PI + this.maxAngle*0.8;\n          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);\n          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);\n        }\n        else{\n          this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);\n          this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);\n          this.rotate(-this.moveAngle);\n        }\n      }\n      else{\n        if(angleDiff - this.maxAngle < -this.moveAngle * 2){\n          const rad = this.prevPart.radian + Math.PI - this.maxAngle*0.8;\n          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);\n          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);\n        }\n        else{\n          this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);\n          this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);\n          this.rotate(this.moveAngle);\n        }\n      }\n    }\n    //movement\n    else{\n      //pulls self to prevPart\n      this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);\n      this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);\n      angleDiff = this.radian - fish.targetDir;\n      if(angleDiff > Math.PI)\n        angleDiff -= Math.PI * 2;\n      else if(angleDiff < -Math.PI)\n        angleDiff += Math.PI * 2;\n\n      if(this.commitMove < 0){\n        this.rotate(-this.moveAngle);\n        this.commitMove += 1;\n      }\n      else if(this.commitMove > 0){\n        this.rotate(this.moveAngle);\n        this.commitMove -= 1;\n      }\n      else if(angleDiff > 0){\n        if(angleDiff < 0.1){\n          this.commitMove = -this.commitMax;\n        }\n        this.rotate(-this.moveAngle);\n        if(this.dirCount > 2*this.commitMax){\n          this.commitMove = 1+Math.floor(this.commitMax/5);\n          this.dirCount=0;\n        }\n        else if(this.dirCount > 0)\n          this.dirCount++;\n        else {\n          this.dirCount=1;\n        }\n      }\n      else{\n        if(angleDiff > -0.1){\n          this.commitMove = this.commitMax;\n        }\n        this.rotate(this.moveAngle);\n        if(this.dirCount < -2*this.commitMax){\n          this.commitMove = -1-Math.floor(this.commitMax/5);\n          this.dirCount=0;\n        }\n        else if(this.dirCount < 0)\n          this.dirCount--;\n        else {\n          this.dirCount=-1;\n        }\n      }\n    }\n\n    this.updateRadian();\n\n    if(this.nextPart){\n      const ratio = this.mass / fish.mass;\n      fish.newvelx += (oldx - this.x) * ratio;\n      fish.newvely += (oldy - this.y) * ratio;\n      this.nextPart.act(fish);\n    }\n    else{\n      let distMod = 0;\n      if(fish.target){\n        distMod = 5/fish.mass*(1 - 50/fish.target.getDistance(fish.mouth.x,fish.mouth.y));\n      }\n\n      let dir=fish.parts[0].radian-fish.targetDir;\n      if(dir > Math.PI)\n        dir -= Math.PI * 2;\n      else if(dir < -Math.PI)\n        dir += Math.PI * 2;\n\n      //orient fish\n      const ratio = this.mass / fish.mass;\n      const xdiff=oldx - this.x;\n      const ydiff=oldy - this.y;\n      fish.newvelx += xdiff * ratio;\n      fish.newvely += ydiff * ratio;\n      //move forward\n      this.atTarget=Math.pow((1-2*Math.abs(dir)/Math.PI),3) + distMod;\n      const movDist = Math.sqrt(xdiff * xdiff +ydiff*ydiff);\n      fish.velx += movDist * Math.cos(fish.parts[0].radian) / 10*this.atTarget;\n      fish.vely += movDist * Math.sin(fish.parts[0].radian) / 10*this.atTarget;\n    }\n  }\n  move(x,y){\n    this.x += x;\n    this.y += y;\n\n    if(this.nextPart)\n      this.nextPart.move(x,y);\n  }\n  getPoint(radius,angle){\n    return [\n      this.x+radius*Math.cos(angle+this.radian),\n      this.y+radius*Math.sin(angle+this.radian)\n    ];\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nclass Tail{\n  constructor(fish,radius){\n    this.radius = radius;\n    this.changeCount = 0;\n    this.multiplier=1;\n    this.fish = fish;\n    this.pieces=[\n      [],\n      [],\n      [],\n      [],\n      []\n    ];\n  }\n  change(){\n    //update length, width, etc.\n    //length and width are multipliers\n    this.changeCount++;\n  }\n  updateRadius(radius){\n    this.radius;\n  }\n  render(ctx){\n    this.tip = this.fish.parts[this.fish.parts.length - 1];\n    this.base = this.fish.parts[this.fish.parts.length - 2];\n\n\n  }\n}\nclass LLTail{\n  constructor(tail,prevPart){\n\n  }\n}\nclass LTail{\n  constructor(tail,prevPart){\n\n  }\n}\nclass CTail{\n  constructor(tail,prevPart){\n\n  }\n}\nclass RTail{\n  constructor(tail,prevPart){\n\n  }\n}\nclass RRTail{\n  constructor(tail,prevPart){\n\n  }\n}\n\n// -----------------------------------------------------------------------------\n\nmodule.exports = Fish;\n\n\n//# sourceURL=webpack:///./lib/fish.js?");

/***/ }),

/***/ "./lib/fish_pond.js":
/*!**************************!*\
  !*** ./lib/fish_pond.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Fish = __webpack_require__(/*! ./fish */ \"./lib/fish.js\");\nconst Target = __webpack_require__(/*! ./target */ \"./lib/target.js\");\n\nclass FishPond {\n  constructor(window){\n    this.maxFood=20;\n    this.window=window;\n    this.c=0;\n    this.spots=[new Target(0,0,0)];\n    for(let i = 1;i < 100;i++)\n      this.spots.push(new Target(0,0,0,this.spots[i-1]));\n    this.spots[0].nextSpot=this.spots[this.spots.length - 1];\n    this.foods=[];\n    this.fish=[\n      new Fish({\n        mass:50,\n        x:200,\n        y:200,\n        pond:this\n      }),\n      new Fish({\n        mass:100,\n        x:400,\n        y:200,\n        pond:this\n      }),\n      new Fish({\n        mass:200,\n        x:600,\n        y:300,\n        pond:this\n      }),\n      // new Fish({\n      //   mass:800,\n      //   x:600,\n      //   y:300,\n      //   pond:this\n      // }),\n      // new Fish({\n      //   mass:1600,\n      //   x:600,\n      //   y:300,\n      //   pond:this\n      // }),\n    ];\n    for(let i = 0;i < 0;i++)\n    this.fish.push(  new Fish({\n        mass:50,\n        x:200,\n        y:200,\n        pond:this\n      }));\n  }\n\n  start(canvas){\n    const ctx = canvas.getContext(\"2d\");\n\n    const startAnimation = () => {\n      const h = this.height;\n      const w = this.width;\n      canvas.height = this.window.innerHeight-20;\n      canvas.width = this.window.innerWidth-20;\n      this.height = this.window.innerHeight-20;\n      this.width = this.window.innerWidth-20;\n\n      if(w !== this.width || h !== this.height){\n        const halfh=this.height/2;\n        const halfw=this.width/2;\n        for(let i = 0;i < Math.floor(this.spots.length) / 2;i++){\n          this.spots[i].x = halfw + ( Math.random() * halfw)*Math.cos(i);\n          this.spots[i].y = halfh + ( Math.random() * halfh)*Math.sin(i);\n        }\n        for(let i = Math.floor(this.spots.length / 2);i < this.spots.length;i++){\n          this.spots[i].x = halfw + (halfw/4 + Math.random() * halfw/1.5)*Math.cos(-i);\n          this.spots[i].y = halfh + (halfh/3 + Math.random() * halfh/2)*Math.sin(-i);\n        }\n      }\n\n      this.render(ctx);\n\n      setTimeout(startAnimation, 1000/30);\n    };\n    startAnimation();\n  }\n\n  render(ctx){\n    ctx.fillRect(0, 0,this.width,this.height);\n    for(let i = 0;i < this.fish.length;i++)\n      this.fish[i].render(ctx);\n    for(let i = 0;i < this.foods.length;i++)\n      this.foods[i].render(ctx);\n  }\n  click(x,y){\n    let food = new Target(x,y,2);\n    if(this.foods.length < this.maxFood)\n      this.foods.push(food);\n    else{\n      this.foods[0].value=-1;\n      this.foods.shift();\n      this.foods.push(food);\n    }\n    for(let i = 0;i < this.fish.length;i++){\n      this.fish[i].foodNotify(food);\n    }\n  }\n  getClosestFood(x,y){\n    if(this.foods.length < 1)\n      return null;\n    let target = this.foods[0]\n    for(let i = 1;i < this.foods.length;i++)\n      if(this.foods[i].getDistance(x,y) < target.getDistance(x,y))\n        target=this.foods[i];\n    return target;\n  }\n  getSpot(){\n    return this.spots[Math.floor(this.spots.length * Math.random())];\n  }\n  bite(x,y,radius,fish){\n    for(let i = 0;i < this.foods.length;i++){\n      if(this.foods[i].getDistance(x,y) < radius + 10){\n        this.foods[i].eaten(fish);\n        this.foods.splice(i,1);\n        i--;\n      }\n    }\n    if(fish.target && fish.target.value===0)\n      for(let i = 0;i < this.spots.length;i++)\n        if(this.spots[i].getDistance(x,y) < 100)\n          this.spots[i].eaten(fish);\n  }\n}\n\nmodule.exports = FishPond;\n\n\n//# sourceURL=webpack:///./lib/fish_pond.js?");

/***/ }),

/***/ "./lib/main.js":
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const FishPond = __webpack_require__(/*! ./fish_pond.js */ \"./lib/fish_pond.js\")\n\nconst canvas = document.getElementsByTagName(\"canvas\")[0];\nlet pond = new FishPond(window);\n\nfunction clickCanvas(e) {\n    const x = e.clientX - canvas.offsetLeft;\n    const y = e.clientY - canvas.offsetTop;\n    pond.click(x,y);\n}\n\ncanvas.addEventListener('click', clickCanvas);\npond.start(canvas);\n\n\n//# sourceURL=webpack:///./lib/main.js?");

/***/ }),

/***/ "./lib/target.js":
/*!***********************!*\
  !*** ./lib/target.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Target{\n  constructor(x,y,value,nextSpot){\n    this.value=value;\n    this.x = x;\n    this.y = y;\n    this.nextSpot=nextSpot;\n  }\n  getDistance(x,y){\n    const xdif = this.x-x;\n    const ydif = this.y-y;\n    return Math.sqrt(xdif*xdif+ydif*ydif);\n  }\n  eaten(fish){\n    if(this.value===0 && this == fish.target)\n      fish.target=this.nextSpot;\n    else if(this.value > 0){\n      fish.target=null;\n      fish.feed(this.value);\n      this.value=-1;\n    }\n\n  }\n  render(ctx){\n    if(this.value===0){\n      ctx.fillStyle='#0f0';\n\n      ctx.beginPath();\n      ctx.arc(this.x, this.y,\n        5,\n        0, 2 * Math.PI, true);\n      ctx.fill();\n      ctx.closePath();\n    }\n    else{\n      ctx.fillStyle='#ff0';\n\n      ctx.beginPath();\n      ctx.arc(this.x, this.y,\n        5,\n        0, 2 * Math.PI, true);\n      ctx.fill();\n      ctx.closePath();\n    }\n  }\n}\n\nmodule.exports = Target;\n\n\n//# sourceURL=webpack:///./lib/target.js?");

/***/ })

/******/ });