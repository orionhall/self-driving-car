// So it's funny that we're supposed to be learning about code style
// and stuff when you have a function named lerp which is short for
// linear interpolation which is also obscure and it has nondescript
// parameters.
function lerp(A, B, t) {
  // return left + (right - left) * percentage;
  return A+(B-A)*t;
}
