/* eslint-disable import/no-unresolved */

import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { IduxResolver } from 'unplugin-vue-components/resolvers'
import viteComponents from 'unplugin-vue-components/vite'
import type { Plugin } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import windiCSS from 'vite-plugin-windicss'

const componentPath: Record<string, string> = {
  CdkClickOutside: '@idux/cdk/click-outside',
  CdkDraggable: '@idux/cdk/drag-drop',
  CdkResizable: '@idux/cdk/resize',
  CdkResizableHandle: '@idux/cdk/resize',
  CdkResizeObserver: '@idux/cdk/resize',
  IxLoadingBar: '@idux/components/loading-bar',
  IxLoadingBarProvider: '@idux/components/loading-bar',
}

export function createVitePlugins(env: ImportMetaEnv): Plugin[] {
  const { VITE_MOCK_ENABLED } = env

  const plugins = [
    vue(),
    vueJsx(),
    windiCSS(),
    viteComponents({
      extensions: ['vue'],
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
      directoryAsNamespace: true,
      resolvers: [
        (name: string) => {
          if (name.startsWith('Ix') && name.endsWith('Chart')) {
            return { name, from: '@idux/charts' }
          }
          const path = componentPath[name]
          return path ? { name, from: path } : undefined
        },
        IduxResolver(),
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, '../../node_modules/@idux/components/icon/assets/*.svg').replace(
            /\\/g,
            '/',
          ),
          dest: 'idux-icons',
        },
      ],
    }),
    chunkSplitPlugin(),
  ]

  if (VITE_MOCK_ENABLED) {
    // plugins.push(
    //   viteMockServe({
    //     ignore: /^_/,
    //     mockPath: 'mock',
    //     localEnabled: true,
    //   }),
    // )
  }

  return plugins as Plugin[]
}
