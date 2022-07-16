const fs = require('fs')
const path = require('path')
const cateoryUrl = path.join(process.cwd(), '/data/categories.csv')
const billUrl = path.join(process.cwd(), '/data/bill.csv')
const { Csv2png } = require('csv2png')

module.exports.getCateories = function (req, res, next) {
  const pc = new Csv2png({
    int: [7, 8, 9, 10],
    filePath: cateoryUrl,
    width: 400,
    lf: '\n'
  })
 
  let c = pc.compile() // 解析png对象
  let opt = {
    png: c.imgData,
    config: c.config
  }
  // const r = new Png2csv(opt)
  // r.parse().then((data) => {
  //   console.log(data)
  // })
  res.json(opt)
}

module.exports.createBill = function (req, res, next) {
  let time = req.body.time
  let type = req.body.type
  let category = req.body.category
  let amount = req.body.amount
  console.log(time, type, category, amount)
  // 拼接存储数据字符串
  let dataStr = `\n${type},${time},${category},${amount}`
  console.log(dataStr)
  let result = fs.appendFileSync(billUrl, dataStr, { encoding: 'utf-8' })
  // console.log(result)
  res.json('ok')
}
