

class Fish{
  constructor({mass,x,y,direction,pond}){
    //x,y is only used for initially placing the fish in the pond

    this.mass= mass > 50 ? mass : 50;
    this.pond = pond;

    const segmentLength = 10;

    this.xvel=0;
    this.yvel=0;

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
        segmentLength:segmentLength
      })
    );
    this.head.setNextPart(this.parts[0]);

    let part;
    for(let i = 1;this.parts[i - 1].radius > .5;i++){
      part=new Part({
        radius:this.parts[i - 1].radius - modifier,
        prevPart:this.parts[i - 1],
        segmentLength:segmentLength
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
  render(ctx){
    /*
    sequence of events for moving fish
    -calculate center of mass
    -check for closest food (or find furthest cardinal direction)
    -move each part, which will generate a velocity (speed and direction)
    -apply velocity to center of mass
    -apply "friction" coefficient to slow down velocity
      -(simple version is just slow it down without altering direction)
    -move all pieces in the direction the center of mass has moved

    */
    this.head.render(ctx);

    ctx.fillStyle='#f0f';

    ctx.beginPath();
    ctx.arc(this.centerx, this.centery,
      10,
      0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
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
      this.nextPart.x=this.x + this.radius * 10 * Math.cos(this.radian + Math.PI);
      this.nextPart.y=this.y + this.radius * 10 * Math.sin(this.radian + Math.PI);
      this.nextPart.radian=this.radian;
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
}

// -----------------------------------------------------------------------------
/*
part=new Part({
  radius:this.parts[i - 1].radius * this.multiplier,
  prevPart:this.parts[i - 1],
  segmentLength:segmentLength,
  number:i
});
*/
class Part{
  constructor({radius,prevPart,segmentLength}){
    this.x=null;
    this.y=null;
    this.prevPart=prevPart;
    this.segmentLength=segmentLength;

    this.radius = radius;
    this.mass = Math.PI * 4 / 3 * Math.pow(this.radius, 3);

    this.nextPart = null;
    this.radian = null;
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
      this.updateRadian();
      this.nextPart.x=this.x + this.segmentLength * Math.cos(this.radian + Math.PI);
      this.nextPart.y=this.y + this.segmentLength * Math.sin(this.radian + Math.PI);
      return true;
    }
    return false;
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
