class Target{
  constructor(x,y,value,nextSpot){
    this.value=value;
    this.x = x;
    this.y = y;
    this.nextSpot=nextSpot;
  }
  getDistance(x,y){
    const xdif = this.x-x;
    const ydif = this.y-y;
    return Math.sqrt(xdif*xdif+ydif*ydif);
  }
  eaten(fish){
    if(this.value===0 && this == fish.target)
      fish.target=this.nextSpot;
    else if(this.value > 0){
      fish.target=null;
      fish.feed(this.value);
      this.value=-1;
    }

  }
  render(ctx){
    if(this.value===0){
      ctx.fillStyle='#0f0';

      ctx.beginPath();
      ctx.arc(this.x, this.y,
        5,
        0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    else{
      ctx.fillStyle='#ff0';

      ctx.beginPath();
      ctx.arc(this.x, this.y,
        5,
        0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
  }
}

module.exports = Target;
