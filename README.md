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
