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
  clear();

  target.x = mouseX;
  target.y = mouseY;

  vehicles.forEach((vehicle, index) => {
    let steeringForce;

    switch (mode) {
      case "snake":
        if (index === 0) {
          steeringForce = vehicle.arrive(target, 0);
        } else {
          let leader = vehicles[index - 1];
          let followDistance = 50; // Adjusted distance for better spacing
          steeringForce = vehicle.arrive(leader.pos, followDistance);
        }
        break;

      case "leader":
        if (index === 0) {
          steeringForce = vehicle.arrive(target, 0);
        } else {
          let leader = vehicles[0];
          let offset = calculateOffset(index, leader);
          let desiredPosition = p5.Vector.add(leader.pos, offset);

          if (p5.Vector.dist(vehicle.pos, leader.pos) < leader.r * 2) {
            steeringForce = vehicle.flee(leader.pos);
          } else {
            steeringForce = vehicle.arrive(desiredPosition, 0);
          }
        }
        break;
    }

    vehicle.applyForce(steeringForce);
    vehicle.update();
    vehicle.show();
  });
}

function calculateOffset(index, leader) {
  let spacing = 60;
  let row = floor((index - 1) / 3);
  let col = (index - 1) % 3;

  let angle = leader.vel.heading();
  let xOffset = col * spacing * cos(angle) - row * spacing * sin(angle);
  let yOffset = col * spacing * sin(angle) + row * spacing * cos(angle);

  return createVector(xOffset, yOffset);
}

function keyPressed() {
  if (key === 'd') {
    gameVehicle.debug = !gameVehicle.debug;
  } else if (key === 's') {
    mode = "snake";
  } else if (key === 'l') {
    mode = "leader";
  }
}
