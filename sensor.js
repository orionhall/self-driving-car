class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    // This is the same as 90 degrees
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();

    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const polygon = traffic[i].polygon;
      for (let j = 0; j < polygon.length; j++) {
        // See if this ray intersects with any of the sides of the polygon
        const touch = getIntersection(ray[0], ray[1], polygon[j], polygon[(j + 1) % polygon.length])
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offsets);

      return touches.find((touch) => touch.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // I think this is because 90 degrees is the whole "range" of the rays
      // and the middle is "0" so the left is -90/2 and the right is 90/2... (or maybe the opposite)
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      // So doing sin(angle) gives you a number you can then multiply by a length to give an x along that angle
      // And cos(angle) for y

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        // I know nothing about trigonometry anymore
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const rayStart = this.rays[i][0];
      const rayEnd = this.rays[i][1];
      const collisionPoint = this.readings[i];

      if (collisionPoint === null) {
        this.#drawRay(ctx, rayStart, rayEnd, "yellow");
      } else {
        this.#drawRay(ctx, rayStart, collisionPoint, "yellow");
        this.#drawRay(ctx, collisionPoint, rayEnd, "black");
      }
    }
  }

  #drawRay(ctx, startPoint, endPoint, color) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  }
}
