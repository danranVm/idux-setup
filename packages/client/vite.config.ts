/* eslint-disable import/no-unresolved */

import { resolve } from 'path'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { IduxResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'

import { convertViteEnv } from '../../scripts/vite'

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'
  const envDir = resolve(__dirname, './envs')
  const { VITE_BASE_URL } = convertViteEnv(loadEnv(mode, envDir))

  return {
    base: VITE_BASE_URL,
    envDir: envDir,
    plugins: [
      vue(),
      vueJsx(),
      Components({
        dts: true,
        resolvers: [
          (name: string) => {
            return name.startsWith('Ix') && name.endsWith('Chart')
              ? { name, from: '@idux/charts' }
              : undefined
          },
          IduxResolver(),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: ['chrome79', 'edge79', 'firefox72', 'safari13'],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import url('@idux/components/style/variable/index.less'); @import url('@idux/pro/style/variable/index.less');`,
        },
      },
    },
    define: {
      __DEV__: !isBuild,
    },
  }
})
