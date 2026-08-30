import type { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your PetroProf Portal account',
}

export default function SignupPage() {
  return (
    <div className="auth-card p-6 sm:p-8">
      <SignupForm />
    </div>
  )
}
