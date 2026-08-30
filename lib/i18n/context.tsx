'use client'

import * as React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language } from './translations'

interface LanguageContextType {
  language: Language
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: keyof typeof translations['en']) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Read stored language preference or default to English
    const saved = localStorage.getItem('petroprof_lang') as Language | null
    if (saved === 'en' || saved === 'ar') {
      setLanguageState(saved)
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = saved
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('petroprof_lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en')
  }

  const isRTL = language === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language]?.[key] || translations['en'][key] || String(key)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
