import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    cancelRepeatRequest?:
      | boolean
      | {
          key: string | symbol
        }
  }
}
