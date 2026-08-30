'use client'

/**
 * components/auth/SignupForm.tsx
 * 3-step signup wizard: Role Selection → Personal Details → Role-Specific Info
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  Building2, HardHat, User, Mail, Lock, Phone,
  Eye, EyeOff, Loader2, CheckCircle2, ChevronRight, ChevronLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Schemas ───────────────────────────────────────────────────────────────────
const step2Schema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})

const step3ClientSchema = z.object({
  organization_name: z.string().min(2, 'Company name is required'),
  industry_sector: z.string().min(1, 'Please select a sector'),
})

const step3TechSchema = z.object({
  irata_level: z.enum(['level_1', 'level_2', 'level_3']),
  years_experience: z.coerce.number().min(0).max(50),
})

type Step = 1 | 2 | 3
type Role = 'client' | 'technician'

type Step2Data = z.infer<typeof step2Schema>
type Step3ClientData = z.infer<typeof step3ClientSchema>
type Step3TechData = z.infer<typeof step3TechSchema>

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: Step; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => {
        const step = (i + 1) as Step
        const isDone = step < current
        const isActive = step === current
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                isDone   && 'step-complete',
                isActive && 'step-active animate-pulse-glow',
                !isDone && !isActive && 'step-pending'
              )}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : step}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  'w-8 h-0.5 rounded-full transition-all duration-500',
                  step < current ? 'bg-navy-900' : 'bg-navy-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Input field ───────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string
  icon?: React.ElementType
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy-700">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400 pointer-events-none z-10" />
        )}
        {children}
      </div>
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  )
}

const inputClass = (hasIcon = true, hasError = false) =>
  cn(
    'w-full py-2.5 text-sm rounded-lg border bg-white',
    'text-navy-900 placeholder:text-navy-300',
    'transition-colors outline-none',
    'focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500',
    hasIcon ? 'pl-10 pr-4' : 'px-4',
    hasError ? 'border-red-400' : 'border-navy-200'
  )

// ── Main component ────────────────────────────────────────────────────────────
export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // Step 2 form
  const {
    register: r2,
    handleSubmit: h2,
    formState: { errors: e2 },
  } = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })

  // Step 3 client form
  const {
    register: r3c,
    handleSubmit: h3c,
    formState: { errors: e3c },
  } = useForm<Step3ClientData>({ resolver: zodResolver(step3ClientSchema) })

  // Step 3 tech form
  const {
    register: r3t,
    handleSubmit: h3t,
    formState: { errors: e3t },
  } = useForm<Step3TechData>({ resolver: zodResolver(step3TechSchema) })

  // ── Step 1: Role selection ──────────────────────────────────────────────────
  function selectRole(r: Role) {
    setRole(r)
    setStep(2)
  }

  // ── Step 2: Personal details ────────────────────────────────────────────────
  function onStep2(data: Step2Data) {
    setStep2Data(data)
    setStep(3)
  }

  // ── Step 3: Final signup ────────────────────────────────────────────────────
  async function finishSignup(roleSpecific: Record<string, unknown>) {
    if (!step2Data || !role) return
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: step2Data.email,
        password: step2Data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: step2Data.full_name,
            phone: step2Data.phone,
            role,
            ...roleSpecific,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.session) {
        // Auto-confirmed (e.g., email confirmation disabled in dev)
        toast.success('Account created! Redirecting...')
        router.push(role === 'client' ? '/client' : '/technician')
      } else {
        // Email confirmation required
        router.push('/verify-email')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <StepIndicator current={step} total={3} />

      {/* ── Step 1: Role ──────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center mb-5">
            <h2 className="text-lg font-bold text-navy-900">How will you use PetroProf?</h2>
            <p className="text-sm text-navy-500 mt-1">Choose your account type to get started</p>
          </div>

          <button
            type="button"
            onClick={() => selectRole('client')}
            className={cn(
              'w-full p-5 rounded-xl border-2 border-navy-100 bg-white text-left',
              'hover:border-orange-400 hover:shadow-card-hover',
              'transition-all duration-200 group',
              'flex items-start gap-4'
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors shrink-0">
              <Building2 className="h-6 w-6 text-navy-600 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-900 text-sm">Client Organization</p>
                <ChevronRight className="h-4 w-4 text-navy-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-xs text-navy-500 mt-0.5">
                Request certified rope access crews for your projects
              </p>
              <div className="flex gap-2 mt-2">
                {['Request Manpower', 'Get Quotes', 'Track Projects'].map((tag) => (
                  <span key={tag} className="text-[10px] bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectRole('technician')}
            className={cn(
              'w-full p-5 rounded-xl border-2 border-navy-100 bg-white text-left',
              'hover:border-orange-400 hover:shadow-card-hover',
              'transition-all duration-200 group',
              'flex items-start gap-4'
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-navy-50 group-hover:bg-orange-50 flex items-center justify-center transition-colors shrink-0">
              <HardHat className="h-6 w-6 text-navy-600 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-900 text-sm">Rope Access Technician</p>
                <ChevronRight className="h-4 w-4 text-navy-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-xs text-navy-500 mt-0.5">
                Manage your IRATA credentials, log rope hours, and get deployed
              </p>
              <div className="flex gap-2 mt-2">
                {['Digital Logbook', 'Cert Management', 'Job Dispatch'].map((tag) => (
                  <span key={tag} className="text-[10px] bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>

          <p className="text-center text-xs text-navy-400">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-medium hover:text-orange-700">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ── Step 2: Personal Details ──────────────────────────────────────── */}
      {step === 2 && (
        <form onSubmit={h2(onStep2)} className="space-y-4 animate-fade-in">
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-navy-900">Your details</h2>
            <p className="text-sm text-navy-500 mt-0.5">
              {role === 'client' ? 'Set up your client account' : 'Set up your technician profile'}
            </p>
          </div>

          <Field label="Full name" icon={User} error={e2.full_name?.message}>
            <input
              {...r2('full_name')}
              type="text"
              placeholder="Mohammed Al-Ahmad"
              autoComplete="name"
              className={inputClass(true, !!e2.full_name)}
            />
          </Field>

          <Field label="Work email" icon={Mail} error={e2.email?.message}>
            <input
              {...r2('email')}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className={inputClass(true, !!e2.email)}
            />
          </Field>

          <Field label="Phone (optional)" icon={Phone} error={e2.phone?.message}>
            <input
              {...r2('phone')}
              type="tel"
              placeholder="+966 5x xxx xxxx"
              autoComplete="tel"
              className={inputClass(true, false)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" icon={Lock} error={e2.password?.message}>
              <input
                {...r2('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(inputClass(true, !!e2.password), 'pr-9')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </Field>

            <Field label="Confirm password" icon={Lock} error={e2.confirm_password?.message}>
              <input
                {...r2('confirm_password')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(inputClass(true, !!e2.confirm_password), 'pr-9')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400"
              >
                {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </Field>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-navy-200 text-navy-600 text-sm font-medium hover:border-navy-400 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white',
                'bg-orange-gradient shadow-orange-glow',
                'hover:opacity-90 active:scale-[0.98] transition-all',
                'flex items-center justify-center gap-1.5'
              )}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── Step 3: Role-specific ─────────────────────────────────────────── */}
      {step === 3 && role === 'client' && (
        <form
          onSubmit={h3c((d) => finishSignup({ organization_name: d.organization_name, industry_sector: d.industry_sector }))}
          className="space-y-4 animate-fade-in"
        >
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-navy-900">Company details</h2>
            <p className="text-sm text-navy-500 mt-0.5">Tell us about your organization</p>
          </div>

          <Field label="Company name" icon={Building2} error={e3c.organization_name?.message}>
            <input
              {...r3c('organization_name')}
              type="text"
              placeholder="Saudi Aramco"
              className={inputClass(true, !!e3c.organization_name)}
            />
          </Field>

          <Field label="Industry sector" error={e3c.industry_sector?.message}>
            <select
              {...r3c('industry_sector')}
              className={cn(inputClass(false, !!e3c.industry_sector), 'appearance-none cursor-pointer')}
            >
              <option value="">Select sector...</option>
              <option value="Oil & Gas">Oil & Gas</option>
              <option value="Petrochemical">Petrochemical</option>
              <option value="Construction">Construction</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Marine">Marine</option>
              <option value="Power & Utilities">Power & Utilities</option>
              <option value="Mining">Mining</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-navy-200 text-navy-600 text-sm font-medium hover:border-navy-400 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white',
                'bg-orange-gradient shadow-orange-glow',
                'hover:opacity-90 active:scale-[0.98] transition-all',
                'flex items-center justify-center gap-1.5',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                : <><CheckCircle2 className="h-4 w-4" /> Create Account</>
              }
            </button>
          </div>
        </form>
      )}

      {step === 3 && role === 'technician' && (
        <form
          onSubmit={h3t((d) => finishSignup({ irata_level: d.irata_level, years_experience: d.years_experience }))}
          className="space-y-4 animate-fade-in"
        >
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-navy-900">IRATA Credentials</h2>
            <p className="text-sm text-navy-500 mt-0.5">Your primary certification level</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'level_1', label: 'Level 1', desc: 'Technician' },
              { value: 'level_2', label: 'Level 2', desc: 'Technician' },
              { value: 'level_3', label: 'Level 3', desc: 'Supervisor' },
            ] as const).map(({ value, label, desc }) => (
              <label
                key={value}
                className={cn(
                  'cursor-pointer p-3 rounded-xl border-2 text-center transition-all duration-200',
                  'hover:border-orange-400',
                  'has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50'
                )}
              >
                <input
                  {...r3t('irata_level')}
                  type="radio"
                  value={value}
                  className="sr-only"
                />
                <p className="font-bold text-navy-900 text-sm">{label}</p>
                <p className="text-[11px] text-navy-500 mt-0.5">{desc}</p>
              </label>
            ))}
          </div>
          {e3t.irata_level && <p className="text-xs text-red-500">⚠ {e3t.irata_level.message}</p>}

          <Field label="Years of rope access experience" error={e3t.years_experience?.message}>
            <input
              {...r3t('years_experience')}
              type="number"
              min={0}
              max={50}
              placeholder="e.g. 5"
              className={inputClass(false, !!e3t.years_experience)}
            />
          </Field>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-navy-200 text-navy-600 text-sm font-medium hover:border-navy-400 transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white',
                'bg-orange-gradient shadow-orange-glow',
                'hover:opacity-90 active:scale-[0.98] transition-all',
                'flex items-center justify-center gap-1.5',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                : <><CheckCircle2 className="h-4 w-4" /> Create Account</>
              }
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
