import { createContext, useContext } from 'react'
import { useRouter } from '@tanstack/react-router'
import type {Theme} from '@/lib/theme';
import {  setThemeServerFn } from '@/lib/theme'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | null>(null)

export function ThemeProvider({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: Theme
}) {
  const router = useRouter()

  function setTheme(newTheme: Theme) {
    setThemeServerFn({ data: newTheme }).then(() => router.invalidate())
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
