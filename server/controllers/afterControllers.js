const fs = require('fs')
const path = require('path')
const CvstoJson = require('../utils/CvstoJson')
const billUrl = path.join(process.cwd(), '/data/bill.csv')

module.exports.getBill = function (req, res, next) {
  let month = req.query.month // 获取月份
  let type = req.query.type // 获取类型
  let category = req.query.category // 获取分类
  let bills = fs.readFileSync(billUrl, { encoding: 'utf-8' })
  const billsObj = CvstoJson(bills)
  Promise.resolve(billsObj)
    .then((bills) => {
      if (month) {
        // 过滤不符合月份的账单
        bills = bills.filter((bill) => {
          let y = new Date(parseInt(bill.time)).getFullYear()
          let m = new Date(parseInt(bill.time)).getMonth() + 1 // 获取当前月份
          let date = new Date(month)
          let dyear = date.getFullYear()
          let dmonth = date.getMonth() + 1
          return m == dmonth && y == dyear
        })
      }
      return bills
    })
    .then((bills) => {
      if (type != undefined || type != null) {
        // 过滤不符合类型的账单
        bills = bills.filter((bill) => {
          console.log(type, bill.type)
          return bill.type == type
        })
      }
      return bills
    })
    .then((bills) => {
      if (category) {
        // 过滤不符合分类的账单
        bills = bills.filter((bill) => {
          return bill.category == category
        })
      }
      return bills
    })
    .then((bills) => {
      // console.log(bills)
      res.json(bills)
    })
}
