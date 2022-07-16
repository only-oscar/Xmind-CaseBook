const express = require('express')
const router = express.Router()
const afterRouter = require('./after')
const commonControllers = require('../controllers/commonControllers')
const frontControllers = require('./front')
// 子路由
router.use('/after', afterRouter)
router.use('/front', frontControllers)

// 通用路由
router.get('/caretories', commonControllers.getCateories) // 得到分类列表压缩png对象
router.post('/add', commonControllers.createBill)
module.exports = router
