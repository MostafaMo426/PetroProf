import type { Metadata } from 'next'
import { Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verify Your Email',
}

export default function VerifyEmailPage() {
  return (
    <div className="auth-card p-8 text-center animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-200 flex items-center justify-center mx-auto mb-5">
        <Mail className="h-10 w-10 text-orange-500" />
      </div>

      <h2 className="text-xl font-bold text-navy-900 mb-2">Check your email</h2>
      <p className="text-sm text-navy-500 leading-relaxed mb-6">
        We sent a verification link to your email address. Click the link to
        activate your account and access the PetroProf Portal.
      </p>

      {/* Steps */}
      <div className="space-y-3 text-left bg-navy-50 rounded-xl p-4 mb-6">
        {[
          { step: 1, text: 'Open your email inbox' },
          { step: 2, text: 'Look for an email from PetroProf' },
          { step: 3, text: 'Click the verification link' },
          { step: 4, text: 'You\'ll be redirected to your portal' },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <p className="text-sm text-navy-700">{text}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-navy-400 mb-4">
        Didn&apos;t receive the email? Check your spam folder.
      </p>

      <Link
        href="/login"
        className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
      >
        ← Back to sign in
      </Link>
    </div>
  )
}
