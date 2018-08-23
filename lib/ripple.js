class Ripple{
  constructor(x,y,size,pond,index){
    this.x = x;
    this.y = y;
    this.size = size;
    this.pond = pond;
    this.index = index;
    this.opacity=1;
    this.ops=this.opacity/size/4;
    this.lineWidth = 1;
    this.radius=1;
  }
  render(ctx){
    ctx.strokeStyle=`rgba(235,235,235,${this.opacity})`;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.arc(this.x, this.y,
      3*Math.sqrt(this.radius),
      0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.closePath();

    if(this.opacity < 0)
      this.pond.ripples.splice(this.indx,1);
    this.opacity -= this.ops;
    this.lineWidth+=.1;
    this.radius++;
  }
}

module.exports = Ripple;
