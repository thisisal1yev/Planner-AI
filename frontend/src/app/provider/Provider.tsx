import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useThemeStore } from '@shared/model/theme.store'

interface ProviderProps {
  children: ReactNode
}

export function Provider({ children }: ProviderProps) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}
