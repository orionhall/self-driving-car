const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);

const car = new Car({
  initialPosition: {
    x: road.getLaneCenter(1),
    y: 100,
  },
  size: { width: 30, height: 50 },
  controlType: "KEYS",
  maxSpeed: 3,
  color: "blue",
});

const traffic = [
  new Car({
    initialPosition: { x: road.getLaneCenter(1), y: -100 },
    size: { width: 30, height: 50 },
    controlType: "DUMMY",
    maxSpeed: 2,
    color: "red",
  }),
];

function clearCanvas() {
  canvas.height = window.innerHeight;
}

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  clearCanvas();

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx);
  }
  car.draw(ctx);

  requestAnimationFrame(animate);
}

animate();
