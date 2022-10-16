// So it's funny that we're supposed to be learning about code style
// and stuff when you have a function named lerp which is short for
// linear interpolation which is also obscure and it has nondescript
// parameters.
function lerp(A, B, t) {
  // return left + (right - left) * percentage;
  return A + (B - A) * t;
}

// Maybe check out the segment intersection video
// rayStart, rayEnd, borderStart, borderEnd
// this is the intersection of two lines, so it's more like
// line1Start, line1End, line2Start, line2End
function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const segment1Start = poly1[i];
      const segment1End = poly1[(i + 1) % poly1.length];
      const segment2Start = poly2[j];
      const segment2End = poly2[(j + 1) % poly2.length];

      const touch = getIntersection(
        // these two are creating a line segment of poly1
        segment1Start,
        // the mod is to prevent going out of bounds of the array
        segment1End,
        segment2Start,
        segment2End
      );

      if (touch) {
        return true;
      }
    }
  }

  return false;
}

function createManyPolygons(x, y, width, height, angle, numPolys) {
  const polygons = [];
  const perPolyWidth = width / numPolys;
  const perPolyHeight = height / numPolys;

  for (let i = 0; i < numPolys; i++) {
    const thisPolyWidth = perPolyWidth + i * perPolyWidth;
    const thisPolyHeight = perPolyHeight + i * perPolyHeight;

    polygons.push(createPolygon(x, y, thisPolyWidth, thisPolyHeight, angle));
  }

  return polygons;
}

// Playing with polygons is just fun
// this.manyPolygons = createManyPolygons(
//   this.x,
//   this.y,
//   100,
//   100,
//   this.angle,
//   5
// );
// #drawManyPolygons(ctx) {
//   const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
//   debugger;
//   for (let i = 0; i < this.manyPolygons.length; i++) {
//     const currentPolygon = this.manyPolygons[i];
//     ctx.strokeStyle = colors[i];
//     ctx.beginPath();
//     ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);
//     for (let j = 1; j < currentPolygon.length; j++) {
//       ctx.lineTo(currentPolygon[j].x, currentPolygon[j].y);
//     }
//     ctx.lineTo(currentPolygon[0].x, currentPolygon[0].y);
//     ctx.stroke();
//   }
// }

function createPolygon(x, y, width, height, angle) {
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
