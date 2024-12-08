let target, vehicle;
let vehicles = [];
let mode = "snake";
let marioImg, luigiImg, peachImg, mushroomImg; // Images for snake mode

// Load assets
function preload() {
  marioImg = loadImage("./assets/mario.png");
  luigiImg = loadImage("./assets/luigi.png");
  peachImg = loadImage("./assets/peach.png");
  mushroomImg = loadImage("./assets/mushroom.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  target = createVector(random(width), random(height));
  creerDesVehicules(23); // Create Mario, Luigi, Peach, and 20 Mushrooms
}

function creerDesVehicules(nb) {
  for (let i = 0; i < nb; i++) {
    let img;
    if (i === 0) {
      img = marioImg; // Mario
    } else if (i === 1) {
      img = luigiImg; // Luigi
    } else if (i === 2) {
      img = peachImg; // Peach
    } else {
      img = mushroomImg; // Mushrooms
    }
    let vehicle = new gameVehicle(random(width), random(height), img);
    vehicle.r = 32; // Increase radius for better spacing
    vehicles.push(vehicle);
  }
}


// Draw loop
function draw() {
  clear(); // No background since the HTML background is used

  // Set target to mouse position
  target.x = mouseX;
  target.y = mouseY;

  vehicles.forEach((vehicle, index) => {
    let steeringForce;

    switch (mode) {
      case "snake":
        if (index === 0) {
          // Mario follows the mouse
          steeringForce = vehicle.arrive(target, 0);
        } else {
          // Other vehicles follow the one in front
          let leader = vehicles[index - 1];
          let followDistance = 50; // Adjusted distance for better spacing
          steeringForce = vehicle.arrive(leader.pos, followDistance);

          // Connect vehicles visually
          //stroke(255);
          //strokeWeight(2);
          //line(leader.pos.x, leader.pos.y, vehicle.pos.x, vehicle.pos.y);
        }
        break;
    }

    vehicle.applyForce(steeringForce);
    vehicle.update();
    vehicle.show();
  });
}

// Key controls for switching modes
function keyPressed() {
  if (key === 'd') {
    gameVehicle.debug = !gameVehicle.debug;
  } else if (key === 's') {
    mode = "snake";
  }
}
