const express = require('express')
const proxy = require('http-proxy-middleware')
const cors = require('cors')

const app = express()

app.use(cors())

app.use('/', proxy({
  target: 'http://www.baotoubus.cn/WifiBusInterface/transfer',
  changeOrigin: true
}))

app.listen(3000)
