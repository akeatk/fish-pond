const Fish = require('./fish');
const Target = require('./target');
const Ripple = require('./ripple');

class FishPond {
  constructor(window){
    this.var=0.001;
    this.instructions=true;
    this.opacity = .8;
    this.ops = this.opacity/60;
    this.maxFood=100;
    this.window=window;
    this.height = this.window.innerHeight-20;
    this.width = this.window.innerWidth-20;
    this.c=0;
    this.spots=[new Target(0,0,0)];
    for(let i = 1;i < 100;i++)
      this.spots.push(new Target(0,0,0,this.spots[i-1]));
    this.spots[0].nextSpot=this.spots[this.spots.length - 1];

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

    this.foods=[];
    this.ripples=[];
    this.fish=[
      new Fish({
        mass:150,
        x:-100,
        y:this.height/2,
        pond:this,
        radian:0
      }),
      new Fish({
        mass:50,
        x:this.width+100,
        y:this.height/2,
        pond:this,
        radian:Math.PI
      })
    ];
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
    this.fish.sort((a,b)=>b.mass-a.mass);
    for(let i = 0;i < this.fish.length;i++)
      this.fish[i].render(ctx);
    for(let i = 0;i < this.ripples.length;i++)
      this.ripples[i].render(ctx);
    for(let i = 0;i < this.foods.length;i++)
      this.foods[i].render(ctx);

    this.fontSize = this.height/12;
    if(this.width/20 < this.fontSize)
      this.fontSize = this.width/20;
    if(this.opacity > 0){
      ctx.fillStyle=`rgba(50,50,50,${this.opacity})`;
      ctx.fillRect(0,0,this.width,this.height);
      ctx.fillStyle=`rgba(0,0,0,${this.opacity*1.25})`;
      ctx.font = `${this.fontSize}px Arial`;
      ctx.fillText("Click to place fish food",this.width/2-this.fontSize*5.1,this.height/2-this.fontSize);
      ctx.fillText("Watch the fish grow as they eat",this.width/2-this.fontSize*7,this.height/2+this.fontSize);
      if(!this.instructions)
        this.opacity -= this.ops;
    }
    if(!this.instructions && this.opacity < 0){
    ctx.font = `${this.fontSize*.7}px Arial`;
      ctx.fillStyle='blue';
      ctx.fillRect(5,5,this.fontSize*6+6,this.fontSize+6);
      ctx.fillStyle='white';
      ctx.fillRect(8,8,this.fontSize*6,this.fontSize);
      ctx.fillStyle='black';
      ctx.fillText('Attract More Fish',this.fontSize*.4,this.fontSize*.92);
    }
  }
  click(x,y){
    this.instructions=false;
    let food = new Target(x,y,3);
    if(this.opacity < 0 &&x > 5&&y>5&&x<this.fontSize*6+6&&y<this.fontSize+6){
      this.fish.push(
        new Fish({
          mass:35+Math.sqrt(Math.random()*10000)+this.var,
          x:this.width/2,
          y:-200,
          pond:this
        })
      );
      this.var+=0.001
    }
    else{
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
        if(this.spots[i].getDistance(x,y) < 200)
          this.spots[i].eaten(fish);
  }
  ripple(x,y,size){
    this.ripples.push(new Ripple(x,y,size,this,this.ripples.length));
  }
}

module.exports = FishPond;
