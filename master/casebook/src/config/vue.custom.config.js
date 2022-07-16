const vueDefaultConfig = {
  publicPath: "/", // 公共路径配置项，默认为"/"，此配置项是影响打包生成文件的引入资源公共路径的
  outputDir: "dist", // build打包输出目录
  assetsDir: "static", // 静态文件输出目录，基于dist
  lintOnSave: process.env.NODE_ENV === "development", // 当处在开发环境时，lint语法检测
  productionSourceMap: false, // 取消map文件打包
  // webpack 配置的项目名称
  title: "XMind简易账单",
  titleReverse: false,
  devHost: "localhost", // 域名
  devPort: "8888", // 端口
  startMessage: "XMind简易账单",
};

module.exports = vueDefaultConfig;
