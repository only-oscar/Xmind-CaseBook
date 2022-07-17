/**
 * 解决浮点数相加精度丢失的问题
 * @param {*} num1
 * @param {*} num2
 */
export default function numAdd(num1, num2) {
  // 思路:获取两个数中最大的小数位数，然后将小数转换为整数相加，最后在转为小数
  let baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }

  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }

  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}
