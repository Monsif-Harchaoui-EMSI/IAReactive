let path;
let vehicles = [];
let debug = false;

// Preload bird images
let birdImages = [];

function preload() {
  birdImages.push(loadImage("assets/bird.png"));
  birdImages.push(loadImage("assets/bird2.png"));
  birdImages.push(loadImage("assets/bird3.png"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  newPath();

  // Add initial birds
  for (let i = 0; i < 21; i++) {
    let img = random(birdImages);
    let xPosition = random(width);
    let yPosition = random(100, 120); // Near the top
    newVehicleRoam(xPosition, yPosition, img);
  }
}

function draw() {
  clear(); // No background, HTML background used

  // Draw the path
  path.display();

  // Update and render all vehicles
  for (let v of vehicles) {
    v.applyBehaviors(vehicles, path);
    v.run();
    //v.edges(); // Ensure birds loop across the screen
  }
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
  }
}
