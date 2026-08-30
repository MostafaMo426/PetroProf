import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, ShieldAlert, CheckCircle2, FileCheck, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Notifications Center | PetroProf',
}

export default function NotificationsCenterPage() {
  const notifications = [
    {
      id: 1,
      title: 'New Manpower Request Formulated',
      body: 'Saudi Aramco submitted Request #PR-2026-0041 for Flare Stack Inspection.',
      time: '12 mins ago',
      type: 'request',
      icon: FileCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 2,
      title: 'IRATA Certification Expiry Notice',
      body: 'Technician Hassan Al-Zahrani IRATA Level 2 certificate is due for renewal in 68 days.',
      time: '2 hours ago',
      type: 'compliance',
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 3,
      title: 'On-Site QR Sign-Off Verified',
      body: 'Lead Supervisor Tariq Al-Ghamdi verified shift hours on Ras Tanura site.',
      time: '5 hours ago',
      type: 'logbook',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ]

  return (
    <div className="min-h-screen bg-navy-50/50 p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <PageHeader
          title="Notification Center"
          description="Real-time operational alerts, compliance warnings, and quote status updates."
        />

        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon
            return (
              <Card key={n.id} className="p-4 flex items-start gap-3 hover:border-navy-300 transition-all">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-navy-950">{n.title}</h3>
                    <span className="text-[10px] text-navy-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-navy-600">{n.body}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center pt-4">
          <Link href="/admin">
            <Button variant="outline" className="text-xs font-bold">
              Back to Operations Command
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
