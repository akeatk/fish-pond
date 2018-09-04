class Fish{
  constructor({mass,x,y,direction,pond}){
    this.colors = [
      [70,70,70],//black
      [226, 79, 24],//orange
      [255,245,45],//yellow
      [253, 230, 230],//white
    ];
    this.baseColor= Math.floor(Math.random()*this.colors.length);
    this.pond=pond;
    this.counter=0;

    this.mass= mass || 50;

    this.segmentLength = 10;

    this.ripple = false;

    this.velx=0;
    this.vely=0;
    this.target=null;

    this.targetDir=Math.PI/4+Math.PI/2;
    //used to orient the fish on initialization
    const radian=direction || Math.random()*Math.PI * 2;

    //=POWER(F36/((5+INT(LN(F36)))*PI()),1/3)
    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));

    //mouth init
    this.mouth=new Mouth({
      radius: maxRadius / 2
    });

    //head init
    this.head=new Head({
      radius: maxRadius,
      radian:radian,
      prevPart: this.mouth,
      x:x,
      y:y
    });

    const modifier = (this.head.mass + this.mouth.mass) / this.mass;

    this.parts = [];
    this.parts.push(
      new Part({
        radius:maxRadius,
        prevPart:this.head,
        segmentLength:this.head.radius * 10,
        fish:this
      })
    );
    this.head.setNextPart(this.parts[0]);
    let part;
    for(let i = 1;this.parts[i - 1].radius > 0.5;i++){
      part=new Part({
        radius:this.parts[i - 1].radius - modifier,
        prevPart:this.parts[i - 1],
        segmentLength:this.segmentLength,
        fish:this
      });
      this.parts[i - 1].setNextPart(part);
      this.parts.push(part);
    }
    this.tail = new Tail(this, this.head.radius);
    this.fins = new Fins(this, this.head.radius);
  }
  updateTargetDir(x,y){
    if(!this.target)
      return this.target=null;
    const xdiff = this.target.x - this.mouth.x;
    const ydiff = this.target.y - this.mouth.y;
    if(xdiff === 0){
      if(ydiff < 0)
        this.targetDir = Math.PI * 3 / 2;
      this.targetDir = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if(xdiff > 0)
        this.targetDir=radian
    else
        this.targetDir=-Math.PI+radian;
  }
  foodNotify(food){
    if(this.target && food.getDistance(this.mouth.x,this.mouth.y) <
      this.target.getDistance(this.mouth.x,this.mouth.y))
      this.target=food;
    else if(!this.target)
      this.target=food;

  }
  feed(x){
    this.ripple = true;
    this.updateMass(this.mass+x);
    this.change();
  }
  change(){
    this.counter++;
    if(this.counter > 1){
      this.counter = 0;
      const rand = Math.random() * 3;
      if(rand < 1)
        this.tail.change();
      else if(rand < 2)
        this.fins.change();
      else{
        this.tail.change();
        this.fins.change();
      }
    }
  }
  updateMass(mass){
    // return;
    this.mass= mass > 50 ? mass : 50;

    const maxRadius = Math.cbrt(this.mass / ((5 + Math.floor(Math.log(this.mass))) * Math.PI));

    //mouth update
    this.mouth.updateRadius(maxRadius/2);

    //head update
    this.head.updateRadius(maxRadius);

    this.parts[0].updateRadius(maxRadius,this);

    const modifier = (this.head.mass + this.mouth.mass) / this.mass;
    let part;
    for(let i = 1;this.parts[i - 1].radius > 0.5;i++){
      if(this.parts[i]){
        this.parts[i].updateRadius(this.parts[i - 1].radius - modifier,this);
      }
      else{
        part=new Part({
          radius:this.parts[i - 1].radius - modifier,
          prevPart:this.parts[i - 1],
          segmentLength:this.segmentLength,
          fish:this
        });
        this.parts[i - 1].setNextPart(part);
        this.parts.push(part);
      }
    }
    this.tail.updateRadius(this.head.radius);
    this.fins.updateRadius(this.head.radius);
  }
  render(ctx){

    //find target and calculate direction
    if(!this.target){
      this.target=this.pond.getClosestFood(this.mouth.x,this.mouth.y);
      if(!this.target)
        this.target=this.pond.getSpot();
    }
    else{
      if(this.target.value === 0){
        let tempTarget = this.pond.getClosestFood();
        if(tempTarget)
          this.target=tempTarget;
      }
      else if(this.target.value < 0){
        this.target=this.pond.getClosestFood();
        if(this.target === null)
          this.target=this.pond.getSpot(this.mouth.x,this.mouth.y);
      }
    }
    this.updateTargetDir();

    //begin calculating movement from all parts
    this.newvelx=0;
    this.newvely=0;
    this.parts[0].act(this);
    this.velx *=0.97;
    this.vely *=0.97;

    //move fish based on net movement and tail movement
    this.move(this.newvelx+this.velx,this.newvely+this.vely);

    //checks mouth for food
    this.pond.bite(this.mouth.x,this.mouth.y,this.mouth.radius,this);

    //begin drawing
    this.drawFish(ctx);

    if(this.ripple){
      this.pond.ripple(this.mouth.x,this.mouth.y,this.head.radius*10);
      // this.rippleCounter = 5;
    }
    this.ripple = false;
  }
  drawFish(ctx){
    this.fins.render(ctx);

    ctx.fillStyle=`rgb(${this.colors[this.baseColor][0]},${this.colors[this.baseColor][1]},${this.colors[this.baseColor][2]})`;

    //draw body
    ctx.beginPath();
    ctx.moveTo(...this.head.getPoint(this.head.radius*8,Math.PI/2));
    let i;
    for(i = 0;i < this.parts.length - 1;i++)
      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*8,Math.PI/2));
    ctx.lineTo(...this.parts[this.parts.length - 1].getPoint(0,0));
    for(i = this.parts.length - 2;i >-1;i--)
      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*8,-Math.PI/2));
    ctx.lineTo(...this.head.getPoint(this.head.radius*8,-Math.PI/2));
    ctx.fill();
    ctx.closePath();

    //draw head
    ctx.beginPath();
    ctx.moveTo(...this.head.getPoint(this.head.radius*8,Math.PI/2+.1));
    ctx.lineTo(...this.head.getPoint(this.head.radius*9,Math.PI/3));
    ctx.lineTo(...this.head.getPoint(this.head.radius*10.5,Math.PI/5));
    ctx.lineTo(...this.head.getPoint(this.head.radius*11,Math.PI/6));
    ctx.quadraticCurveTo(...this.head.getPoint(this.head.radius*20,0),
      ...this.head.getPoint(this.head.radius*11,-Math.PI/6));
    ctx.lineTo(...this.head.getPoint(this.head.radius*10.5,-Math.PI/5));
    ctx.lineTo(...this.head.getPoint(this.head.radius*9,-Math.PI/3));
    ctx.lineTo(...this.head.getPoint(this.head.radius*8,-Math.PI/2-.1));
    ctx.fill();
    ctx.closePath();

    //draw tail
    this.tail.render(ctx);

    //draw dorsal
    ctx.fillStyle=`rgb(${this.colors[this.baseColor][0]*.8},${this.colors[this.baseColor][1]*.8},${this.colors[this.baseColor][2]*.8})`;
    ctx.beginPath();
    ctx.moveTo(...this.parts[Math.floor(this.parts.length / 5)].getPoint(0,0));
    // right side
    for(i = Math.floor(this.parts.length / 5)+1;i < Math.floor(this.parts.length*3/4) + 1;i++)
      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*2,Math.PI/2));
    // center
    ctx.lineTo(...this.parts[Math.floor(this.parts.length*3/4)].getPoint(0,0));
    // left side
    for(i = Math.floor(this.parts.length*3/4) + 1;i > Math.floor(this.parts.length / 5);i--)
      ctx.lineTo(...this.parts[i].getPoint(this.parts[i].radius*2,-Math.PI/2));
    ctx.fill();
    ctx.closePath();
  }
  move(x,y){
    this.head.move(x,y);
  }
}

// -----------------------------------------------------------------------------

class Mouth{
  constructor({radius}){
    this.x=null;
    this.y=null;

    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);
  }
  updateRadius(radius){
    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);
  }
}

// -----------------------------------------------------------------------------

class Head{
  constructor({radius,radian,prevPart,x,y}){
    this.x=x;
    this.y=y;
    this.radian = radian;

    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);

    this.prevPart=prevPart;
    this.prevPart.x=this.x + this.radius*1.3 * 10 * Math.cos(this.radian);
    this.prevPart.y=this.y + this.radius*1.3 * 10 * Math.sin(this.radian);

    this.nextPart=null;
  }
  setNextPart(part){
    if(this.nextPart === null){
      this.nextPart = part;
      return true;
    }
    return false;
  }
  updateRadius(radius){
      this.radius = radius;
      this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);
    // this.nextPart.segmentLength=this.radius;
  }
  getPoint(radius,angle){
    return [
      this.x+radius*Math.cos(angle+this.radian),
      this.y+radius*Math.sin(angle+this.radian)
    ];
  }
  move(x,y){
    this.nextPart.move(x,y);
    this.radian = this.nextPart.radian;
    this.x=this.nextPart.x + this.radius * 10 * Math.cos(this.radian);
    this.y=this.nextPart.y + this.radius * 10 * Math.sin(this.radian);
    this.prevPart.x=this.x + this.radius*1.3 * 10 * Math.cos(this.radian);
    this.prevPart.y=this.y + this.radius*1.3 * 10 * Math.sin(this.radian);
  }
}

// -----------------------------------------------------------------------------

class Part{
  constructor({radius,prevPart,segmentLength,fish}){
    //one time sets
    this.prevPart=prevPart;
    this.segmentLength=segmentLength;
    this.nextPart = null;
    this.commitMove = 0;
    this.dirCount=0;
    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);
    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);
    this.atTarget=null;

    //set on mass change
    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);
    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1.1));
    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;
    this.moveAngle = this.maxAngle / 3;
    this.commitMax=3+Math.floor(Math.pow(fish.mass,1/2.5));

    //run at the end of init
    this.updateRadian();
  }
  updateRadian(){
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if(xdiff === 0){
      if(ydiff < 0)
        this.radian = Math.PI * 3 / 2;
      this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if(xdiff > 0)
        this.radian=radian
    else
        this.radian=-Math.PI+radian;
  }
  setNextPart(part){
    if(this.nextPart === null){
      this.nextPart = part;
      return true;
    }
    return false;
  }
  updateRadius(radius,fish){
    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);
    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1));
    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;
    this.moveAngle = this.maxAngle / 3;
    this.commitMax=1+Math.floor(Math.pow(fish.mass,1/2.7));
    this.updateRadian();
  }
  rotate(angle){
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const dx = this.x - this.prevPart.x;
    const dy = this.y - this.prevPart.y;

    this.x=dx*c-dy*s + this.prevPart.x;
    this.y=dx*s+dy*c + this.prevPart.y;
  }
  act(fish){
    let oldx = this.x;
    let oldy = this.y;
    this.updateRadian();
    let angleDiff = this.radian - this.prevPart.radian;
    if(angleDiff > Math.PI)
      angleDiff -= Math.PI * 2;
    else if(angleDiff < -Math.PI)
      angleDiff += Math.PI * 2;

    //pull self to prevPart
    if(Math.abs(angleDiff) > this.maxAngle){//angle correction
      this.commitMove = 0;
      if(angleDiff > 0){
        if(angleDiff - this.maxAngle > this.moveAngle * 2){
          const rad = this.prevPart.radian + Math.PI + this.maxAngle*0.8;
          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
        }
        else{
          this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);
          this.rotate(-this.moveAngle);
        }
      }
      else{
        if(angleDiff + this.maxAngle < -this.moveAngle * 2){
          const rad = this.prevPart.radian + Math.PI - this.maxAngle*0.8;
          this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
        }
        else{
          this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);
          this.rotate(this.moveAngle);
        }
      }
    }
    //movement
    else{
      //pulls self to prevPart
      this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);
      this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);
      angleDiff = this.radian - fish.targetDir;
      if(angleDiff > Math.PI)
        angleDiff -= Math.PI * 2;
      else if(angleDiff < -Math.PI)
        angleDiff += Math.PI * 2;

      if(this.commitMove < 0){
        this.rotate(-this.moveAngle);
        this.commitMove += 1;
      }
      else if(this.commitMove > 0){
        this.rotate(this.moveAngle);
        this.commitMove -= 1;
      }
      else if(angleDiff > 0){
        if(angleDiff < 0.1){
          this.commitMove = -this.commitMax;
        }
        this.rotate(-this.moveAngle);
        if(this.dirCount > 2*this.commitMax){
          this.commitMove = 1+Math.floor(this.commitMax/3);
          this.dirCount=0;
        }
        else if(this.dirCount > 0)
          this.dirCount++;
        else {
          this.dirCount=1;
        }
      }
      else{
        if(angleDiff > -0.1){
          this.commitMove = this.commitMax;
        }
        this.rotate(this.moveAngle);
        if(this.dirCount < -2*this.commitMax){
          this.commitMove = -1-Math.floor(this.commitMax/3);
          this.dirCount=0;
        }
        else if(this.dirCount < 0)
          this.dirCount--;
        else {
          this.dirCount=-1;
        }
      }
    }

    this.updateRadian();

    if(this.nextPart){
      const ratio = this.mass / fish.mass;
      fish.newvelx += (oldx - this.x) * ratio;
      fish.newvely += (oldy - this.y) * ratio;
      this.nextPart.act(fish);
    }
    else{
      let distMod = 0;
      if(fish.target && fish.target.getDistance(fish.mouth.x,fish.mouth.y) > 300){
        distMod = 5/fish.mass*(1 - 50/fish.target.getDistance(fish.mouth.x,fish.mouth.y));
      }

      let dir=fish.parts[0].radian-fish.targetDir;
      if(dir > Math.PI)
        dir -= Math.PI * 2;
      else if(dir < -Math.PI)
        dir += Math.PI * 2;

      //orient fish
      const ratio = this.mass / fish.mass;
      const xdiff=oldx - this.x;
      const ydiff=oldy - this.y;
      fish.newvelx += xdiff * ratio;
      fish.newvely += ydiff * ratio;
      //move forward
      this.atTarget=Math.pow((1-2*Math.abs(dir)/Math.PI),3) + distMod*5;
      const movDist = Math.sqrt(xdiff * xdiff +ydiff*ydiff);
      fish.velx += movDist * Math.cos(fish.parts[0].radian) / 10*this.atTarget;
      fish.vely += movDist * Math.sin(fish.parts[0].radian) / 10*this.atTarget;
    }
  }
  move(x,y){
    this.x += x;
    this.y += y;

    if(this.nextPart)
      this.nextPart.move(x,y);
  }
  getPoint(radius,angle){
    return [
      this.x+radius*Math.cos(angle+this.radian),
      this.y+radius*Math.sin(angle+this.radian)
    ];
  }
}

// -----------------------------------------------------------------------------

class Tail{
  constructor(fish,radius){
    this.changeCount = 0;
    this.fish = fish;
    this.pieces=[[],[],[],[],[]];
    this.radius = radius;
    this.pieceLength=this.radius*2;
    this.tip = fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;

    for(let i = 0;i <3;i++)
      this.pieces[2].push(new TailPiece(this,this.pieces[2][i-1],0));
    for(let i = 0;i < 5;i++)
      this.pieces[1].push(new TailPiece(this,this.pieces[1][i-1],1));
    for(let i = 0;i < 8;i++)
      this.pieces[0].push(new TailPiece(this,this.pieces[0][i-1],2));
    for(let i = 0;i < 5;i++)
      this.pieces[3].push(new TailPiece(this,this.pieces[3][i-1],-1));
    for(let i = 0;i < 8;i++)
      this.pieces[4].push(new TailPiece(this,this.pieces[4][i-1],-2));
  }
  change(){
    const rand = Math.random() * 3;
    if(rand < 1)
      this.pieces[2].push(new TailPiece(this,this.pieces[2][this.pieces[2].length-1],0));
    else if(rand < 2){
      this.pieces[1].push(new TailPiece(this,this.pieces[1][this.pieces[1].length-1],1));
      this.pieces[3].push(new TailPiece(this,this.pieces[3][this.pieces[3].length-1],-1));
    }
    else{
      this.pieces[0].push(new TailPiece(this,this.pieces[0][this.pieces[0].length-1],2));
      this.pieces[4].push(new TailPiece(this,this.pieces[4][this.pieces[4].length-1],-2));
    }
  }
  updateRadius(radius){
    //do stuff to tailpieces
    this.radius = radius;
    this.pieceLength=this.radius*2;
    this.tip = this.fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;
    for(let i = 0;i < 5;i++)
      this.pieces[i][0].prevPart=this.tip;
  }
  act(){
    this.tip = this.fish.parts[this.fish.parts.length - 1];
    for(let i = 0;i < this.pieces[2].length;i++)
      this.pieces[2][i].act(this);
    for(let i = 0;i < this.pieces[1].length;i++)
      this.pieces[1][i].act(this);
    for(let i = 0;i < this.pieces[0].length;i++)
      this.pieces[0][i].act(this);
    for(let i = 0;i < this.pieces[3].length;i++)
      this.pieces[3][i].act(this);
    for(let i = 0;i < this.pieces[4].length;i++)
      this.pieces[4][i].act(this);
  }
  render(ctx){
    this.act();
    ctx.fillStyle=`rgba(${this.fish.colors[this.fish.baseColor][0]},${this.fish.colors[this.fish.baseColor][1]},${this.fish.colors[this.fish.baseColor][2]},.4)`;

    for(let j = 0;j < this.pieces.length - 1;j++){
      ctx.beginPath();
      ctx.moveTo(...this.tip.getPoint(0,0));
      for(let i = 0;i < this.pieces[j].length;i++)
        ctx.lineTo(this.pieces[j][i].x,this.pieces[j][i].y);
      for(let i = this.pieces[j+1].length-1;i > -1;i--)
        ctx.lineTo(this.pieces[j+1][i].x,this.pieces[j+1][i].y);
      ctx.fill();
      ctx.closePath();
    }

    ctx.strokeStyle=`rgba(${this.fish.colors[this.fish.baseColor][0]*.8},${this.fish.colors[this.fish.baseColor][1]*.8},${this.fish.colors[this.fish.baseColor][2]*.8},.3)`;
    ctx.lineWidth=1;
    for(let j = 0;j < this.pieces.length;j++){
      ctx.beginPath();
      ctx.moveTo(...this.tip.getPoint(0,0));
      for(let i = 0;i < this.pieces[j].length;i++)
        ctx.lineTo(this.pieces[j][i].x,this.pieces[j][i].y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
class TailPiece{
  constructor(tail,prevPart,offset){
    this.prevPart=prevPart;
    this.offset=offset;
    this.velx=0;
    this.vely=0;
    this.x=null;
    this.y=null;

    if(!this.prevPart)
      this.prevPart = tail.tip;
    this.radian=this.prevPart.radian;
    this.maxAngle = this.prevPart.maxAngle;
    //pull self to tail
    [this.x,this.y]=this.prevPart.getPoint(tail.pieceLength,this.prevPart.radian+Math.PI);
  }
  act(tail){
    let oldx = this.x;
    let oldy = this.y;
    this.x +=this.velx;
    this.y += this.vely;
    this.updateRadian();
    let angleDiff = this.radian+this.offset/3 - this.prevPart.radian;
    if(angleDiff > Math.PI)
      angleDiff -= Math.PI * 2;
    else if(angleDiff < -Math.PI)
      angleDiff += Math.PI * 2;

    //pull self to prevPart
    if(Math.abs(angleDiff) > tail.maxAngle){//angle correction
      if(angleDiff > 0){
        if(angleDiff - tail.maxAngle > tail.maxAngle/2){
          const rad = this.prevPart.radian + Math.PI + tail.maxAngle;
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(rad);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(rad);
        }
        else{
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(this.radian + Math.PI);
          // this.rotate(-tail.maxAngle/5);
        }
      }
      else{
        if(angleDiff + tail.maxAngle < -tail.maxAngle/2){
          const rad = this.prevPart.radian + Math.PI - tail.maxAngle;
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(rad);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(rad);
        }
        else{
          this.x = this.prevPart.x + tail.pieceLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + tail.pieceLength * Math.sin(this.radian + Math.PI);
          // this.rotate(tail.maxAngle/5);
        }
      }
    }
    else{
      this.x = this.prevPart.x + tail.pieceLength * Math.cos(this.radian + Math.PI);
      this.y = this.prevPart.y + tail.pieceLength * Math.sin(this.radian + Math.PI);
    }
    this.velx = (this.velx + this.x - oldx)/5;
    this.vely = (this.vely + this.y - oldy)/5;
  }
  rotate(angle){
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const dx = this.x - this.prevPart.x;
    const dy = this.y - this.prevPart.y;

    this.x=dx*c-dy*s + this.prevPart.x;
    this.y=dx*s+dy*c + this.prevPart.y;
  }
  updateRadian(){
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if(xdiff === 0){
      if(ydiff < 0)
        this.radian = Math.PI * 3 / 2;
      this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if(xdiff > 0)
        this.radian=radian
    else
        this.radian=-Math.PI+radian;
  }
  getPoint(radius,angle){
    return [
      this.x+radius*Math.cos(angle+this.radian),
      this.y+radius*Math.sin(angle+this.radian)
    ];
  }
}

// -----------------------------------------------------------------------------

class Fins{
  constructor(fish,radius){
    this.fish = fish;
    this.fins=[
      new Fin(fish,1,0,radius),
      new Fin(fish,-1,0,radius),
      new Fin(fish,1,.3,radius),
      new Fin(fish,-1,.3,radius)
    ]
    this.radius = radius;
    this.tip = fish.parts[this.fish.parts.length - 1];
    this.maxAngle = this.tip.maxAngle;
  }
  updateRadius(radius){
    for(let i = 0;i < this.fins.length;i++)
      this.fins[i].updateRadius(radius);
  }
  change(){
    const rand = Math.random()*2;
    if(rand > 1){
      this.fins[0].change(rand/2);
      this.fins[1].change(rand/2);
    }
    else{
      this.fins[2].change(rand/2);
      this.fins[3].change(rand/2);
    }
  }
  act(){
    for(let i = 0;i < this.fins.length;i++)
      this.fins[i].act();
  }
  render(ctx){
    this.act();

    for(let i = 0;i < this.fins.length;i++)
      this.fins[i].render(ctx);
  }
}
class Fin{
  constructor(fish,side,ratio,radius){//1 is left, -1 is right
    this.fish=fish;
    this.side= side;
    this.ratio = ratio;
    this.radius = radius;
    this.part = fish.parts[Math.floor(fish.parts.length * ratio)];
    this.pieceLength = this.radius * 3+1;
    this.pieces = [
      [new FinPiece(this,undefined,this.side,0)],
      [new FinPiece(this,undefined,this.side,1)],
      [new FinPiece(this,undefined,this.side,2)],
      [new FinPiece(this,undefined,this.side,3)],
      [new FinPiece(this,undefined,this.side,4)],
      [new FinPiece(this,undefined,this.side,5)],
      [new FinPiece(this,undefined,this.side,6)],
    ];

    for(let i = 0;i < 7;i++)
      for(let j = 0;j < 5-i/2;j++)
        this.pieces[i].push(new FinPiece(this,this.pieces[i][j],this.side,i));
  }
  updateRadius(radius){
    this.radius = radius;
    this.pieceLength = this.radius * 3+1;
    this.part = this.fish.parts[Math.floor(this.fish.parts.length * this.ratio)];
  }
  change(rand){
    const idx = Math.floor(rand * this.pieces.length);
    const lastPiece = this.pieces[idx][this.pieces[idx].length - 1];
    this.pieces[idx].push(
      new FinPiece(this,lastPiece,this.side,idx)
    );
  }
  act(){
    for(let i = 0;i < this.pieces.length;i++)
      for(let j = 0;j < this.pieces[i].length;j++)
        this.pieces[i][j].act();
  }
  render(ctx){
    ctx.fillStyle=`rgba(${this.fish.colors[this.fish.baseColor][0]},${this.fish.colors[this.fish.baseColor][1]},${this.fish.colors[this.fish.baseColor][2]},.4)`;

    for(let j = 0;j < this.pieces.length - 1;j++){
      ctx.beginPath();
      ctx.moveTo(this.pieces[j][0].x,this.pieces[j][0].y);
      for(let i = 1;i < this.pieces[j].length;i++)
        ctx.lineTo(this.pieces[j][i].x,this.pieces[j][i].y);
      for(let i = this.pieces[j+1].length-1;i > -1;i--)
        ctx.lineTo(this.pieces[j+1][i].x,this.pieces[j+1][i].y);
      ctx.fill();
      ctx.closePath();
    }

    ctx.strokeStyle=`rgba(${this.fish.colors[this.fish.baseColor][0]*.8},${this.fish.colors[this.fish.baseColor][1]*.8},${this.fish.colors[this.fish.baseColor][2]*.8},.2)`;
    ctx.lineWidth=1;
    for(let j = 0;j < this.pieces.length;j++){
      ctx.beginPath();
      ctx.moveTo(this.pieces[j][0].x,this.pieces[j][0].y);
      for(let i = 1;i < this.pieces[j].length;i++)
        ctx.lineTo(this.pieces[j][i].x,this.pieces[j][i].y);
      ctx.stroke();
      ctx.closePath();
    }

    // ctx.beginPath();
    // ctx.arc(this.pieces[3].x,this.pieces[3].y,5,0,2*Math.PI);
    // ctx.fill();
    // ctx.closePath();
  }
}
class FinPiece{
  constructor(fin,prevPart,side,bias){
    this.fin = fin;
    this.prevPart = prevPart;
    this.side = side;
    this.finOffset=-this.side * ((1 - this.fin.ratio) * .3 - 5*this.fin.ratio);
    this.bias = side * bias*Math.PI/8;
    this.velx=0;
    this.vely=0;

    this.x=null;
    this.y=null;
    this.radian=null;
    this.maxAngle=null;
    if(!this.prevPart){
      [this.x,this.y] = this.fin.part.getPoint(this.fin.part.radius*9,this.side*Math.PI/2+this.finOffset);
      this.maxAngle = this.fin.part.maxAngle*this.fin.ratio;
      this.radian = this.fin.part.radian + Math.PI / 2 * -this.side+this.finOffset/2+this.bias;
    }
    else{
      this.maxAngle = this.prevPart.maxAngle;
      this.radian=this.prevPart.radian;
      [this.x,this.y] = this.prevPart.getPoint(this.fin.pieceLength,Math.PI);
    }
  }
  act(){
    if(!this.prevPart){
      [this.x,this.y] = this.fin.part.getPoint(this.fin.part.radius*9,this.side*Math.PI/2+this.finOffset);
      this.maxAngle = this.fin.part.maxAngle*this.fin.ratio;
      this.radian = this.fin.part.radian + Math.PI / 2 * -this.side+this.finOffset/2+this.bias;
    }
    else{
      this.maxAngle = this.prevPart.maxAngle;
      let oldx = this.x;
      let oldy = this.y;
      this.x +=this.velx;
      this.y += this.vely;
      this.updateRadian();
      let angleDiff = this.radian - this.prevPart.radian;
      if(angleDiff > Math.PI)
        angleDiff -= Math.PI * 2;
      else if(angleDiff < -Math.PI)
        angleDiff += Math.PI * 2;

      //pull self to prevPart
      if(angleDiff > 0){
        if(angleDiff > this.maxAngle)
          [this.x,this.y] = this.prevPart.getPoint(this.fin.pieceLength,Math.PI+this.maxAngle)
        else{
          this.x = this.prevPart.x + this.fin.pieceLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + this.fin.pieceLength * Math.sin(this.radian + Math.PI);
        }
      }
      else{
        if(angleDiff < -this.maxAngle)
          [this.x,this.y] = this.prevPart.getPoint(this.fin.pieceLength,Math.PI-this.maxAngle)
        else{
          this.x = this.prevPart.x + this.fin.pieceLength * Math.cos(this.radian + Math.PI);
          this.y = this.prevPart.y + this.fin.pieceLength * Math.sin(this.radian + Math.PI);
        }
      }
      this.velx = (this.velx + this.x - oldx)/5;
      this.vely = (this.vely + this.y - oldy)/5;
    }
  }
  updateRadian(){
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if(xdiff === 0){
      if(ydiff < 0)
        this.radian = Math.PI * 3 / 2;
      this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if(xdiff > 0)
        this.radian=radian
    else
        this.radian=-Math.PI+radian;
  }
  getPoint(radius,angle){
    return [
      this.x+radius*Math.cos(angle+this.radian),
      this.y+radius*Math.sin(angle+this.radian)
    ];
  }
}
// -----------------------------------------------------------------------------

module.exports = Fish;
