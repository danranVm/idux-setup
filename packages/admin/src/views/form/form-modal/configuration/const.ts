import type { SelectData } from '@idux/components/select'

import {
  AccessModeEnum,
  GitConnectTypeEnum,
  PullTypeEnum,
  RepositoryTypeEnum,
  FormDataEnum,
} from './enum'
import type { FormData } from './interface'
import type { EffectConfig } from '../hooks/useEffectControl'

/**
 * 获取方式
 * @type {SelectData}
 */
export const accessRadioOptions: SelectData[] = [
  {
    label: '仓库获取',
    key: AccessModeEnum.git,
  },
  {
    label: '上传文件',
    key: AccessModeEnum.uploadFile,
  },
]

/**
 * 连接方式
 * @type {SelectData}
 */
export const gitConnectTypeOptions: SelectData[] = [
  {
    label: '用户名和密码',
    key: GitConnectTypeEnum.user,
  },
  {
    label: 'Token登录',
    key: GitConnectTypeEnum.token,
  },
]

/**
 * GIT类型
 * @type {SelectData}
 */
export const repositoryTypeOptions: SelectData[] = [
  { label: 'gitlab', key: RepositoryTypeEnum.gitlab },
  { label: 'github', key: RepositoryTypeEnum.github },
  { label: 'gitee', key: RepositoryTypeEnum.gitee },
]

/**
 * 连接方式
 * @type {SelectData}
 */
export const pullTypeOptions: SelectData[] = [
  {
    label: 'HTTP/HTTPS',
    key: PullTypeEnum.http,
  },
  {
    label: 'SSH',
    key: PullTypeEnum.ssh,
  },
]

export const effectConfig: EffectConfig = {
  [FormDataEnum.access]: {
    effect: {
      [AccessModeEnum.uploadFile]: {
        show: [FormDataEnum.file],
      },
      [AccessModeEnum.git]: {
        show: [
          FormDataEnum.pullType,
          FormDataEnum.gitConnectType,
          FormDataEnum.repositoryType,
          FormDataEnum.gitAddress,
          FormDataEnum.branch,
        ],
      },
    },
  },
  [FormDataEnum.repositoryType]: {
    effect: {
      [RepositoryTypeEnum.gitlab]: {
        show: [FormDataEnum.gitLabHead, FormDataEnum.gitlabApiVersion],
      },
    },
  },
  [FormDataEnum.gitConnectType]: {
    effect: {
      [GitConnectTypeEnum.token]: {
        show: [FormDataEnum.token],
      },
      [GitConnectTypeEnum.user]: {
        show: [FormDataEnum.gitUsername, FormDataEnum.gitPassword],
      },
    },
  },
  [FormDataEnum.pullType]: {
    effect: {
      [PullTypeEnum.ssh]: {
        show: [FormDataEnum.privateKey],
      },
    },
  },
}

export const DEFAULT_DATA: FormData = {
  access: AccessModeEnum.git,
  pullType: PullTypeEnum.http,
  gitConnectType: GitConnectTypeEnum.token, // 拉取方式
  repositoryType: RepositoryTypeEnum.gitlab, // git类型
  gitAddress: 'https://www.baidu.git',
  privateKey: '', // ssh拉代码时：私钥
  gitLabHead: '', // GitLab访问配置
  gitlabApiVersion: 'v4', // GitLab接口版本
  branch: '', // 分支名称
  token: 'testtesttest',
  gitUsername: 'user',
  gitPassword: 'password',
  file: '',
}
