class Target{
  constructor(x,y,value){
    this.value=value;
    this.x = x;
    this.y = y;
  }
  getDistance(x,y){
    return Math.sqrt(x*x+y*y);
  }
  render(ctx){
    if(this.value===0){
      ctx.fillStyle='#0f0';

      ctx.beginPath();
      ctx.arc(this.x, this.y,
        10,
        0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
    else{
      ctx.fillStyle='#ff0';

      ctx.beginPath();
      ctx.arc(this.x, this.y,
        10,
        0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
  }
}

module.exports = Target;
