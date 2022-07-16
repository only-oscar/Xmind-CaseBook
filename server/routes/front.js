/**
 * 前端处理数据的路由
 */
 const express = require('express')
 const frontRouter = express.Router()
 const controllers = require('../controllers/frontControllers')
 
 frontRouter.get('/bills',controllers.getBill)
 
 module.exports = frontRouter