## webpack 5

- 一个现代 JavaScript 应用程序的静态模块打包器(module bundler)

- webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)

- 包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle

### entry

- 单个入口
  用法：`entry: string|Array<string>`

```js
const config = {
  entry: {
    main: "./main.js",
  },
};
module.exports = config;
```

简写:

```JavaScript
    const config = {
        entry: './main.js'
    }
    module.exports = config
```

- 对象语法
  用法：`entry: {[entryChunkName: string]: string|Array<string>}`
  比较繁琐,但这是应用程序中定义入口的**最可扩展**的方式

```js
const config = {
  entry: {
    app: "./src/app.js",
    vendors: "./src/vendors.js",
  },
};
```

可扩展的 webpack 配置: 可重用并且可以与其他配置组合使用
用于将关注点从 环境、构建目标、运行时 中分离,然后使用专门的工具将他们合并 (webpack-merge)

- 常见场景:

1. 分离应用程序 app 和 第三方库 vendor 入口

```js
const config = {
  entry: {
    app: "./src/app.js",
    vendors: "./src/vendors.js",
  },
};
```

webpack 从 app.js 和 vendors.js 开始创建依赖图(dependency graph)
这些依赖图是彼此完全分离、互相独立的（每个 bundle 中都有一个 webpack 引导(bootstrap)）
这种方式比较常见于，只有一个入口起点（不包括 vendor）的单页应用程序(single page application)中。

- 多页面应用程序

```js
const config = {
  entry: {
    pageOne: "./src/pageOne/index.js",
    pageTwo: "./src/pageTwo/index.js",
    pageThree: "./src/pageThree/index.js",
  },
};
```

3 个独立分离的依赖图
每当页面跳转时, 服务器将为你获取一个新的 HTML 文档。页面重新加载新文档，并且资源被重新下载

### output

```js
const config = {
  output: {
    filename: "bundle.js",
    path: "/dist", // 绝对路径
  },
};
```

多个入口起点

```js
{
    entry: {
        app: "./src/app.js",
        vendors: "./src/vendors.js",
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
}
// ./dist/app/js,  ./dist/vendor.js
```

高级进阶: 使用 CDN 和 资源 hash 值

```js
output: {
  path: "/home/proj/cdn/assets/[hash]",
  publicPath: "http://cdn.example.com/assets/[hash]/"
}
```

### mode

```js
module.exports = {
  mode: "production" | "development",
};
```

cli 参数中传递 `webpack --mode=production`

- development: 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin
- production: 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin

```js
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

```js
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```

### loader

用于对模块的源代码进行转换, loader 可以将文件从不同的语言转化为 JavaScript,或将内联图像转换为 data URL,也可以允许你在 js 中 import css 文件

```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      { test: /\.ts$/, use: "ts-loader" },
    ],
  },
};
```

- 使用 loader 的方式

1. 配置(推荐): webpack.config.js 中指定 loader

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        {
          loader: "css-loader",
          options: {
            modules: true,
          },
        },
      ],
    },
  ];
}
```

2. 内联: 在每个 import 语句中显示指定 loader

```js
import Styles from "style-loader!css-loader?modules!./styles.css";
```

3. CLI: 在 shell 命令中指定他们

```shell
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

#### loader 特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript
- loader 可以是同步的，也可以是异步的
- loader 运行在 Node.js 中，并且能够执行任何可能的操作
- loader 接收查询参数。用于对 loader 传递配置
- loader 也能够使用 options 对象进行配置。 -除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段
- 插件(plugin)可以为 loader 带来更多特性
- loader 能够产生额外的任意文件

### plugins

webpack 插件是一个具有 apply 属性的 javascript 对象, apply 属性会被 webpack compiler 调用
并且 conmpiler 属性可在整个编译周期访问

```js
const pluginName = "ConsoleLogBuildWebpackPlugin";
class ConsoleLogBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log("webpack 构建过程开始!");
    });
  }
}
```

```js
const webpack = require("webpack"); //内置插件
plugins: [
  new webpack.optimize.UglifyJsPlugin(),
  new HtmlWebpackPlugin({ template: "./src/index.html" }),
];
```
