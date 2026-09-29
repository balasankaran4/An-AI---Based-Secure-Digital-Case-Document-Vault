import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { FontScale, Language } from '../types'
import { translations, type TranslationKey } from '../utils/i18n'

interface UIContextValue {
  language: Language
  setLanguage: (l: Language) => void
  fontScale: FontScale
  setFontScale: (s: FontScale) => void
  highContrast: boolean
  setHighContrast: (v: boolean) => void
  t: (key: TranslationKey) => string
  toast: string | null
  showToast: (msg: string) => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('sdcdv.lang') as Language) || 'en')
  const [fontScale, setFontScale] = useState<FontScale>(() => (localStorage.getItem('sdcdv.font') as FontScale) || 'md')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('sdcdv.hc') === '1')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('sdcdv.lang', language)
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
  }, [language])

  useEffect(() => {
    localStorage.setItem('sdcdv.font', fontScale)
    document.documentElement.dataset.font = fontScale
  }, [fontScale])

  useEffect(() => {
    localStorage.setItem('sdcdv.hc', highContrast ? '1' : '0')
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal'
  }, [highContrast])

  const t = useCallback((key: TranslationKey) => translations[language][key] ?? translations.en[key], [language])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }

  const value = useMemo(
    () => ({ language, setLanguage, fontScale, setFontScale, highContrast, setHighContrast, t, toast, showToast }),
    [language, fontScale, highContrast, t, toast],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
