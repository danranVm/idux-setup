import type { FormData, ApiReturn } from './interface'

export const mockData = (id: number) => ({
  id,
  /** 账户名 */
  user: 'testform',
  /** 密码 */
  password: '123456',
  /** 电话 */
  telphone: '17713247622',
  /** 邮箱 */
  emial: '12345@qq.com',
  /** 描述 */
  desc: '我是描述',
  /** 角色 */
  role: [1, 2, 3],
})

export const mockGetInterface = (options: { id: number }): Promise<ApiReturn<FormData>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        isSuccess: true,
        msg: '',
        data: mockData(options.id),
      })
    }, 1000)
  })
}

export const mockPostInterface = (data: FormData): Promise<ApiReturn<FormData>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        isSuccess: true,
        msg: '',
        data: {
          id: 1,
          ...data,
        },
      })
    }, 1000)
  })
}
