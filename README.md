# Fish Pond
-------------------------

## Background and Overview

Fish Pond is a digital version of a traditional outdoor fish pond. It provides you with a top down view of fish and lets you to feed them and watch them grow.

A fish use a chain of circular objects, where the movement of the fish is determined by the mass and movement of the parts it is composed of. It will swim around on its own and swim towards food, which can be placed in the water by clicking. A fish will grow as it eats food. As the fish grows, it will become wider, longer, and have changes in its color.

Functionality & MVP
In Fish Pond, users will be able to:

- [ ] Add fish to the pond
- [ ] Have the fish move using a basic physics equation.
- [ ] Feed the fish
- [ ] See ripple effects when fish eats food
- [ ] View the fish change as it grows, growing differently based unseen variables

--------------------------------

## Wireframes

This app will consist of one screen that spans the size of the inner window. There will be an options button at the bottom left corner that when pressed, shows a panel that shows options for adding fish, resetting the tank, has a tab for each fish in the pond (there will be a hard limit to the number of fish in the tank), and will also have my information.

![](https://i.imgur.com/DWEzaty.png)

![](https://i.imgur.com/00C8tM0.png)

--------------------------

## Architecture and Technologies

This project will be implemented with the following technologies:

* Javascript for the overall structure and logic.
* `HTML5 Canvas` for the rendering.
* Webpack to bundle and serve up the scripts

There will be 4 scripts involved:

* `main.js` is the webpack entry file.
* `fish_pond.js` is responsible for handling the creation of the pond, fish, food, updating the canvas, and user input.
* `fish.js` is responsible for the logic (growth, scaling, actions) and rendering of fish in the pond.
* `food.js` houses the logic for food the user places.

## Implementation Timeline

Over the weekend:
- [ ] Finish the moving components of the fish (does not include graphics)

Day 1:
- [ ] Finish the graphics for the fish.
  - [ ] uses the location and angle of the components of a fish to draw out a complete fish.
  - [ ] Add simple fins to the fish

Day 2:
- [ ] get the general ai of the fish working
  - [ ] start on food, which impacts the fish ai

day 3:
- [ ] finish food and fish interactions

day 4:
- [ ] Complete the UI that the user will interact with (the options panel)
  - [ ] add a button to show the options panel
  - [ ] add a button for adding fish
  - [ ] add information such as linkedin and github of project to options panel

Bonus features:
- [ ] provide a way to generate a string that can be re-entered into the options to add a fish. codes are not unique.
- [ ] have fish grow patterns as they increase in size
