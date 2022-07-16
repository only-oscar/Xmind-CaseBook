const path = require('path')
const billUrl = path.join(process.cwd(), '/data/bill.csv')
const { Csv2png } = require('csv2png')

module.exports.getBill = function (req, res, next) {
  const pc = new Csv2png({
    int: [7, 8, 9, 10],
    filePath: billUrl,
    width: 400,
    lf: '\n'
  })

  let c = pc.compile() // 解析png对象
  let opt = {
    png: c.imgData,
    config: c.config
  }
  res.json(opt)
}
