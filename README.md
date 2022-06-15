<!--
 * @Description: Amy
 * @Author: Amy
 * @Date: 2022-06-10 16:08:42
 * @LastEditTime: 2022-06-15 15:10:52
-->
##  webpack 5

### 作用域问题

```js
// 立即执行函数
(function (){
  let name = 'xx'
})()
let result = (function() {
  let name = 'xx'
  return name
})()
```

### 处理 less 文件

```
{
  // 处理 less 文件
  test: /\.less$/,
  use: ["style-loader", "css-loader", "less-loader"],
  exclude: /node_modules/,
}
```

### 打包图片文件

```
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
```

### 处理 html 资源
```
plugins: [
  // 处理 html 资源
  new HtmlWebpackPlugin({
    template: "./index.html", // 模版文件
  }),
],
```

### devServer
```
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
```

### css 抽离为单独文件
mini-css-extract-plugin
```
use: [
  MiniCssExtractPlugin.loader,
  // 将 css 转换成 js
  "css-loader",
]
plugins: [
  new MiniCssExtractPlugin({
    filename: "css/bundle.css", // 重命名
  }),
]
```

### css 兼容性处理
postcss-loader postcss-preset-env
```
{
  loader: "postcss-loader",
  options: {
    plugins: () => [
      // postcss 插件
      require("post-preset-env")(),
    ],
  },
},
json```

### 压缩 css
兼容性 一般 loader 处理
压缩 一般 plugins 处理

optimize-css-assets-webpack-plugin
```
new OptimizeCssAssetsPlugin(), // 压缩 css
```

### js 语法检查
下载 eslint-loader eslint eslint-config-airbnb-base
package.json
```
"eslintConfig": {
    "extends": "airbnb-base"
  }
```
// eslint-disable-next-line 下一行不进行 eslint 检查
console.log(add(1, 2));

### js 兼容性处理

1. babel babel-loader @babel/corl @babel/preset-env
问题： 只能转换基本语法，如 promise 不能转换
2. @babel/polyfill 处理
js文件
`import "@babel/polyfill";`
问题： 全部引入 ，包体积太大
3. 按需加载：core-js
```
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
```