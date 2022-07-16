/**
 * 后端处理数据的路由
 */
const express = require('express')
const afterRouter = express.Router()
const controllers = require('../controllers/afterControllers')

afterRouter.get('/bills',controllers.getBill)

module.exports = afterRouter