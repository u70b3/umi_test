/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-01-23 19:27:58
 */
/**
 * 传递函数，注意alpha传递函数的参数transparency在着色器中才生效,故单独列出
 */

const redPoints = [
  [0.0, 0.0],
  [0.6755, 0.0],
  [0.6778, 1.0],
  [0.7023, 0.0],
  [0.71, 1.0],
  [1.0, 1.0],
];
const greenPoints = [
  [0.0, 0.0],
  [0.5427, 0.0],
  [0.5631, 0.512],
  [0.6033, 0.0],
  [0.6187, 0.594],
  [0.6785, 0.0],
  [0.6812, 0.784],
  [0.6958, 0.0],
  [1.0, 0.0],
];
const bluePoints = [
  [0.0, 0.0],
  [1.0, 0.0],
];

/**
 * @return {number}
 */
export function TransferFunction(i: number, color: string) {
  let array;
  if (color === 'r') array = redPoints;
  else if (color === 'g') array = greenPoints;
  else if (color === 'b') array = bluePoints;
  else return 0.0;

  const val = (1.0 * i) / 256.0;
  let result = 0.0;
  let x1 = 0.0;
  let y1 = 0.0;
  let x2 = 0.0;
  let y2 = 0.0;
  for (let k = 0; k < array.length - 1; k++) {
    if (val >= array[k][0] && val < array[k + 1][0]) {
      x1 = array[k][0];
      x2 = array[k + 1][0];
      y1 = array[k][1];
      y2 = array[k + 1][1];
      result = ((val - x1) / (x2 - x1)) * (y2 - y1) + y1;
      return result;
    }
  }
  return 0.0;
}

/**
 * @return {number}
 */
export function TransferFunctionAlpha(i: number) {
  return 1.0;
}
