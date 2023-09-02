import type { ValidateErrors } from '@idux/cdk/forms'

const USER_REG = /^[\u4e00-\u9fa5A-Za-z0-9_]+$/
export function userValidate(value: string): ValidateErrors | undefined {
  if (!USER_REG.test(value)) {
    return {
      user: {
        message: '仅支持中文字符、英文字母、数字和下划线',
      },
    }
  }
}

const PHONE_REG = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
export function phoneValidate(value: string): ValidateErrors | undefined {
  if (!PHONE_REG.test(value)) {
    return {
      user: {
        message: '请输入正确的手机号',
      },
    }
  }
}
