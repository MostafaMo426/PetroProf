import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Mail, Key } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Profile | PetroProf',
}

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title="Admin Profile & Privileges"
        description="System administrator credentials and root security access status."
      />

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl">
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-950">Operations Administrator</h2>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Super Admin Role Active
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-navy-100 space-y-2 text-xs text-navy-600">
          <p><strong>Privileges:</strong> Full user creation, account deletion, quote authorizations, compliance override.</p>
          <p><strong>Security Policy:</strong> Multi-tenant Row Level Security (RLS) active on all PostgreSQL tables.</p>
        </div>
      </Card>
    </div>
  )
}
