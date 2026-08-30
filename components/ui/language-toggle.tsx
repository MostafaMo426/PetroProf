'use client'

import * as React from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { Languages, Globe } from 'lucide-react'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-navy-200/80 bg-white/90 hover:bg-navy-50 text-navy-800 shadow-2xs hover:border-navy-300 active:scale-95 ${className}`}
      title={language === 'en' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
    >
      <Globe className="h-3.5 w-3.5 text-orange-500 shrink-0" />
      <span className="font-semibold">{language === 'en' ? 'العربية' : 'EN'}</span>
    </button>
  )
}
