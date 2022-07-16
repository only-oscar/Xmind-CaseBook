const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const path = require("path");
const {
  publicPath,
  outputDir,
  assetsDir,
  lintOnSave,
  productionSourceMap,
  title,
  devHost,
  devPort,
} = require("./src/config/vue.custom.config");
const name = title || "vue3-js-elementPlus-haixingmap"; // 页面标题
const port = process.env.port || process.env.npm_config_port || devPort; // 端口
// 按需引入Element-plus
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  productionSourceMap,
  devServer: {
    hot: true,
    host: devHost,
    port: port,
    open: true,
    client: {
      overlay: true,
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      // patterns: ['F:\\Web\\myBlog\\vue-bog-master\\src\\styles\\_variables.less']
      patterns: [path.resolve(__dirname, "src/styles/_variables.less")],
    },
  },
  configureWebpack: {
    name: "name",
    resolve: {
      alias: {
        "@": resolve("src"),
        "*": resolve(""),
        Assets: resolve("src/assets"),
      },
    },
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      new NodePolyfillPlugin()
    ],
    externals:{
      fs:require('fs')
    }
  },
  css: {
    loaderOptions: {},
  },
  chainWebpack(config) {
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    config
      .plugin("html")
      .tap((args) => {
        args[0].title = name;
        return args;
      })
      .end();
  },
});
