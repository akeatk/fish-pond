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
    this.height = this.window.innerHeight;
    this.width = this.window.innerWidth;
    this.vh = this.height/100;
    this.vw = this.width/100;
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
    this.fish=[];
    let fishCount = 1 + this.height * this.width / 70000;
    for(let i = 0;i < fishCount;i++)
      this.addFish();
  }

  start(canvas){
    const ctx = canvas.getContext("2d");

    const startAnimation = () => {
      const h = this.height;
      const w = this.width;
      canvas.height = this.window.innerHeight;
      canvas.width = this.window.innerWidth;
      this.height = this.window.innerHeight;
      this.width = this.window.innerWidth;
      this.vh = this.height/100;
      this.vw = this.width/100;

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

    this.fontSize = this.vh*10;
    if(this.width/20 < this.fontSize)
      this.fontSize = this.vw*5;
    if(this.opacity > 0){
      ctx.fillStyle=`rgba(50,50,50,${this.opacity})`;
      ctx.fillRect(0,0,this.width,this.height);
      ctx.fillStyle=`rgba(255,255,255,${this.opacity*1.25})`;
      ctx.font = `${this.fontSize}px Arial`;
      ctx.fillText("Click to place fish food",this.width/2-this.fontSize*5.1,this.height/2-this.fontSize);
      ctx.fillText("Watch the fish grow as they eat",this.width/2-this.fontSize*7,this.height/2+this.fontSize);
      if(!this.instructions)
        this.opacity -= this.ops;
    }
    if(this.opacity < 0.2){
      ctx.font = `${this.fontSize * .5}px Arial`;
      const txt='Attract More Fish';
      this.textWidth = ctx.measureText(txt).width;

      ctx.fillStyle='blue';
      ctx.fillRect(
        0,
        this.height-this.vh*4-this.fontSize * 0.5,
        this.vh*4+this.textWidth,
        this.fontSize*0.5+4*this.vh
      );

      ctx.fillStyle='white';
      ctx.fillRect(
        this.vh*1,
        this.height-this.vh*3-this.fontSize * 0.5,
        this.vh*2+this.textWidth,
        this.fontSize*0.5+2*this.vh
      );

      ctx.fillStyle='black';
      ctx.fillText(txt,this.vh*2,this.height-this.vh*3);
    }
  }
  click(x,y){
    this.instructions=false;
    let food = new Target(x,y,3);
    if(
      this.opacity < .2 &&
        x > 0 &&
        y > this.height-this.vh*4-this.fontSize * 0.5 &&
        x < this.vh*4+this.textWidth &&
        y < (this.height-this.vh*4-this.fontSize * 0.5) + this.fontSize*0.5+4*this.vh
    ){
      this.addFish();
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
  addFish(){
    let hov = Math.random() * 2;
    let x,y,dir;
    if(hov > 1){
      y = this.height / 2;
      hov = Math.random() * 2;
      if(hov > 1){
        x = -50;
        dir = 0.0001;
      }
      else{
        x = 50 + this.width;
        dir = Math.PI;
      }
    }
    else{
      hov = Math.random() * 2;
      x=this.width / 2
      if(hov > 1){
        y = -100;
        dir = Math.PI / 2;
      }
      else{
        y = this.height + 100;
        dir = Math.PI / 2 * 3;
      }
    }
    this.fish.push(
      new Fish({
        mass:35+Math.sqrt(Math.random()*10000)+this.var,
        x:x,
        y:y,
        pond:this,
        direction:dir
      })
    );
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
