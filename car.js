class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;

    this.angle = 0;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    this.#move();
    this.polygon = this.#createPolygon();
    this.sensor.update(roadBorders);
  }

  #createPolygon() {
    const points = [];
    // Radius of the circle from the center point of the car
    const radius = Math.hypot(this.width, this.height) / 2;
    // Angle from midline of car to the radius (?)
    const alpha = Math.atan2(this.width, this.height);

    // this.angle - alpha
    // If car straight, that's like y'know -30 degrees
    // multiplied by radius gives x point radius distance away
    // which would be the top left, but subtract this.x to make it top right
    // which is somewhat confusing, but I think it's because y goes downwards
    // so if we were using this.x + and this.y +, this would actually be bottom left
    // :shrug:

    // Top right
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });

    // Top left
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });

    // Bottom right
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });

    // Bottom left
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
  }

  draw(ctx) {
    this.sensor.draw(ctx);
    this.#drawCar(ctx);
  }

  #drawCar(ctx) {
    // Draw the rectangle
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    // Make some silly headlights
    const topRight = this.polygon[0];
    const topLeft = this.polygon[1];
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(
      topRight.x - this.width * 0.3, // this confused me but the beginning point is the left side
      topRight.y + 3,
      this.width * 0.2,
      this.height * 0.1
    );
    ctx.fill();

    ctx.beginPath();
    ctx.rect(
      topLeft.x + this.width * 0.15,
      topLeft.y + 3,
      this.width * 0.2,
      this.height * 0.1
    );
    ctx.fill();

    ctx.fillStyle = "#000000";
  }

  #move() {
    this.#applyAcceleration();

    this.#applyFriction();

    this.#applySteering();

    this.#updateCoordinates();
  }

  #applyAcceleration() {
    // Apply forward/backward
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    // Apply maximum speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
  }

  #applyFriction() {
    // Apply friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // Stop car
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
  }

  #applySteering() {
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
  }

  #updateCoordinates() {
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
