class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;
    this.laneWidth = width / laneCount;

    // could be a better name, left side of road
    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = infinity;
    this.bottom = -infinity;

    const topLeft = { x: this.left, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const topRight = { x: this.right, y: this.top };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    return (
      this.left +
      this.laneWidth / 2 +
      Math.min(laneIndex, this.laneCount) * this.laneWidth
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 0; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.moveTo(border[1].x, border[1].y);
      ctx.stroke();
    });

    // Draw left side of road
    ctx.beginPath();
    ctx.moveTo(this.left, this.top);
    ctx.lineTo(this.left, this.bottom);
    ctx.stroke();

    // Draw right side of road
    ctx.beginPath();
    ctx.moveTo(this.right, this.top);
    ctx.lineTo(this.right, this.bottom);
    ctx.stroke();
  }
}
