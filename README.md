# 爱出行

> 公交查询 APP

## 跨域解决方案

### 开发模式

在 `config/index.js` 配置了代理：

```javascript
proxyTable: {
  '/': {
    target: 'http://www.baotoubus.cn/WifiBusInterface/transfer',
    changeOrigin: true
  }
}
```

### 生产模式

需要在服务器上开启 Node.js 代理，参考 `./server.js` ，并在 `src/http/index` 中配置：

```javascript
Vue.axios.defaults.baseURL = 'http://xx.xx.xx.xx:8060' // 代理地址
```

## 项目目录

生成方式：参考文档 [https://github.com/jrainlau/filemap](https://github.com/jrainlau/filemap)

```bash
npm run filemap
```

目录：

```
|__ build                                        // webpack 配置
  |__ build.js
  |__ check-versions.js
  |__ utils.js
  |__ vue-loader.conf.js
  |__ webpack.base.conf.js
  |__ webpack.dev.conf.js
  |__ webpack.prod.conf.js
  |__ webpack.test.conf.js
|__ config
  |__ dev.env.js
  |__ index.js
  |__ prod.env.js
  |__ test.env.js
|__ dist                                         // 生产代码
|__ src                                          // 源代码
  |__ App.vue                                        //
  |__ assets                                         // 静态资源
    |__ images                                          图片
  |__ components                                     // 组件
    |__ Route.vue                                       // 路线查询
    |__ RouteDetail.vue                                 // 路线详情
    |__ Site.vue                                        // 站点查询
    |__ SiteDetail.vue                                  // 站点详情
  |__ http                                           // http 请求
    |__ api.js                                          // 接口地址
    |__ bus.js                                          // 接口
    |__ index.js                                        // axios 配置及 请求方法
  |__ main.js                                        // webpack 入口文件
  |__ router                                         // 路由
    |__ index.js                                        // 路由配置
  |__ style                                          // 样式
    |__ detail.css
    |__ index.css
    |__ mixins.css
    |__ search.css
|__ static                                      // 静态类库
  |__ .gitkeep
|__ **test**
|__ .babelrc                                    // babel 配置
|__ .editorconfig                               // editor 配置
|__ .eslintignore                               // eslint 忽略文件
|__ .eslintrc.js                                // eslint 配置
|__ .postcssrc.js                               // postcss 配置
|__ index.html                                  // 首页
|__ package.json                                // npm 项目配置
|__ README.md                                   // README
|__ salad.config.json                           // postcss-salad 配置
|__ server.js                                   // Node.js 代理
```

## 项目运行

``` bash
# 安装
npm install

# 开发
npm run dev

# 生产构建
npm run build

# 生产构建并分析依赖
npm run build --report

# 单元测试
npm run unit

# 端对端测试
npm run e2e

# 运行所有测试
npm test
```
