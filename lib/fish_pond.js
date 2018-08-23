const Fish = require('./fish');
const Target = require('./target');
const Ripple = require('./ripple');

class FishPond {
  constructor(window){
    this.maxFood=20;
    this.window=window;
    this.c=0;
    this.spots=[new Target(0,0,0)];
    for(let i = 1;i < 100;i++)
      this.spots.push(new Target(0,0,0,this.spots[i-1]));
    this.spots[0].nextSpot=this.spots[this.spots.length - 1];
    this.foods=[];
    this.ripples=[];
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
        mass:200,
        x:600,
        y:300,
        pond:this
      }),
      // new Fish({
      //   mass:800,
      //   x:600,
      //   y:300,
      //   pond:this
      // }),
      // new Fish({
      //   mass:1600,
      //   x:600,
      //   y:300,
      //   pond:this
      // }),
    ];
    for(let i = 0;i < 0;i++)
    this.fish.push(  new Fish({
        mass:50,
        x:200,
        y:200,
        pond:this
      }));
  }

  start(canvas){
    const ctx = canvas.getContext("2d");

    const startAnimation = () => {
      const h = this.height;
      const w = this.width;
      canvas.height = this.window.innerHeight-20;
      canvas.width = this.window.innerWidth-20;
      this.height = this.window.innerHeight-20;
      this.width = this.window.innerWidth-20;

      if(w !== this.width || h !== this.height){
        const halfh=this.height/2;
        const halfw=this.width/2;
        for(let i = 0;i < Math.floor(this.spots.length) / 2;i++){
          this.spots[i].x = halfw + ( Math.random() * halfw)*Math.cos(i);
          this.spots[i].y = halfh + ( Math.random() * halfh)*Math.sin(i);
        }
        for(let i = Math.floor(this.spots.length / 2);i < this.spots.length;i++){
          this.spots[i].x = halfw + (halfw/4 + Math.random() * halfw/1.5)*Math.cos(-i);
          this.spots[i].y = halfh + (halfh/3 + Math.random() * halfh/2)*Math.sin(-i);
        }
      }

      this.render(ctx);

      setTimeout(startAnimation, 1000/30);
    };
    startAnimation();
  }

  render(ctx){
    ctx.fillStyle='#66ccff';
    ctx.fillRect(0, 0,this.width,this.height);
    for(let i = 0;i < this.fish.length;i++)
      this.fish[i].render(ctx);
    for(let i = 0;i < this.ripples.length;i++)
      this.ripples[i].render(ctx);
    for(let i = 0;i < this.foods.length;i++)
      this.foods[i].render(ctx);
  }
  click(x,y){
    let food = new Target(x,y,5);
    if(this.foods.length < this.maxFood)
      this.foods.push(food);
    else{
      this.foods[0].value=-1;
      this.foods.shift();
      this.foods.push(food);
    }
    for(let i = 0;i < this.fish.length;i++){
      this.fish[i].foodNotify(food);
    }
  }
  getClosestFood(x,y){
    if(this.foods.length < 1)
      return null;
    let target = this.foods[0]
    for(let i = 1;i < this.foods.length;i++)
      if(this.foods[i].getDistance(x,y) < target.getDistance(x,y))
        target=this.foods[i];
    return target;
  }
  getSpot(){
    return this.spots[Math.floor(this.spots.length * Math.random())];
  }
  bite(x,y,radius,fish){
    for(let i = 0;i < this.foods.length;i++){
      if(this.foods[i].getDistance(x,y) < radius + 10){
        this.foods[i].eaten(fish);
        this.foods.splice(i,1);
        i--;
      }
    }
    if(fish.target && fish.target.value===0)
      for(let i = 0;i < this.spots.length;i++)
        if(this.spots[i].getDistance(x,y) < 100)
          this.spots[i].eaten(fish);
  }
  ripple(x,y,size){
    this.ripples.push(new Ripple(x,y,size,this,this.ripples.length));
  }
}

module.exports = FishPond;
