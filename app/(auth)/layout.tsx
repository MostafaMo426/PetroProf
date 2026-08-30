/**
 * app/(auth)/layout.tsx
 * Centered, full-screen auth layout with PetroProf branding.
 */
import type { Metadata } from 'next'
import { AnimatedTechnician } from '@/components/ui/animated-technician'
import { LanguageToggle } from '@/components/ui/language-toggle'

export const metadata: Metadata = {
  title: {
    template: '%s | PetroProf',
    default: 'Sign In | PetroProf Portal',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Rope Access Technician Overlay */}
      <AnimatedTechnician />

      {/* Language Switcher in Auth header */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <LanguageToggle />
      </div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-hero-mesh" />

      {/* Decorative geometric shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-400/8 blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-fade-in">
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            {/* Logo mark */}
            <div className="relative w-12 h-12 rounded-xl bg-orange-gradient flex items-center justify-center shadow-orange-glow">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                {/* Rope access icon: person on rope */}
                <path d="M16 4 L16 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
                <circle cx="16" cy="8" r="3" fill="white" opacity="0.9"/>
                <path d="M11 14 L16 12 L21 14 L19 20 L16 22 L13 20 Z" fill="white" opacity="0.85"/>
                <path d="M13 20 L10 28 M19 20 L22 28" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                PetroProf
              </h1>
              <p className="text-xs text-white/60 font-medium tracking-widest uppercase">
                Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
            <span className="w-8 h-px bg-white/30" />
            <span>Rope Access & Manpower Dispatch</span>
            <span className="w-8 h-px bg-white/30" />
          </div>
        </div>

        {children}

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} PetroProf. All rights reserved.{' '}
          <span className="text-white/20">·</span>{' '}
          <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>{' '}
          <span className="text-white/20">·</span>{' '}
          <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
        </p>
      </div>
    </div>
  )
}
