import { type InjectionKey, type ToRefs } from 'vue'

export interface Config {
  bannerHeader: string
  bannerContent: string

  boxOnlineService: boolean
  boxQrCode: boolean
  boxServicePhone?: string
  boxProductName?: string
}

export type LoginContext = ToRefs<Config>

export const loginContextToken: InjectionKey<LoginContext> = Symbol('loginContextToken')
