// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

class VehicleRoam {
    static debug = false;
  
    // Constructor initialize all values
    constructor(x, y, ms, mf,img) {
      this.position = createVector(x, y);
      this.r = 20;
      this.maxspeed = ms;
      this.maxforce = mf;
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(this.maxspeed, 0);
      this.image = img;
  
      this.wanderWeight = 1;
      this.followPathWeight = 2;
      this.separateWeight = 3;
  
      // pour comportement wander
      this.distanceCercle = 250;
      this.wanderRadius = 60;
      this.wanderTheta = PI / 2;
      this.displaceRange = random(-0.3, 0.3);
  
      // trail behind vehicles
      this.pathMaxLength = 20;
      this.path = [];
    }
  
    // Implements two behaviors: complex path following and separation
    applyBehaviors(vehicles, path) {
      let f = this.follow(path); // Following path
      let s = this.separate(vehicles); // Separation
      let w = this.wander(); // Wandering behavior
  
      // Weighted sum of the forces
      f.mult(this.followPathWeight);
      s.mult(this.separateWeight);
      w.mult(this.wanderWeight);
  
      // Apply the forces
      this.applyForce(f);
      this.applyForce(s);
      this.applyForce(w);
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    run() {
      this.update();
      this.render();
    }
  
    // Follow the path using Craig Reynolds' algorithm
    follow(path) {
      let predict = this.velocity.copy();
      predict.normalize();
      predict.mult(25);
      let predictpos = p5.Vector.add(this.position, predict);
  
      let normal = null;
      let target = null;
      let worldRecord = 1000000;
  
      for (let i = 0; i < path.points.length; i++) {
        let a = path.points[i];
        let b = path.points[(i + 1) % path.points.length];
  
        let normalPoint = findProjection(predictpos, a, b);
  
        let dir = p5.Vector.sub(b, a);
        if (
          normalPoint.x < min(a.x, b.x) ||
          normalPoint.x > max(a.x, b.x) ||
          normalPoint.y < min(a.y, b.y) ||
          normalPoint.y > max(a.y, b.y)
        ) {
          normalPoint = b.copy();
          a = path.points[(i + 1) % path.points.length];
          b = path.points[(i + 2) % path.points.length];
          dir = p5.Vector.sub(b, a);
        }
  
        let d = p5.Vector.dist(predictpos, normalPoint);
        if (d < worldRecord) {
          worldRecord = d;
          normal = normalPoint;
  
          dir.normalize();
          dir.mult(25);
          target = normal.copy();
          target.add(dir);
        }
      }
  
      if (VehicleRoam.debug) {
        stroke(0);
        fill(0);
        line(this.position.x, this.position.y, predictpos.x, predictpos.y);
        ellipse(predictpos.x, predictpos.y, 4, 4);
        stroke(0);
        fill(0);
        ellipse(normal.x, normal.y, 4, 4);
        line(predictpos.x, predictpos.y, target.x, target.y);
  
        if (worldRecord > path.radius) fill(255, 0, 0);
        noStroke();
        ellipse(target.x, target.y, 8, 8);
      }
  
      if (worldRecord > path.radius) {
        return this.seek(target);
      } else {
        return createVector(0, 0);
      }
    }
  
    separate(boids) {
      let desiredSeparation = this.r * 2;
      let steer = createVector(0, 0);
      let count = 0;
  
      for (let other of boids) {
        let d = p5.Vector.dist(this.position, other.position);
        if (d > 0 && d < desiredSeparation) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) steer.div(count);
  
      if (steer.mag() > 0) {
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    }
  
    wander() {
      let wanderPoint = this.velocity.copy();
      wanderPoint.setMag(this.distanceCercle);
      wanderPoint.add(this.position);
  
      if (VehicleRoam.debug) {
        fill(255, 0, 0);
        noStroke();
        circle(wanderPoint.x, wanderPoint.y, 8);
        noFill();
        stroke(0);
        circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);
        line(this.position.x, this.position.y, wanderPoint.x, wanderPoint.y);
      }
  
      let theta = this.wanderTheta + this.velocity.heading();
      let x = this.wanderRadius * cos(theta);
      let y = this.wanderRadius * sin(theta);
  
      wanderPoint.add(x, y);
  
      if (VehicleRoam.debug) {
        fill(0, 255, 0);
        noStroke();
        circle(wanderPoint.x, wanderPoint.y, 16);
        stroke(0);
        line(this.position.x, this.position.y, wanderPoint.x, wanderPoint.y);
      }
  
      let steer = wanderPoint.sub(this.position);
      steer.setMag(this.maxforce);
  
      this.wanderTheta += random(-this.displaceRange, this.displaceRange);
      return steer;
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
  
      this.path.push(this.position.copy());
      if (this.path.length > this.pathMaxLength) {
        this.path.shift();
      }
    }
  
    seek(target) {
      let desired = p5.Vector.sub(target, this.position);
      desired.normalize();
      desired.mult(this.maxspeed);
  
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
  
      return steer;
    }
  
    render() {
        push();
        translate(this.position.x, this.position.y);
        if (this.image) {
          imageMode(CENTER);
          image(this.image, 0, 0, this.r * 2, this.r * 2);
        }
        pop();
      }
  
    edges() {
      if (this.position.x > width + this.r) {
        this.position.x = -this.r;
      } else if (this.position.x < -this.r) {
        this.position.x = width + this.r;
      }
      if (this.position.y > height + this.r) {
        this.position.y = -this.r;
      } else if (this.position.y < -this.r) {
        this.position.y = height + this.r;
      }
    }
  }
  
  function findProjection(p, a, b) {
    let ap = p5.Vector.sub(p, a);
    let ab = p5.Vector.sub(b, a);
    ab.normalize();
    ab.mult(ap.dot(ab));
    return p5.Vector.add(a, ab);
  }
  