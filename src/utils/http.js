import Vue from 'vue'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, clearUserCache } from '@/utils/auth'

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json' // application/x-www-form-urlencoded
}

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  Object.assign(config.headers, defaultHeaders)
  if (store.getters.token) {
    config.headers['access-token'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error)
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非"20000"时都表示发生错误
     */
    const res = response.data
    if (res.code && res.code !== 20000) {
      return Promise.reject(new Error(res))
    } else {
      return res
    }
  },
  error => {
    console.log(error)
    const message = error.message || '未知错误'
    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    if (error.code === 50008 || error.code === 50012 || error.code === 50014) {
      clearUserCache()
      // 空白页面的重新登录提示框不需要取消按钮
      if (document.getElementById('app').childElementCount === 0) {
        location.reload()
      } else {
        const $alertDiv = document.querySelector(`div[aria-label="${message}"]`)
        if (!$alertDiv || getComputedStyle($alertDiv).display === 'none') {
          const text = '你已被登出，点击“确定”重新登录，或点击“取消”继续留在当前页面'
          const options = {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }
          MessageBox.confirm(text, message, options).then(() => {
            store.dispatch('user/resetToken').then(() => {
              // 为了重新实例化vue-router对象 避免bug
              location.reload()
            })
          })
        }
      }
    } else {
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

const get = (url, params = {}, options = {}) => {
  let _params = { ...params }
  // 防止IE浏览器缓存get请求
  _params.t = new Date().getTime()
  return service({
    url: url,
    method: 'get',
    params: _params,
    ...options
  })
}

const post = (url, data = {}, options = {}) => {
  return service({
    url: url,
    method: 'post',
    data: data,
    ...options
  })
}

service['get'] = get
service['post'] = post
Vue.prototype.$http = service

export default service
