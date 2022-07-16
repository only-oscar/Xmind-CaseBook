const _ = require('lodash')
module.exports = function csvToJson(csv) {
  const content = csv.split('\n') // 根据分隔符区分数据行
  const header = content[0].split(',') // 根据逗号分隔获取表头
  // tail 获取除表头之外的所有表格数据数组，
  // 遍历表格数组
  return _.tail(content).map((row) => {
    return _.zipObject(header, row.split(',')) // 生成JSON对象
  })
}
