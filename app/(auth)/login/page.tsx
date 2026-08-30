import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your PetroProf Portal account',
}

export default function LoginPage() {
  return (
    <div className="auth-card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-900">Welcome back</h2>
        <p className="text-sm text-navy-500 mt-1">
          Sign in to access your PetroProf portal
        </p>
      </div>
      <Suspense fallback={<div className="h-64 skeleton rounded-xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
