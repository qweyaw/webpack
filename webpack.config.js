/*
 * @Description: Amy
 * @Author: Amy
 * @Date: 2022-06-15 10:51:20
 * @LastEditTime: 2022-06-15 11:24:35
 */
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: "./index.js",
  output: {
    // 输出文件
    path: resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        // 处理 less 文件
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
        exclude: /node_modules/,
      },
      {
        // 处理 图片 文件
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader", // 需要下载 url-loader file-loader
        /* 
            图片小于8kb的时候，会被转成base64
            url 默认使用 es6 模块化解析， 而 html-loader 引入图片是使用commonjs解析
            解析时会出现问题 [object Module]，所以需要设置 esModule: false
            问题：处理不了 html 中的 img 图片
        */
        options: {
          limit: 8 * 1024,
          name: "[hash:8].[ext]", // hash 前8位，扩展名
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        /* 处理 heml 文件中的 img 图片 （负责引入 img，从而能被 url-loader 进行处理） */
        loader: "html-loader",
      },
      // 打包其他资源
      {
        // 排除其他资源
        exclude: /\.(js|css|less|html|jpg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
        },
      },
    ],
  },
  // devServer: 自动化（自动编译、自动打开浏览器、自动刷新浏览器）
  // 特点： 只会在内存中编译打包，不会有任何输出
  // 启动指令： npx webpack-dev-server（需要下载webpack-dev-server）
  devServer: {
    // 设置服务器的基本目录
    contentBase: resolve(__dirname, "build"),
    // 端口
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 开启热更新
    hotOnly: true,
    // 开启 gzip 压缩
    compress: true,
  },
};
