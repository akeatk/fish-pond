class Target{
  constructor(x,y,value,nextSpot){
    this.value=value;
    this.x = x;
    this.y = y;
    this.nextSpot=nextSpot;
    this.colors = [
      [212, 168, 72],
      [123, 101, 57],
      [212, 112, 46],
      [169, 155, 60]
    ];
    this.baseColor=Math.floor(Math.random()*this.colors.length);
    this.baseColor=`rgb(${this.colors[this.baseColor][0]},${this.colors[this.baseColor][1]},${this.colors[this.baseColor][2]})`;
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
    if(this.value>0){
      ctx.fillStyle=this.baseColor;

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
