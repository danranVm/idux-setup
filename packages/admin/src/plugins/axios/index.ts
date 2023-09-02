import Axios, { type AxiosError } from 'axios'
import axiosRetry from 'axios-retry'

import { RequestCanceler } from './requestCanceler'

import { Message } from '@/plugins/idux'

const canceler = new RequestCanceler()

const axios = Axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 3000,
})
axiosRetry(axios, {
  retries: 3, // 设置自动发送请求次数
  retryDelay: retryCount => {
    return retryCount * 1500 // 重复请求延迟（毫秒）
  },
  shouldResetTimeout: true, //  重置超时时间
  retryCondition: error => {
    //重试的条件，true为打开自动发送请求，false为关闭自动发送请求
    if (error.message.includes('timeout') || error.message.includes('status code')) {
      return true
    } else {
      return false
    }
  },
})

axios.interceptors.request.use(
  config => {
    // TODO 业务处理
    canceler.add(config)
    return config
  },
  error => {
    Promise.reject(error)
  },
)

axios.interceptors.response.use(
  res => {
    const data = res.data
    const config = res.config

    // TODO 业务处理
    canceler.remove(config)
    return data
  },
  (error: AxiosError) => {
    // 统一处理非200的网络错误
    const message = handleResponseError(error)
    if (message && message !== 'canceled') {
      Message?.error(message)
    }
    return Promise.reject(message)
  },
)

function handleResponseError(error: AxiosError) {
  let message = error?.message
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！'
        break
      case 400:
        message = '参数不正确！'
        break
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！'
        break
      case 403:
        message = '您没有权限操作！'
        break
      case 404:
        message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        message = '请求超时！'
        break
      case 409:
        message = '系统已存在相同数据！'
        break
      case 500:
        message = '服务器内部错误！'
        break
      case 501:
        message = '服务未实现！'
        break
      case 502:
        message = '网关错误！'
        break
      case 503:
        message = '服务不可用！'
        break
      case 504:
        message = '服务暂时无法访问，请稍后再试！'
        break
      case 505:
        message = 'HTTP 版本不受支持！'
        break
      default:
        message = '异常问题，请联系管理员！'
        break
    }
  }
  return message
}
export default axios
