import { Validators, useFormGroup } from '@idux/cdk/forms'

import { useConfirmPwd } from './useConfirmPwd'
import type { FormData } from '../configuration/interface'
import { userValidate, phoneValidate } from '../configuration/util'

export function useCreateForm() {
  // 表单控制器初始化
  const { required, maxLength, minLength, email } = Validators

  const formGroup = useFormGroup<FormData>({
    user: ['', [required, maxLength(95), minLength(1), userValidate]],
    password: ['', [required]],
    confirmPwd: ['', [required]],
    telphone: ['', [required, phoneValidate]],
    emial: ['', [email]],
    desc: [''],
    role: [undefined, [required]],
  })

  useConfirmPwd(formGroup)

  const validate = () => {
    const valid = formGroup.valid.value
    if (!valid) {
      formGroup.markAsDirty()
    }
    return valid
  }

  return {
    formGroup,
    validate,
  }
}
