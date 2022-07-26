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
