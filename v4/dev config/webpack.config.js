/*
 * @Description: amy
 * @Author: Amy
 * @Date: 2022-06-15 11:26:53
 * @LastEditTime: 2022-06-15 13:49:27
 */

/* 
    开发环境配置：
      项目启动配置：webpack 会输出
      项目打包配置：npx webpack-dec-server 不会输出

*/
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      // less
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // css
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // 图片
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          name: "[hash:8].[ext]",
          // 关闭 es6 模块化
          esModule: false,
        },
      },
      // html
      {
        test: /\.html$/,
        loader: "html-loader",
        outputPath: "./",
      },
      // 其他
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)$/,
        loader: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
  },
  mode: "development",
};
