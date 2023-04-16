import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const userInfo = ref<object | undefined>()

    async function login() {
      token.value = 'token'
      userInfo.value = {}
    }
    async function logout() {
      token.value = ''
      userInfo.value = undefined
    }

    async function getUserInfo() {
      return userInfo.value
    }

    return {
      token,
      login,
      logout,
      getUserInfo,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: localStorage, paths: ['token', 'userInfo'] }],
    },
  },
)
