class Path {
    constructor() {
      this.radius = 20; // Width of the path
      this.points = [];
    }
  
    addPoint(x, y) {
      let point = createVector(x, y);
      this.points.push(point);
    }
  
    display() {
      if (VehicleRoam.debug) {
        // Only show the path when debugging
        stroke(0); // Black centerline for debug
        strokeWeight(1);
        noFill();
  
        beginShape();
        for (let v of this.points) {
          vertex(v.x, v.y);
        }
        endShape(CLOSE);
      }
    }
  }
  