import _ from "lodash";
export default function arrayToJson(array) {
  const header = array[0]; // 获取表头
  // tail 获取除表头之外的所有表格数据数组，
  // 遍历表格数组
  return _.tail(array).map((row) => {
    return _.zipObject(header, row); // 生成JSON对象
  });
}
