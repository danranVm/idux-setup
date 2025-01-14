export {}

declare global {
  function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number
  function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number
  function clearInterval(handle?: number): void
  function clearTimeout(handle?: number): void

  interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_SERVER_URL: string
    readonly VITE_MOCK_ENABLED: boolean
    readonly VITE_APP_TITLE: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  type Indexable<T = any> = {
    [key: string]: T
  }
  type Lazy<T> = () => Promise<T>
  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>
  type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
}
