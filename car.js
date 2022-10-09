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

    this.controls = new Controls();
  }

  update() {
    this.#move();
  }

  draw(ctx) {
    // Save state of canvas because we are about to translate and rotate it
    ctx.save();

    // Set starting point of context (car?)
    ctx.translate(this.x, this.y);

    // Apply rotation
    ctx.rotate(-this.angle);

    this.#drawCar(ctx);

    // Restore the context to its original state
    ctx.restore();
  }

  #drawCar(ctx) {
    // Build the rectangle
    ctx.fillStyle = "blue";
    ctx.beginPath();
    const xStart = -this.width / 2;
    const yStart = -this.height / 2;
    ctx.rect(xStart, yStart, this.width, this.height);
    ctx.fill();
    ctx.fillStyle = "#000000"

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(xStart + this.width * .15, yStart + 1, this.width * .2, this.height * .1);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(xStart + this.width * .65, yStart + 1, this.width * .2, this.height * .1);
    ctx.fill();
    ctx.fillStyle = "#000000"
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
