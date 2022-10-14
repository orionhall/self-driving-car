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

    this.damaged = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    this.#move();
    this.polygon = this.#createPolygon(
      this.angle,
      this.width,
      this.height,
      this.x,
      this.y
    );
    const slightlySmallerPolygon = this.#createPolygon(
      this.angle,
      this.width - 10,
      this.height - 6,
      this.x,
      this.y
    );
    this.rightHeadlightPolygon = this.#createPolygon(
      this.angle,
      6,
      4,
      slightlySmallerPolygon[0].x,
      slightlySmallerPolygon[0].y
    );
    this.leftHeadlightPolygon = this.#createPolygon(
      this.angle,
      6,
      4,
      slightlySmallerPolygon[1].x,
      slightlySmallerPolygon[1].y
    );
    this.damaged = this.#assessDamage(roadBorders);
    this.sensor.update(roadBorders);
  }

  draw(ctx) {
    this.sensor.draw(ctx);
    this.#drawCar(ctx);
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        console.log("yes");
        return true;
      }
    }

    return false;
  }

  #createPolygon(angle, width, height, x, y) {
    const points = [];

    // Line from the center to any of the points
    const radius = Math.hypot(width, height) / 2;

    // Angle from midline of car to the radius
    const alpha = Math.atan2(width, height);

    // We want to find the coordinates of a point
    // We have the hypotenuse from the center of a rectangle to that point,
    // so we want to find the lengths of the other two sides.
    // No, not quite.
    // We want to make a triangle where the x-axis is one of the sides and get its length,
    // and then where the y-axis is one of the sides and get that length.
    //
    // We know the angle from the axis to the midline,        (this.angle)
    // and we know the angle from the midline to the radius,  (alpha)
    // so we can use that to determine the angle from the radius to an axis.
    //
    // After that,
    // sin(someAngle) = opposite / hypotenuse
    // cos(someAngle) = adjacent / hypotenuse
    // So it gives us our opposite/adjacent side lengths which make our coordinates.

    // Top right
    points.push({
      x: x - Math.sin(angle - alpha) * radius,
      y: y - Math.cos(angle - alpha) * radius,
    });

    // Top left
    points.push({
      x: x - Math.sin(angle + alpha) * radius,
      y: y - Math.cos(angle + alpha) * radius,
    });

    // Bottom left bc it's 180 degrees around
    points.push({
      x: x - Math.sin(Math.PI + angle - alpha) * radius,
      y: y - Math.cos(Math.PI + angle - alpha) * radius,
    });

    // Bottom right
    points.push({
      x: x - Math.sin(Math.PI + angle + alpha) * radius,
      y: y - Math.cos(Math.PI + angle + alpha) * radius,
    });

    return points;
  }

  #drawCar(ctx) {
    // Draw the rectangle
    ctx.fillStyle = this.damaged ? "gray" : "blue";
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
