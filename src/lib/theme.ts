import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ui-theme'
const DEFAULT_THEME: Theme = 'dark'

export const getThemeServerFn = createServerFn().handler(
  () => (getCookie(STORAGE_KEY) || DEFAULT_THEME) as Theme
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator((theme: Theme) => theme)
  .handler(({ data }) => setCookie(STORAGE_KEY, data))
