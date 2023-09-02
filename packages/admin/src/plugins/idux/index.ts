import type { App } from 'vue'

import { vClickOutside } from '@idux/cdk'
import {
  createGlobalConfig,
  seerConfig,
  IDUX_ICON_DEPENDENCIES,
  addIconDefinitions,
} from '@idux/components'
import { Eye, EyeInvisible } from '@idux/components/icon'
import { merge } from 'lodash-es'

import IduxProviders from './Providers.vue'

// 静态加载: `IDUX_ICON_DEPENDENCIES` 是 `@idux` 的部分组件默认所使用到图标，建议在此时静态引入。
addIconDefinitions([...IDUX_ICON_DEPENDENCIES, Eye, EyeInvisible])

// 动态加载：不会被打包，可以减小包体积，需要加载的时候时候 http 请求加载
// 自定义图标的前缀
const customIconPrefix = 'custom:'
const loadIconDynamically = (iconName: string) => {
  const isCustom = iconName.startsWith(customIconPrefix)
  const iconDirname = isCustom ? 'custom-icons' : 'idux-icons'
  const iconFilename = isCustom ? iconName.slice(customIconPrefix.length) : iconName
  return fetch(import.meta.env.BASE_URL + `${iconDirname}/${iconFilename}.svg`).then(res =>
    res.text(),
  )
}

const globalConfig = createGlobalConfig(
  merge(
    {
      ...seerConfig,
    },
    { icon: { loadIconDynamically } },
  ),
)

export const setupIDux = (app: App): void => {
  app.use(globalConfig)
  app.directive('clickOutside', vClickOutside)
}

export { IduxProviders }
export { Drawer, Notification, Modal, Message, LoadingBar, Spin } from './providers'
