const FishPond = require('./fish_pond.js')

const canvas = document.getElementsByTagName("canvas")[0];
new FishPond(window).start(canvas);
