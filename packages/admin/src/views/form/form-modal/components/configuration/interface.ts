// 这个类型一般是接口生成就生成好了的
export interface FormData {
  /** 账户名 */
  user: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPwd?: string
  /** 电话 */
  telphone: string
  /** 邮箱 */
  emial: string
  /** 描述 */
  desc: string
  /** 角色 */
  role: number[]
  id?: number
}

// 这个类型一般全局就定义好了
export interface ApiReturn<T = any> {
  isSuccess: boolean
  msg: string
  data: T
  [key: string]: any
}
