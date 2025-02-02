/**************************\
 *                        *
 * Platforer Starter Code *
 *                        *
 *      CLICK CANVAS      *
 *   USE THE ARROW KEYS   *
 *                        *
 *      ←🟧→             *
 *    ==============      *
 *                        *
 *    See:                *
 *    -  Player.js        *
 *    -  Platform.js      *
 *                        *
\**************************/

let player;
let platforms = [];
let gameStarted = false;

// Building a WONDER-FULL world.
function setup() {
  createCanvas(600, 400);
  
  // Our tiny mighty hero:
  player = new Player(300, 40);

  // Create some platforms:
  platforms.push(new Platform(200, 120, 200, 10));
  platforms.push(new Platform(300, 210, 200, 10));
  platforms.push(new Platform(100, 300, 200, 10));
  
  // Bottom platform extends 500px past both edges:
  platforms.push(new Platform(-500, 390, 1600, 10));
}

// Tick-Tock
function draw() {
  background(255,255,255);

  if (!gameStarted) {
    startScreen();
    return;
  }

  // Display platforms:
  for (let platform of platforms) {
    platform.display();
  }

  // Update and display the player:
  player.processInput();
  player.updatePhysics();
  player.platformCollisions(platforms);
  player.display();
}

// Keyboard won't work until canvas captures the mouse.
function startScreen() {
  push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(50, 150, 250);
    text("Click for Adventure!", width / 2, height / 2);
  pop();
}

// Dismiss startScreen on mouse pressed.
function mousePressed() {
  gameStarted = true;
}
