'use client'

/**
 * components/auth/LoginForm.tsx
 * Email + Password login form with magic link toggle.
 * Uses React Hook Form + Zod validation.
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Validation Schemas ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const magicLinkSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type LoginFormData = z.infer<typeof loginSchema>
type MagicLinkFormData = z.infer<typeof magicLinkSchema>

// ── Reusable input wrapper ────────────────────────────────────────────────────
function InputGroup({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string
  icon: React.ElementType
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400 pointer-events-none z-10" />
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const redirectTo = searchParams.get('redirect') ?? '/'

  const [isMagicLink, setIsMagicLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const supabase = createClient()

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  // Magic link form
  const {
    register: registerMagic,
    handleSubmit: handleMagicSubmit,
    formState: { errors: magicErrors },
  } = useForm<MagicLinkFormData>({ resolver: zodResolver(magicLinkSchema) })

  // ── Password login ──────────────────────────────────────────────────────────
  async function onPasswordLogin(data: LoginFormData) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Welcome back!')
      router.refresh()
      router.push(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Magic link ──────────────────────────────────────────────────────────────
  async function onMagicLink(data: MagicLinkFormData) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setMagicLinkSent(true)
      toast.success('Magic link sent! Check your email.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Magic link sent confirmation ────────────────────────────────────────────
  if (magicLinkSent) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Check your inbox</h2>
        <p className="text-sm text-navy-500">
          We sent a secure magic link to your email. Click it to sign in — valid for 1 hour.
        </p>
        <button
          onClick={() => setMagicLinkSent(false)}
          className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          ← Try a different email
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* URL error */}
      {urlError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          ⚠ {decodeURIComponent(urlError)}
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-navy-100 p-1 bg-navy-50/50">
        <button
          type="button"
          onClick={() => setIsMagicLink(false)}
          className={cn(
            'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            !isMagicLink
              ? 'bg-white text-navy-900 shadow-sm'
              : 'text-navy-500 hover:text-navy-700'
          )}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setIsMagicLink(true)}
          className={cn(
            'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5',
            isMagicLink
              ? 'bg-white text-navy-900 shadow-sm'
              : 'text-navy-500 hover:text-navy-700'
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Magic Link
        </button>
      </div>

      {/* Password Form */}
      {!isMagicLink && (
        <form onSubmit={handlePasswordSubmit(onPasswordLogin)} className="space-y-4">
          <InputGroup label="Email address" icon={Mail} error={passwordErrors.email?.message}>
            <input
              {...registerPassword('email')}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white',
                'text-navy-900 placeholder:text-navy-300',
                'transition-colors outline-none',
                'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
                passwordErrors.email ? 'border-red-400' : 'border-navy-200'
              )}
            />
          </InputGroup>

          <InputGroup label="Password" icon={Lock} error={passwordErrors.password?.message}>
            <input
              {...registerPassword('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(
                'w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border bg-white',
                'text-navy-900 placeholder:text-navy-300',
                'transition-colors outline-none',
                'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
                passwordErrors.password ? 'border-red-400' : 'border-navy-200'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 transition-colors"
            >
              {showPassword
                ? <EyeOff className="h-4 w-4" />
                : <Eye className="h-4 w-4" />}
            </button>
          </InputGroup>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 px-4 rounded-xl text-sm font-semibold text-white',
              'bg-orange-gradient shadow-orange-glow',
              'hover:opacity-90 active:scale-[0.98]',
              'transition-all duration-200',
              'flex items-center justify-center gap-2',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
              'focus-ring'
            )}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      )}

      {/* Magic Link Form */}
      {isMagicLink && (
        <form onSubmit={handleMagicSubmit(onMagicLink)} className="space-y-4">
          <InputGroup label="Email address" icon={Mail} error={magicErrors.email?.message}>
            <input
              {...registerMagic('email')}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white',
                'text-navy-900 placeholder:text-navy-300',
                'transition-colors outline-none',
                'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
                magicErrors.email ? 'border-red-400' : 'border-navy-200'
              )}
            />
          </InputGroup>

          <p className="text-xs text-navy-400 bg-navy-50 rounded-lg px-3 py-2">
            ✨ We&apos;ll email you a secure link. No password needed — valid for 60 minutes.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 px-4 rounded-xl text-sm font-semibold text-white',
              'bg-orange-gradient shadow-orange-glow',
              'hover:opacity-90 active:scale-[0.98]',
              'transition-all duration-200',
              'flex items-center justify-center gap-2',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
              'focus-ring'
            )}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending link...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Send Magic Link</>
            )}
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-navy-100" />
        <span className="text-xs text-navy-400 font-medium">New to PetroProf?</span>
        <div className="flex-1 h-px bg-navy-100" />
      </div>

      <Link
        href="/signup"
        className={cn(
          'w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-navy-700',
          'border-2 border-navy-200 bg-white',
          'hover:border-orange-400 hover:text-orange-600',
          'transition-all duration-200',
          'flex items-center justify-center',
          'focus-ring'
        )}
      >
        Create an account
      </Link>
    </div>
  )
}
