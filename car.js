class Car {
  constructor({
    initialPosition: { x, y },
    size: { width, height },
    controlType,
    maxSpeed = 3,
    color,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;

    this.angle = 0;

    this.damaged = false;

    this.color = color;

    if (controlType !== "DUMMY") {
      this.sensor = new Sensor(this);
    }

    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = createPolygon(
        this.x,
        this.y,
        this.width,
        this.height,
        this.angle
      );
      const slightlySmallerPolygon = createPolygon(
        this.x,
        this.y,
        this.width - 10,
        this.height - 6,
        this.angle
      );
      this.rightHeadlightPolygon = createPolygon(
        slightlySmallerPolygon[0].x,
        slightlySmallerPolygon[0].y,
        6,
        4,
        this.angle
      );
      this.leftHeadlightPolygon = createPolygon(
        slightlySmallerPolygon[1].x,
        slightlySmallerPolygon[1].y,
        6,
        4,
        this.angle
      );

      this.damaged = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  draw(ctx) {
    if (this.sensor) {
      this.sensor.draw(ctx);
    }

    this.#drawCar(ctx);
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }

    return false;
  }

  #drawCar(ctx) {
    // Draw the rectangle
    ctx.fillStyle = this.damaged ? "gray" : this.color;
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    // Make some silly headlights
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(
      this.rightHeadlightPolygon[0].x,
      this.rightHeadlightPolygon[0].y
    );
    for (let i = 1; i < this.rightHeadlightPolygon.length; i++) {
      ctx.lineTo(
        this.rightHeadlightPolygon[i].x,
        this.rightHeadlightPolygon[i].y
      );
    }
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.leftHeadlightPolygon[0].x, this.leftHeadlightPolygon[0].y);
    for (let i = 1; i < this.leftHeadlightPolygon.length; i++) {
      ctx.lineTo(
        this.leftHeadlightPolygon[i].x,
        this.leftHeadlightPolygon[i].y
      );
    }
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
