<!--
 * @Description: Amy
 * @Author: Amy
 * @Date: 2022-06-10 16:08:42
 * @LastEditTime: 2022-06-16 15:43:58
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

```js
{
  // 处理 less 文件
  test: /\.less$/,
  use: ["style-loader", "css-loader", "less-loader"],
  exclude: /node_modules/,
}
```

### 打包图片文件

```js
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
```js
plugins: [
  // 处理 html 资源
  new HtmlWebpackPlugin({
    template: "./index.html", // 模版文件
  }),
],
```

### devServer
```js
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
```js
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
```js
{
  loader: "postcss-loader",
  options: {
    plugins: () => [
      // postcss 插件
      require("post-preset-env")(),
    ],
  },
},
// package.json 中
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
```

### 压缩 css
兼容性 一般 loader 处理
压缩 一般 plugins 处理

optimize-css-assets-webpack-plugin
```js
new OptimizeCssAssetsPlugin(), // 压缩 css
```

### js 语法检查
下载 eslint-loader eslint eslint-config-airbnb-base
package.json
```json
"eslintConfig": {
    "extends": "airbnb-base"
  }
```
```js
{
  test: /\.js$/,
  loader: "eslint-loader",
  exclude: /node_modules/,
  enforce: "pre", // js 文件的前置处理器，先于 babel-loader
  options: {
    // 自动修复
    fix: true,
  },
},
// eslint-disable-next-line 下一行不进行 eslint 检查
console.log(add(1, 2));
```

### js 兼容性处理

1. babel babel-loader @babel/corl @babel/preset-env
问题： 只能转换基本语法，如 promise 不能转换
2. @babel/polyfill 处理
js文件
`import "@babel/polyfill";`
问题： 全部引入 ，包体积太大
3. 按需加载：core-js
```js
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

### js 和 css 压缩
生产环境会自动压缩 js 代码
mode 修改为 production 会自动压缩js

html 压缩
```js
new HtmlWebpackPlugin({
  template: "./src/index.html",
  minify: {
    collapseWhitespace: true, // 删除空格
    removeComments: true // 删除注释
  },
}),
```

## 性能优化

1. 开发环境性能优化
  - 优化打包构建速度
  - 优化代码调试 
2. 生产环境性能优化
  - 优化打包构建速度
  - 优化代码运行的性能


1. HMR 热模块替换
HMR: hot module replacement 热模块替换
作用： 一个模块发生变化，只需要重新加载一个模块，不需要重新加载整个页面
样式文件：可以使用 HMR 功能，因为 style-loader 内部实现了 HMR
js 文件：默认不能使用 HMR， 只能处理非入口 js 文件
解决方案：
```js
// 会监听 a.js 文件变化，一旦发生变化，其他模块不会重新打包构建，会执行后面的回调函数
if (module.hot) {// 是否开启 HMR
  module.hot.accept('./a.js', function() {
    console.log('a.js 文件发生变化');
  });
}
```
html 文件：默认不能使用 HMR，同时会导致问题：html 文件不能热更新了
解决方案：修改 entry 文件，将 html 文件引入
```js
entry: ["./index.js", "./index.html"],
```

```js
devServer: {
  contentBase: resolve(__dirname, 'dist'),
  port: 3000,
  // 开启热更新
  hot: true,
  open: true,
}

```

2. source-map
一种提供源代码到构建后代码的映射的方式，如果构建后代码出错，可以在控制台中看到源代码的错误信息
[inline-|hidden-|eval-|nosource-][cheap-[module-]]source-map
- source-map: 外部
  >错误代码准确信息 和 源代码错误未知
- inline-source-map: 内联（只生成一个 source-map）
  >错误代码准确信息 和 源代码错误未知
- hidden-source-map: 外部
  >错误代码原因，但是没有错误位置，不能追踪到源代码，只能提升构建后位置
- eval-source-map: 内联（每一个文件都生成 source-map）
 >错误代码准确信息 和 源代码错误未知
- nosource-source-map: 外部（不生成 source-map）
 >错误代码准确信息 但是没有任何源代码信息
- cheap-source-map: 外部（只生成一个 source-map）
  >错误代码准确信息 和 源代码错误未知（只能精确到行）
- cheap-module-source-map: 外部（只生成一个 source-map）
  >错误代码准确信息 和 源代码错误未知(module  会将loader的 source map加入)

内联和外部的区别：
  1. 外部生成了文件，内联没有
  2. 内联构建速度更快

开发环境：速度快， 调试更友好

速度快（eval>inline>cheap>...)
  `eval-cheap-source-map` 最快
  `eval-source-map` 快
调试更友好
  `source-map` 最友好
  `cheap-module-source-map` 友好
  `cheap-source-map` 较友好

----->  eval-source-map / eval-cheap-module-source-map

生产环境：源代码隐藏？调试友好？
  内联会让代码体积变大，生产不用内联
  nosource-source-map
  hidden-source-map

```js
devtool: 'source-map',
```

3. oneOf
以下只会匹配一次
注意： 不能有两个配置处理同一种文件（放 oneOf 外面）
```js
module: {
  rules: [
    oneOf: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ]
  ]
}
```