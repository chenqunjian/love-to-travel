import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// Vue.axios.defaults.baseURL = 'http://www.baotoubus.cn/WifiBusInterface/transfer/'
// Vue.axios.defaults.baseURL = 'http://localhost:3000'
Vue.axios.defaults.baseURL = 'http://47.93.136.207:8060'

export default axios

export function fetch (url, params = {}) {
  return ajax('get', url, params)
}

export function post (url, data = {}) {
  return ajax('post', url, data)
}

export function ajax (type, url, data) {
  return new Promise((resolve, reject) => {
    let datas = null
    if (type === 'get') {
      datas = {
        params: data
      }
    } else {
      datas = data
    }

    axios[type](url, datas).then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      }
    }).catch((err) => {
      console.log(err)
    })
  })
}
