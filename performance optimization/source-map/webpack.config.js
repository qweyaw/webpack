/*
 * @Description: webpack 配置
 * @Author: Amy
 * @Date: 2022-06-16 14:50:35
 * @LastEditTime: 2022-06-16 15:14:10
 */
/* 
    HMR: hot module replacement 热模块替换
        作用： 一个模块发生变化，只需要重新加载一个模块，不需要重新加载整个页面
*/

import { resolve } from "path";
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: ["./index.js", "./index.html"],
    output: {
        path: resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'img/[name].[ext]',
                    esModule: false,
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        })
    ],
    mode: 'development',
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        port: 3000,
        // 开启热更新
        hot: true,
        open: true,
    },
    devtool: 'source-map',
}