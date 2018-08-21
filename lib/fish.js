

class Fish{
  constructor({mass,x,y,direction}){
    //x,y is only used for initially placing the fish in the pond

    this.mass= mass > 50 ? mass : 50;

    const segmentLength = 10;

    this.velx=0;
    this.vely=0;

    this.centerx=null;
    this.centery=null;

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
        segmentLength:segmentLength,
        fish:this
      });
      this.parts[i - 1].setNextPart(part);
      this.parts.push(part);
    }
    this.calcCenter();
  }
  calcCenter(){
    let m = this.mouth.mass;
    this.centerx = this.mouth.x;
    this.centery = this.mouth.y;

    m += this.head.mass;
    this.centerx += (this.head.x - this.centerx) * this.head.mass / m;
    this.centery += (this.head.y - this.centery) * this.head.mass / m;

    this.parts.forEach((part)=>{
      m += part.mass;
      this.centerx += (part.x - this.centerx) * part.mass / m;
      this.centery += (part.y - this.centery) * part.mass / m;
    });
  }
  bend(){//text method to "fully" bend the fish
    this.parts[1].bend(this);
  }
  render(ctx){
    /*
    sequence of events for moving fish
    -calculate center of mass
    -check for closest food (or find furthest cardinal direction)
    -generate wantDirection
    -move each part, which will generate a newvelocity (speed and direction)
    -apply velocity to center of mass (done in move)
    -apply "friction" coefficient to slow down velocity
      -(simple version is just slow it down without altering direction)
    -move all pieces in the direction the center of mass has moved
    */

    //find target and calculate direaction when not testing
    this.targetDir=0;
    // this.targetDir=this.head.radian;

    this.newvelx=0;
    this.newvely=0;
    this.parts[0].act(this);

    //move fish with newvel
    this.maxm=0;
    //this doesnt work. find a differnt net distance
    const netDistance = Math.sqrt(Math.pow(this.newvelx,2)+Math.pow(this.newvely,2));
    this.newvelx += netDistance * Math.cos(this.parts[0].radian);
    this.newvely += netDistance * Math.sin(this.parts[0].radian);
    this.move(this.newvelx,this.newvely);

    // this.velx=this.velx + this.newvelx;
    // this.vely=this.velx + this.newvely;
    // this.move(this.velx,this.vely);

    this.calcCenter();

    this.head.render(ctx);

    //render center of mass as purple dot
    ctx.fillStyle='#f0f';
    ctx.beginPath();
    ctx.arc(this.centerx, this.centery,
      5,
      0, 2 * Math.PI, true);
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
    this.x=null;
    this.y=null;
    this.prevPart=prevPart;
    this.segmentLength=segmentLength;

    //x = prevPart.x + segmentLength * cos(prevPart.radian + PI + PI/pow(Math.log(fish.mass),1.5));
    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);

    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);
    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);

    this.maxAngle=Math.PI/(Math.pow(Math.log(fish.mass),1));
    this.maxAngle=this.radius*this.radius/this.mass * this.maxAngle;
    this.commitMax=1+Math.floor(Math.pow(fish.mass,1/2));


    this.updateRadian();

    this.nextPart = null;
    this.commitMove = 0;
  }
  updateRadian(){
    const xdiff = this.prevPart.x - this.x;
    const ydiff = this.prevPart.y - this.y;
    if(xdiff === 0){
      if(ydiff < 0)
        return this.radian = Math.PI * 3 / 2;
      return this.radian = Math.PI / 2;
    }
    const radian = Math.atan(ydiff / xdiff);
    if(xdiff < 0)
      return this.radian = radian + Math.PI;
    return this.radian = radian;
  }
  setNextPart(part){
    if(this.nextPart === null){
      this.nextPart = part;
      return true;
    }
    return false;
  }
  bend(fish){
    //pulling self to prev(if needed)
    //aligns itself with radian of prevPart
    this.x = this.prevPart.x + this.segmentLength * Math.cos(this.prevPart.radian + Math.PI);
    this.y = this.prevPart.y + this.segmentLength * Math.sin(this.prevPart.radian + Math.PI);

    //bending part
    const s=Math.sin(this.maxAngle);
    const c=Math.cos(this.maxAngle);

    const dx=this.x-this.prevPart.x;
    const dy=this.y-this.prevPart.y;

    this.x=dx*c-dy*s + this.prevPart.x;
    this.y=dx*s+dy*c + this.prevPart.y;

    this.updateRadian();

    if(this.nextPart)
      this.nextPart.bend(fish);
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
    const oldx = this.x;
    const oldy = this.y;
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
        const rad = this.prevPart.radian + Math.PI + this.maxAngle;
        this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
        this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
      }
      else{
        const rad = this.prevPart.radian + Math.PI - this.maxAngle;
        this.x = this.prevPart.x + this.segmentLength * Math.cos(rad);
        this.y = this.prevPart.y + this.segmentLength * Math.sin(rad);
      }
    }
    //movement
    else{
    // if(true){
      const moveAngle = this.maxAngle / 4;
      //pulls self to prevPart
      this.x = this.prevPart.x + this.segmentLength * Math.cos(this.radian + Math.PI);
      this.y = this.prevPart.y + this.segmentLength * Math.sin(this.radian + Math.PI);
      angleDiff = this.radian - fish.targetDir;
      if(angleDiff > Math.PI)
        angleDiff -= Math.PI * 2;
      else if(angleDiff < -Math.PI)
        angleDiff += Math.PI * 2;

      if(this.commitMove < 0){
        this.rotate(-moveAngle);
        this.commitMove += 1;
      }
      else if(this.commitMove > 0){
        this.rotate(moveAngle);
        this.commitMove -= 1;
      }
      else if(angleDiff > 0){
        if(angleDiff < 0.1){
          this.commitMove = -this.commitMax;
        }
        this.rotate(-moveAngle);
      }
      else{
        if(angleDiff > -0.1){
          this.commitMove = this.commitMax;
        }
        this.rotate(moveAngle);
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
      const ratio = this.mass / fish.mass;
      // const ratio = 2/fish.parts.length;
      // const ratio = 1;
      fish.newvelx += (oldx - this.x) * ratio;
      fish.newvely += (oldy - this.y) * ratio;
    }
  }
  move(x,y){
    this.x += x;
    this.y += y;

    if(this.nextPart)
      this.nextPart.move(x,y);
  }
  render(ctx){
    /*

    */
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
