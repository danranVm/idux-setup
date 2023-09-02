import type { FormGroup, ValidateErrors } from '@idux/cdk/forms'

export function useConfirmPwd<T extends Record<string, any>>(
  fromGroup: FormGroup<T>,
  options?: {
    pwdKey?: string
    confirmPwdKey?: string
  },
) {
  const { pwdKey, confirmPwdKey } = options ?? {}
  const pwdControl = fromGroup.get(pwdKey ?? 'password')
  const confirmPwdControl = fromGroup.get(confirmPwdKey ?? 'confirmPwd')

  const validate = (): ValidateErrors | undefined => {
    if (pwdControl.valueRef.value !== confirmPwdControl.valueRef.value) {
      return { confirm: { message: '两处密码不一致，请重新输入' } }
    }
  }
  confirmPwdControl.addValidators(validate)

  pwdControl.watchValue(() => {
    confirmPwdControl.validate()
  })

  confirmPwdControl.watchValue(() => {
    confirmPwdControl.validate()
  })
}
