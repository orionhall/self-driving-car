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
