# Fish Pond
-------------------------

## Background and Overview

Fish Pond is a digital adaptation of a traditional outdoor fish pond. It provides you with a top down view of fish and lets you to feed and watch them grow.

A fish uses a chain of dot objects, where the movement of the fish is determined by the mass and movement of the parts it is composed of. It will swim around on its own and swim towards food, which can be placed in the water by clicking. A fish will grow as it eats food. As the fish grows, it will become wider, longer, and has changes to its fins.

--------------------------------

![](https://i.imgur.com/NEakQ15.png)

--------------------------

## Architecture and Technologies

This project uses the following technologies:

* Javascript for the overall structure and logic.
* `HTML5 Canvas` for the rendering.
* Webpack to bundle and serve up the scripts

There will be 6 scripts involved:

* `main.js` is the webpack entry file.
* `fish_pond.js` is responsible for handling the creation of the pond, fish, food, updating the canvas, and user input.
* `fish.js` is responsible for the logic (growth, scaling, actions) and rendering of fish in the pond.
* `target.js` houses the logic for food the user places.
* `ripple.js` houses the logic and visuals for ripples created when fish eat food.

-----------------------------------

## Challenges During the project

The primary function that needed to be finished for the project was to get fish that moved naturally enough to not stick out as odd. The initial approach was to have a head and a chain of dots following it. As the head moved, the rest of the body followed in a chain reaction. The net movement of the parts were summed up and applied to all the parts to maintain the center o gravity. To make the fish move forward, I took the movements of the tail and used it's net change in distance every movement as an accelerator to the fish's forward movement, which is the direction the head is facing. The combination started out as odd and had wide turns, so I added some modifiers based on distance from food and difference in the angles between the food's direction and the fish head's direction to reduce the chances of fish being unable to reach food fast enough.

The next challenge was to implement fins to the fish that flowed with the rest of the fish movements. Each fin consists of several lines of dots, each with slightly different offset from one another to cover a large area when they are filled in with color. Each dot in the fin's skeleton had a average velocity over time that reduced the amount it reacted to the fish's turns.

Both of these processes used two fundamental techniques in the dot skeleton of the fish: rotate and connecting a dot to the previous part.

Rotate:
~~~~~
rotate(angle){
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  const dx = this.x - this.prevPart.x;
  const dy = this.y - this.prevPart.y;

  this.x=dx*c-dy*s + this.prevPart.x;
  this.y=dx*s+dy*c + this.prevPart.y;
}
~~~~~

This function allowed easy realigning of dots so that I could manage angles and distances separately, which simplified the code.

Connecting a dot to the previous part:
~~~~~~~~~~~~~
this.x = this.prevPart.x + this.fin.pieceLength * Math.cos(this.radian + Math.PI);
this.y = this.prevPart.y + this.fin.pieceLength * Math.sin(this.radian + Math.PI);
~~~~~~~~~~~~~
This function pulls the dot to within a set distance of the previous piece or pushes itself away to that distance. This, in conjunction with rotate, allowed for easy manipulation of the whole fish skeleton and fins with the help of selectors for how much the dots needed to move or rotate.
