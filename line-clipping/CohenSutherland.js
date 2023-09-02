/**
 * Implementation of Cohen-Sutherland Algorithm for Line Clipping
 * Created for the purpose of Tugas 5 Grafika Komputer
 *
 * Author: Jaka Pratama Widiyanto
 * NPM: 0620101011
 */

"use strict";

// constants for regions used in algorithm
const regions = {
  top: 0b1000,
  right: 0b0010,
  bottom: 0b0100,
  left: 0b0001,
  window: 0b0000,
};

/**
 * Implementation of Cohen-Sutherland Algorithm
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Object} windowCoordinate coordinate-xy of the window inside canvas
 */
function lineClip(x1, y1, x2, y2, windowCoordinate) {
  const [xw_min, yw_min, xw_max, yw_max] = windowCoordinate;
  const slope = Math.floor((y2 - y1) / (x2 - x1));

  /**Transform each points as binary digits in one of the 9-region */
  function computeWhichRegion(x, y) {
    let begin = 0b0000;
    if (x < xw_min) {
      begin |= regions.left;
    } else if (x > xw_max) {
      begin |= regions.right;
    }
    console.log(begin);
    if (y < yw_min) {
      begin |= regions.bottom;
    } else if (y > yw_max) {
      begin |= regions.top;
    }
    console.log(begin);
    return begin;
  }

  function isInside(point) {
    if (point === regions.window) {
      return true;
    }
    return false;
  }
  function isOutside(point) {
    if (point === regions.window) {
      return false;
    }
    return true;
  }
  function intersectOnWindow(x, y, pointN) {
    if (pointN & regions.top) {
      x = x + (yw_max - y) / slope;
      y = yw_max;
    } else if (pointN & regions.bottom) {
      x = x + (yw_min - y) / slope;
      y = yw_min;
    }

    if (pointN & regions.left) {
      y = y + (xw_min - x) * slope;
      x = xw_min;
    } else if (pointN & regions.right) {
      y = y + (xw_max - x) * slope;
      x = xw_max;
    }

    return Object.values({ x, y });
  }

  // which region does the line lies within?
  let point1 = computeWhichRegion(x1, y1);
  let point2 = computeWhichRegion(x2, y2);

  let i = 1;
  while (i < 100) {
    // max iteration to prevent infinite loop
    console.log(i++);
    // check whether the line lies within the window, outside, or partially
    if (
      (isInside(point1) && isOutside(point2)) ||
      (isInside(point2) && isOutside(point1))
    ) {
      // case: partial
      if (isOutside(point1)) {
        [x1, y1] = intersectOnWindow(x1, y1, point1);
      } else if (isOutside(point2)) {
        [x2, y2] = intersectOnWindow(x2, y2, point2);
      }
      // end of case: partial
    } else if (isOutside(point1) && isOutside(point2)) {
      // case: outside
      if (
        intersectOnWindow(x1, y1, point1) &&
        intersectOnWindow(x2, y2, point2)
      ) {
        // case: line goes through window
        [x1, y1] = intersectOnWindow(x1, y1, point1);
        [x2, y2] = intersectOnWindow(x2, y2, point2);
      } else {
        (x1 = null), (y1 = null), (x2 = null), (y2 = null);
      }
    } else if (isInside(point1) && isInside(point2)) {
      // case: inside
      break;
    }
  }

  if (!isNaN(x1 / x2 / y1 / y2)) {
    // ready to draw line
    // console.log("line is accepted ", JSON.stringify({ x1, y1, x2, y2 }));
    drawLine(x1, y1, x2, y2);
  } else {
    // reject line
    console.log("line is rejected");
  }
}

function drawWindow(window) {
  drawLine(window.x1, window.y1, window.x1, window.y2);
  drawLine(window.x1, window.y1, window.x2, window.y1);
  drawLine(window.x2, window.y2, window.x1, window.y2);
  drawLine(window.x2, window.y2, window.x2, window.y1);
}

const canvasSize = 130;

const mywindow = {
  x1: 200,
  y1: 200,
  x2: 450,
  y2: 450,
};

// FOR DEBUGGING
// const windowArr = new Array(canvasSize)
//   .fill()
//   .map(() => new Array(canvasSize).fill(0));

drawWindow(mywindow); // clipping window
lineClip(270, 270, 600, 600, Object.values(mywindow)); // line 1
lineClip(0, 350, 600, 350, Object.values(mywindow)); // line 2
lineClip(250, 300, 400, 200, Object.values(mywindow)); // line 3

// FOR DEBUGGING
// result of clipping in console as matrix
// windowArr.forEach((row) => {
//   let p = "";
//   row.forEach((val) => {
//     p += val + " ";
//   });
//   console.log(p);
// });
