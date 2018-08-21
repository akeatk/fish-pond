const Fish = require('./fish');

class FishPond {
  constructor(window){
    this.window=window;
    this.height=this.window.innerHeight;
    this.width=this.window.innerWidth;

    this.fish=[
      new Fish({
        mass:50,
        x:200,
        y:200
      }),
      new Fish({
        mass:1200,
        x:400,
        y:200
      }),
      // new Fish({
      //   mass:75,
      //   x:600,
      //   y:300
      // }),
    ];

    // bends fish to the max and calculates center of mass
    this.fish[1].bend();
    this.fish[1].calcCenter();
  }

  start(canvas){
    const ctx = canvas.getContext("2d");

    const startAnimation = () => {
      canvas.height = this.window.innerHeight-20;
      canvas.width = this.window.innerWidth-20;
      this.height = this.window.innerHeight-20;
      this.width = this.window.innerWidth-20;
      this.render(ctx);

      // setTimeout(startAnimation, 1000/30);
    };
    startAnimation();
  }

  render(ctx){
    ctx.fillRect(5, 5,this.width,this.height);
    ctx.clearRect(5, 5, this.width/2, this.height/2);
    for(let i = 0;i < this.fish.length;i++)
      this.fish[i].render(ctx);
  }
}

module.exports = FishPond;
