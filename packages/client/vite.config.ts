/* eslint-disable import/no-unresolved */

import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig, loadEnv } from 'vite'

import { convertViteEnv, createVitePlugins } from '../../scripts/vite'

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'
  const envDir = resolve(__dirname, './envs')
  const envConfig = convertViteEnv(loadEnv(mode, envDir))
  const { VITE_BASE_URL } = envConfig
  return {
    base: VITE_BASE_URL,
    envDir,
    plugins: createVitePlugins(envConfig),
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
        },
      },
    },
    define: {
      __DEV__: !isBuild,
    },
  }
})
