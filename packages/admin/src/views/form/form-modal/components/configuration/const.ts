import type { SelectData } from '@idux/components/select'

import { RoleEnum } from './enum'
import type { FormData } from './interface'

/**
 * 角色
 * @type {SelectData}
 */
export const roleOptions: SelectData[] = [
  {
    label: '超级管理员',
    key: RoleEnum.super,
  },
  {
    label: '普通管理员',
    key: RoleEnum.admin,
  },
  {
    label: '用户',
    key: RoleEnum.user,
  },
]

export const DEFAULT_DATA: FormData = {
  /** 账户名 */
  user: '',
  /** 密码 */
  password: '',
  /** 电话 */
  telphone: '',
  /** 邮箱 */
  emial: '',
  /** 描述 */
  desc: '',
  /** 角色 */
  role: [],
}
