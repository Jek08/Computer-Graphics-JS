const canvas = document.querySelector("#mycanvas");
const context = canvas.getContext("2d");

function drawPixel(x, y, pointSize = 1) {
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(x, y, pointSize, 0, Math.PI * 2);
  context.fill();
}

// penggambaran garis dengan algoritma DDA
function drawLine(x0, y0, xend, yend, matrix) {
  let dx = xend - x0,
    dy = yend - y0;
  let step, k;
  let xinc, yinc;
  let x = x0,
    y = y0;

  if (Math.abs(dx) > Math.abs(dy)) {
    steps = Math.abs(dx);
  } else {
    steps = Math.abs(dy);
  }

  xinc = dx / steps;
  yinc = dy / steps;

  drawPixel(Math.round(x), Math.round(y));

  for (k = 0; k < steps; k++) {
    x += xinc;
    y += yinc;

    drawPixel(x, y);
    // matrix[x][y] = 1;
  }
}
