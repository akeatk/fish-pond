const Fish = require('./fish');
const Target = require('./target');

class FishPond {
  constructor(window){
    this.window=window;
    this.c=0;
    this.spots=[
      new Target(0,0,0),
      new Target(0,0,0),
      new Target(0,0,0),
      new Target(0,0,0)
    ];
    this.foods=[];
    this.fish=[
      new Fish({
        mass:50,
        x:200,
        y:200,
        pond:this
      }),
      new Fish({
        mass:100,
        x:400,
        y:200,
        pond:this
      }),
      new Fish({
        mass:1000,
        x:600,
        y:300,
        pond:this
      }),
    ];
  }

  start(canvas){
    const ctx = canvas.getContext("2d");

    const startAnimation = () => {
      canvas.height = this.window.innerHeight-20;
      canvas.width = this.window.innerWidth-20;
      this.height = this.window.innerHeight-20;
      this.width = this.window.innerWidth-20;
      this.spots[0].x = this.width / 2;
      this.spots[0].y = this.height / 4;
      this.spots[1].x = this.width *3/4;
      this.spots[1].y = this.height/2;
      this.spots[2].x = this.width/2;
      this.spots[2].y = this.height*3/4;
      this.spots[3].x = this.width/4;
      this.spots[3].y = this.height/2;

      this.render(ctx);

      setTimeout(startAnimation, 1000/30);
    };
    startAnimation();
  }

  render(ctx){
    ctx.fillRect(5, 5,this.width,this.height);
    for(let i = 0;i < this.fish.length;i++)
      this.fish[i].render(ctx);
    for(let i = 0;i < this.foods.length;i++)
      this.foods[i].render(ctx);
  }
  click(x,y){
    if(this.foods.length < 10)
      this.foods.push(new Target(x,y,10));
  }
  getRandomFood(){
    if(this.foods.length < 1)
      return null;
    return this.foods[Math.floor(this.foods.length*Math.random)];
  }
  getSpot(x,y){
    let spot=this.spots[0];
    let dist=spot.getDistance(x,y);
    if(dist <)
    //get third farthest spot and return it
  }
}

module.exports = FishPond;
