import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Headphones, Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '24/7 Operations Support | PetroProf',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-navy-50/50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <PageHeader
          title="24/7 Industrial Operations Support"
          description="Direct hotline to PetroProf Technical Rigging Command and Emergency Dispatch Centers in Riyadh and Dhahran."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-950 text-sm">Emergency Hot Desk</h3>
            <p className="text-xs text-navy-500">24/7 On-Call Level 3 Safety Supervisor</p>
            <p className="font-bold text-orange-600 font-mono text-sm">+966 11 800 9922</p>
          </Card>

          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-950 text-sm">Operations Dispatch</h3>
            <p className="text-xs text-navy-500">Quotes & Manpower Planning</p>
            <p className="font-bold text-navy-900 text-xs font-mono">dispatch@petroprof.sa</p>
          </Card>

          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-950 text-sm">Headquarters</h3>
            <p className="text-xs text-navy-500">The Garage Incubator</p>
            <p className="font-bold text-navy-900 text-xs">King Abdulaziz City (KACST), Riyadh</p>
          </Card>
        </div>

        <div className="text-center pt-4">
          <Link href="/login">
            <Button variant="outline" className="text-xs font-bold">
              Return to Portal Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
