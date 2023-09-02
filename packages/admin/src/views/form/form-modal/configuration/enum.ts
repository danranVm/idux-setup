/**
 * git连接方式
 */
export enum GitConnectTypeEnum {
  user = 1,
  token = 2,
}

/**
 * git拉取方式
 */
export enum PullTypeEnum {
  http = 1,
  ssh = 2,
}

/**
 * 访问方式
 */
export enum AccessModeEnum {
  git = 'git',
  uploadFile = 'coding',
}

/**
 * 仓库类型
 */
export enum RepositoryTypeEnum {
  gitlab = 1,
  github = 2,
  gitee = 3,
}

export enum FormDataEnum {
  access = 'access',
  pullType = 'pullType',
  gitConnectType = 'gitConnectType',
  repositoryType = 'repositoryType',
  gitAddress = 'gitAddress',
  privateKey = 'privateKey',
  gitLabHead = 'gitLabHead',
  gitLabPort = 'gitLabPort',
  gitlabApiVersion = 'gitlabApiVersion',
  branch = 'branch',
  token = 'token',
  gitUsername = 'gitUsername',
  gitPassword = 'gitPassword',
  file = 'file',
}
