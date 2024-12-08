let path;
let vehicles = [];
let debug = false;
// Added from original code
let pursuer1, pursuer2;
let target;
let obstacles = [];
let Banzaivehicules = [];

// Preload bird images and other assets
let birdImages = [];
let obstacleImage; // For obstacle
let bulletBillImage; // For custom mouse cursor

function preload() {
  birdImages.push(loadImage("assets/bird.png"));
  birdImages.push(loadImage("assets/bird2.png"));
  birdImages.push(loadImage("assets/bird3.png"));

  // Load the custom images
  obstacleImage = loadImage("assets/hardblock.png");
  bulletBillImage = loadImage("assets/Bullet_Bill.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor(); // Hide the default cursor
  newPath();

  // Add initial birds
  for (let i = 0; i < 21; i++) {
    let img = random(birdImages);
    let xPosition = random(width);
    let yPosition = random(100, 120); // Near the top
    newVehicleRoam(xPosition, yPosition, img);
  }

  // Added from original code
  pursuer1 = new VehicleBanzai(100, 100);
  pursuer2 = new VehicleBanzai(random(width), random(height));

  Banzaivehicules.push(pursuer1);

  // Create an obstacle in the center of the screen
  obstacles.push(new Obstacle(width / 2, height / 2, 100, obstacleImage));
}

function draw() {
  // Dynamically set the HTML background
  document.body.style.backgroundImage = "url('assets/mariobackground_upscaled.jpg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Clear the canvas without covering the HTML background
  clear();

  // Update target (mouse position)
  target = createVector(mouseX, mouseY);

  // Draw obstacles
  obstacles.forEach((o) => {
    o.show();
  });

  // Update and render pursuers
  Banzaivehicules.forEach((v) => {
    v.applyBehaviors(target, obstacles, Banzaivehicules);
    v.update();
    v.show();
  });

  // Draw the path
  path.display();

  // Update and render all vehicles
  vehicles.forEach((v) => {
    v.applyBehaviors(vehicles, path);
    v.run();
  });

  // Draw custom cursor
  drawCustomCursor();
}

// Function to draw a smaller Bullet_Bill as the custom cursor
function drawCustomCursor() {
  if (mouseX !== undefined && mouseY !== undefined) {
    imageMode(CENTER);
    if (bulletBillImage) {
      image(bulletBillImage, mouseX, mouseY, 32, 32); // Draw the Bullet_Bill at mouse position
    }
  }
}

// Add an obstacle when the mouse is pressed
function mousePressed() {
  // Create an obstacle at the mouse position with random size
  let newObstacle = new Obstacle(mouseX, mouseY, random(20, 100), obstacleImage);
  obstacles.push(newObstacle); // Add to the obstacles array
}

// Function to define the rectangular path
function newPath() {
  path = new Path();
  let margin = 50;

  // Add points to form a rectangle near the top of the screen
  path.addPoint(margin, margin); // Top-left
  path.addPoint(width - margin, margin); // Top-right
  path.addPoint(width - margin, margin + 30); // Bottom-right
  path.addPoint(margin, margin + 30); // Bottom-left
}

// Function to create a new bird/vehicle with image
function newVehicleRoam(x, y, img) {
  let maxspeed = random(3, 5);
  let maxforce = 0.2;
  let vehicle = new VehicleRoam(x, y, maxspeed, maxforce, img);
  vehicles.push(vehicle);
}

// Add new birds when dragging the mouse
function mouseDragged() {
  let img = random(birdImages);
  newVehicleRoam(mouseX, mouseY, img);
}

// Toggle debug mode to display vectors and paths
function keyPressed() {
  if (key === "d") {
    debug = !debug;
    VehicleRoam.debug = debug;
    VehicleBanzai.debug = !VehicleBanzai.debug;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Ensure the canvas resizes with the window
}
