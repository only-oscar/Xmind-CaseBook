// 引入express框架
const express = require('express')
const router = require('./routes/index')
// 创建服务器
const app = express()

// 拦截POST参数
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 允许跨域
app.all('*', (req, res, next) => {
    //指定允许其他域名访问
    res.header('Access-Control-Allow-Origin', '*')
    //允许的请求头字段
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    //允许的请求类型
    res.header('Access-Control-Methods', '*')
    /*让options请求快速返回*/
    if (req.method === 'OPTIONS') res.send(200)
    else next()
  })

  app.use('/',router)

// 监听服务器端口
app.listen(3000,function () { 
    console.log('服务器已经成功启动！！')
 })