const FishPond = require('./fish_pond.js')

const canvas = document.getElementsByTagName("canvas")[0];
let pond = new FishPond(window);

function clickCanvas(e) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;


}

canvas.addEventListener('click', clickCanvas, false);
pond.start(canvas);
