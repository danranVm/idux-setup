export interface FormData {
  /** 获取方式：git  coding  artifactory */
  access: string
  /** 分支名 */
  branch: string
  /** 仓库地址 */
  gitAddress: string
  /** 连接类型： 1: 用 户 名 密 码 方式拉取代码 2: token 方 式 拉 取代码 */
  gitConnectType: number
  /** GitLab访问配置 */
  gitLabHead: string
  /** 密码 */
  gitPassword: string
  /** 用户名 */
  gitUsername: string
  /** gitlab版本 v3/v4 */
  gitlabApiVersion: string
  /** ssh拉代码时：私钥 */
  privateKey: string
  /** 拉代码方式：1: HTTPS 2：SSH */
  pullType: number
  /** 仓库类型：1:gitlab 2:github 3:gitee */
  repositoryType: number
  /** token */
  token: string
  file: string
}

export interface ApiReturn<T = any> {
  isSuccess: boolean
  msg: string
  data: T
  [key: string]: any
}
