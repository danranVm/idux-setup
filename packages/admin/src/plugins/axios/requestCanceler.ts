import type { AxiosRequestConfig } from 'axios'
import { isObject } from 'lodash-es'
import queryString from 'query-string'

export class RequestCanceler {
  pendingQueue: Map<string | symbol, AbortController>

  constructor() {
    this.pendingQueue = new Map()
  }

  genKey(config: AxiosRequestConfig) {
    const { method, url, params, data, cancelRepeatRequest } = config
    const key = isObject(cancelRepeatRequest)
      ? cancelRepeatRequest.key
      : [
          url || '',
          method || '',
          queryString.stringify(params || {}),
          queryString.stringify(data || {}),
        ]
          .filter(Boolean)
          .join('&')

    return key
  }

  add(config: AxiosRequestConfig) {
    const { cancelRepeatRequest } = config
    if (!cancelRepeatRequest) return

    this.remove(config)

    const key = this.genKey(config)
    let controller = this.pendingQueue.get(key)

    if (!controller) {
      controller = new AbortController()
      config.signal = controller.signal
      this.pendingQueue.set(key, controller)
    } else {
      config.signal = controller.signal
    }
  }

  remove(config: AxiosRequestConfig) {
    const { cancelRepeatRequest } = config
    if (!cancelRepeatRequest) return

    const key = this.genKey(config)
    const controller = this.pendingQueue.get(key)

    if (controller) {
      controller.abort()
      this.pendingQueue.delete(key)
    }
  }
}
