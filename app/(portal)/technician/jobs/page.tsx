import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobStatusBadge, RiskLevelBadge } from '@/components/ui/status-badge'
import { Briefcase, MapPin, Calendar, Users, QrCode } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Job Deployments | Technician Hub',
}

export default function TechnicianJobsPage() {
  const deployments = [
    {
      id: 'PR-2026-0041',
      title: 'Flare Stack Inspection #3 & Anchor Line Rigging',
      facility: 'Ras Tanura Refinery, Eastern Province',
      client: 'Saudi Aramco',
      supervisor: 'Tariq Al-Ghamdi (IRATA L3)',
      dates: 'Aug 25 - Sep 08, 2026',
      status: 'in_progress' as const,
      risk: 'high' as const,
    },
    {
      id: 'PR-2026-0040',
      title: 'HQ Tower Exterior Cladding & Glass Sealant Renewal',
      facility: 'Digital City, Riyadh',
      client: 'SABIC HQ',
      supervisor: 'Mansour Al-Harbi (IRATA L3)',
      dates: 'Aug 20 - Sep 05, 2026',
      status: 'in_progress' as const,
      risk: 'medium' as const,
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="My Job Deployments"
        description="Active and scheduled industrial rope access work orders assigned to your roster profile."
      />

      <div className="space-y-4">
        {deployments.map((job) => (
          <Card key={job.id} className="p-5 sm:p-6 space-y-4 hover:border-navy-300 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-navy-400 font-mono">{job.id}</span>
                <h3 className="text-base font-bold text-navy-950 mt-0.5">{job.title}</h3>
                <p className="text-xs text-orange-600 font-semibold">{job.client}</p>
              </div>
              <div className="flex items-center gap-2">
                <RiskLevelBadge level={job.risk} />
                <JobStatusBadge status={job.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-navy-700">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-navy-400 shrink-0" />
                <span>{job.facility}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-navy-400 shrink-0" />
                <span>Lead: {job.supervisor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-navy-400 shrink-0" />
                <span>{job.dates}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-navy-50">
              <Link href="/technician/qr-verify">
                <Button variant="outline" size="sm" className="text-xs font-bold gap-1">
                  <QrCode className="h-3.5 w-3.5" />
                  Show QR Sign-Off
                </Button>
              </Link>
              <Link href="/technician/logbook">
                <Button variant="primary" size="sm" className="text-xs font-bold shadow-orange-glow">
                  Log Hours for Site
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
