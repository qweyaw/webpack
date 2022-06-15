/*
 * @Description: amy
 * @Author: Amy
 * @Date: 2022-06-15 11:26:53
 * @LastEditTime: 2022-06-15 15:09:07
 */

/* 
    开发环境配置：
      项目启动配置：webpack 会输出
      项目打包配置：npx webpack-dec-server 不会输出

*/
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  entry: "./src/js/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      // 兼容性处理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                // 按需加载
                useBuiltIns: "usage",
                // 制定 core-js 版本
                corejs: {
                  version: 3,
                },
                // 指定兼容性到哪个版本
                targets: {
                  chrome: "60",
                  firefox: "60",
                  ie: "9",
                  safari: "10",
                  edage: "12",
                },
              },
            ],
          ],
        },
      },
      /* 
        语法检查： eslint-loader eslint
          只检查自己的代码，不检查第三方的代码
          设置语法检查规则：
            package.json 中 ēslintConfig 中设置
            airbnb-base 中设置 eslint-config-airbnb-base
      */
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          // 自动修复
          fix: true,
        },
      },
      // less
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // css
      {
        test: /\.css$/,
        use: [
          // 创建 style 标签，将样式放入
          "style-loader",
          // MiniCssExtractPlugin.loader,
          // 将 css 转换成 js
          "css-loader",
          /*
            css 兼容性处理 postcss --> postcss-loader postcss-preset-env 
            帮 postcss 找到 package.json 中的 browserslist 配置
              "browserlist": {
                // 开发环境 ---> 设置 node 环境变量 process.env.NODE_ENV = "development";
                "development": [
                  "last 1 Chrome version",
                  "last 1 Firefox version",
                  "last 1 Safari version"
                ],
                // 生产环境（默认）
                "production": [
                  "> 0.2%",
                  "not dead",
                  "not op_mini all"
                ]
              }
          */
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     plugins: () => [
          //       // postcss 插件
          //       require("post-preset-env")(),
          //     ],
          //   },
          // },
        ],
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
    new MiniCssExtractPlugin({
      filename: "css/bundle.css", // 重命名
    }),
    new OptimizeCssAssetsPlugin(), // 压缩 css
  ],
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
  },
  mode: "development",
};
