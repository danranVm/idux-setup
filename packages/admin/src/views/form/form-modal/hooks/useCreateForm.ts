import { computed } from 'vue'

import { Validators, useFormGroup, ValidateError } from '@idux/cdk/forms'

import { useEffectControl } from './useEffectControl'
import {
  AccessModeEnum,
  RepositoryTypeEnum,
  PullTypeEnum,
  GitConnectTypeEnum,
  FormDataEnum,
  addressUrl,
  checkBranch,
  checkSpace,
  checkXss,
  effectConfig,
} from '../configuration'
import type { FormData } from '../configuration/interface'

export function useCreateForm() {
  // 表单控制器初始化
  const { required, maxLength, minLength } = Validators

  // 自定义默认控制器的报错文案, 这个会更改全局的校验器文案，一般是放去全局配置那边
  Validators.setMessages({
    maxLength: (error: Omit<ValidateError, 'message'>): string => {
      return `超出${error.minLength}个字符限制`
    },
    minLength: (error: Omit<ValidateError, 'message'>): string => {
      return `不能小于${error.minLength}个字符`
    },
  })

  const formGroup = useFormGroup<FormData>({
    [FormDataEnum.access]: [AccessModeEnum.git],
    [FormDataEnum.pullType]: [PullTypeEnum.http],
    [FormDataEnum.gitConnectType]: [GitConnectTypeEnum.user], // 拉取方式
    [FormDataEnum.repositoryType]: [RepositoryTypeEnum.gitlab, required], // git类型
    [FormDataEnum.gitAddress]: ['', [required, maxLength(200), addressUrl]],
    [FormDataEnum.privateKey]: ['', [required, maxLength(4000)]], // ssh拉代码时：私钥
    [FormDataEnum.gitLabHead]: ['', [required, maxLength(200), addressUrl]], // GitLab访问配置
    [FormDataEnum.gitlabApiVersion]: ['v4', required], // GitLab接口版本
    [FormDataEnum.branch]: ['', [required, minLength(2), maxLength(128), checkSpace, checkBranch]], // 分支名称
    [FormDataEnum.token]: ['', [required, minLength(2), maxLength(128), checkXss]],
    [FormDataEnum.gitUsername]: [
      '',
      [required, minLength(2), maxLength(128), checkSpace, checkXss],
    ],
    [FormDataEnum.gitPassword]: ['', [required, maxLength(50)]],
    [FormDataEnum.file]: ['', [required, maxLength(50), checkBranch]],
  })

  //配置表单关联逻辑
  const { effectControlStatus } = useEffectControl<FormData>(formGroup, effectConfig)

  // 对应表单项的显隐状态
  const isGitLabel = computed(
    () => effectControlStatus[`${FormDataEnum.repositoryType}.${RepositoryTypeEnum.gitlab}`],
  )
  const isFile = computed(
    () => effectControlStatus[`${FormDataEnum.access}.${AccessModeEnum.uploadFile}`],
  )
  const isToken = computed(
    () => effectControlStatus[`${FormDataEnum.gitConnectType}.${GitConnectTypeEnum.token}`],
  )
  const isSSh = computed(() => effectControlStatus[`${FormDataEnum.pullType}.${PullTypeEnum.ssh}`])

  const validate = () => {
    const valid = formGroup.valid.value
    if (!valid) {
      formGroup.markAsDirty()
    }
    return valid
  }

  return {
    formGroup,
    isGitLabel,
    isFile,
    isToken,
    isSSh,
    validate,
  }
}
