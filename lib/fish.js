

class Fish{
  constructor({mass,x,y,direction,pond}){
    this.pond=pond;

    this.mass= mass > 50 ? mass : 50;

    this.segmentLength = 10;

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
  }
  updateTargetDir(x,y){
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
  feed(x){
    this.updateMass(this.mass+x);
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
  }
  render(ctx){
    /*
    sequence of events for moving fish
    -check for closest food (or find furthest cardinal direction)
    -generate wantDirection
    -move each part, which will generate a newvelocity (speed and direction)
    -apply velocity to all parts (done in move)
    -apply "friction" coefficient to slow down velocity
      -(simple version is just slow it down without altering direction)
    -move all pieces in the direction the center of mass has moved
    */

    //find target and calculate direaction when not testing
    // this.targetDir=this.head.radian+.1;
    if(this.target === null){
      this.target=pond.getRandomFood();
      if(this.target === null)
        this.target=pond.getSpot(this.x,this.y);
    }
    else{
      if(this.target.value === 0){
        let tempTarget = pond.getRandomFood();
        if(tempTarget!==null)
          this.target=tempTarget;
      }
      else if(this.target.value < 0){
        this.target=pond.getRandomFood();
        if(this.target === null)
          this.target=pond.getSpot(this.x,this.y);
      }
    }
    this.updateTargetDir();

    this.newvelx=0;
    this.newvely=0;
    this.parts[0].act(this);
    this.velx *=0.85;
    this.vely *=0.85;

    //move fish with newvel + velx
    this.move(this.newvelx+this.velx,this.newvely+this.vely);

    // this.velx=this.velx + this.newvelx;
    // this.vely=this.velx + this.newvely;
    // this.move(this.velx,this.vely);


    this.head.render(ctx);
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
  render(ctx){
    ctx.fillStyle='#f00';

    ctx.beginPath();
    ctx.arc(this.x, this.y,
      this.radius * 10,
      0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
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
    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);
    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);

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
  render(ctx){
    ctx.fillStyle='#0f0';

    ctx.beginPath();
    ctx.arc(this.x, this.y,
      this.radius * 10,
      0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
    this.prevPart.render(ctx);
    this.nextPart.render(ctx);
  }
  move(x,y){
    this.nextPart.move(x,y);
    this.radian = this.nextPart.radian;
    this.x=this.nextPart.x + this.radius * 10 * Math.cos(this.radian);
    this.y=this.nextPart.y + this.radius * 10 * Math.sin(this.radian);
    this.prevPart.x=this.x + this.radius * 10 * Math.cos(this.radian);
    this.prevPart.y=this.y + this.radius * 10 * Math.sin(this.radian);
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
    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1));
    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;
    this.moveAngle = this.maxAngle / 3;
    this.commitMax=1+Math.floor(Math.pow(fish.mass,1/2.5));

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
    this.commitMax=1+Math.floor(Math.pow(fish.mass,1/2.5));
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
        if(angleDiff - this.maxAngle < -this.moveAngle * 2){
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
        if(this.dirCount > this.commitMax){
          this.commitMove = 1+Math.floor(this.commitMax/6);
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
        if(this.dirCount < -this.commitMax){
          this.commitMove = -1-Math.floor(this.commitMax/6);
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
      this.atTarget=Math.pow((1-1.5*Math.abs(dir)/Math.PI),3);
      const movDist = 2 + Math.sqrt(xdiff * xdiff +ydiff*ydiff);
      fish.velx += movDist * Math.cos(fish.parts[0].radian) / 5*this.atTarget;
      fish.vely += movDist * Math.sin(fish.parts[0].radian) / 5*this.atTarget;

    }
  }
  move(x,y){
    this.x += x;
    this.y += y;

    if(this.nextPart)
      this.nextPart.move(x,y);
  }
  render(ctx){
    ctx.fillStyle='#00f';

    ctx.beginPath();
    ctx.arc(this.x, this.y,
      this.radius * 10,
      0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
    if(this.nextPart)
      this.nextPart.render(ctx);
  }
}


module.exports = Fish;
