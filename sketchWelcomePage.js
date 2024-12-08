// Variables for assets and game elements
let bgImage, bowserImage, marioImage, luigiImage, peachImage, mushroomImage;
let bowser, characters;
let target;

function preload() {
  // Load assets
  bgImage = loadImage('assets/mariobackground_upscaled.jpg');
  bowserImage = loadImage('assets/Bowser.png');
  marioImage = loadImage('assets/mario.png');
  luigiImage = loadImage('assets/luigi.png');
  peachImage = loadImage('assets/peach.png');
  mushroomImage = loadImage('assets/mushroom.png'); // Cursor
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize Bowser
  bowser = new Vehicle(width / 2, height / 2, bowserImage);
  bowser.r = 150;
  bowser.maxSpeed = 2;

  // Initialize characters: Mario, Luigi, Peach
  characters = [
    new Vehicle(random(width), random(height), marioImage),
    new Vehicle(random(width), random(height), luigiImage),
    new Vehicle(random(width), random(height), peachImage),
  ];

  // Set properties for characters
  characters.forEach((character) => {
    character.r = 100;
    character.maxSpeed = 2.5;
    character.maxForce = 0.1;
  });

  // Initialize target for mouse behavior
  target = createVector(mouseX, mouseY);
  target.r = 50;
}

function draw() {
  // Dynamically update the HTML background
  document.body.style.backgroundImage = "url('assets/mariobackground_upscaled.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Clear the canvas
  clear();

  // Update target (mouse position)
  target.x = mouseX;
  target.y = mouseY;

  // Bowser logic: Chase the closest character
  let closestCharacter = getClosestCharacter();
  if (closestCharacter) {
    // Bowser speeds up to chase the closest character
    let seekForce = bowser.seek(closestCharacter.pos);
    seekForce.mult(1.5); // Increase Bowser's chase intensity
    bowser.applyForce(seekForce);

    // Closest character increases speed to escape
    closestCharacter.maxSpeed = 4; // Increase escape speed
    closestCharacter.fleeWithTargetRadius(bowser, 200);
  }

  // Bowser movement and display
  bowser.wander();
  bowser.edges(); // Keep Bowser within bounds
  bowser.update();
  bowser.show();

  // Reset other characters' max speed and update their behavior
  characters.forEach((character) => {
    if (character !== closestCharacter) {
      character.maxSpeed = 2.5; // Reset speed for other characters
    }
    character.fleeWithTargetRadius(target, 150); // Avoid the mouse
    character.edges(); // Keep characters within bounds
    character.update();
    character.show();
  });

  // Draw Bowser's range of sight
  noFill();
  stroke("yellow");
  ellipse(bowser.pos.x, bowser.pos.y, 400, 400); // Range of sight

  // Draw Mushroom cursor
  drawMushroomCursor();

}

function getClosestCharacter() {
  let closest = null;
  let minDistance = Infinity;

  characters.forEach((character) => {
    let distance = p5.Vector.dist(bowser.pos, character.pos);
    if (distance < minDistance) {
      minDistance = distance;
      closest = character;
    }
  });

  return closest;
}

function drawMushroomCursor() {
  imageMode(CENTER);
  image(mushroomImage, mouseX, mouseY, 50, 50); // Display mushroom as cursor
  noCursor(); // Hide default cursor
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas to fit the new window size
}

function mouseDragged() {
  // Add new Mario character when mouse is dragged
  const b = new Vehicle(mouseX, mouseY, marioImage);
  b.r = random(80, 100);
  characters.push(b);
}

function keyPressed() {
  if (key === '1') {
    // Action for starting the game
    console.log('Start game pressed!');
  } else if (key === '2') {
    // Action for displaying the guide
    console.log('Guide option pressed!');
  }
}