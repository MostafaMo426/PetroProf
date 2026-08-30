import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobStatusBadge, RiskLevelBadge, IrataBadge } from '@/components/ui/status-badge'
import { formatCurrency } from '@/lib/utils'
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  FileCheck,
  ChevronLeft,
  HardHat,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Project Details | Client Portal',
}

export default function ClientProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = params.id || 'PR-2026-0041'

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <Link href="/client/projects" className="inline-flex items-center gap-1.5 text-xs text-navy-500 hover:text-navy-950 font-bold transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Projects Roster
      </Link>

      <PageHeader
        title="Flare Stack Inspection #3 & Anchor Rigging"
        description="Active industrial rope access ultrasonic thickness inspection and guy-line stabilization."
        badge={<JobStatusBadge status="in_progress" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Crew */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-navy-950 text-sm border-b border-navy-100 pb-2">
              Project Specification
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-navy-400 block text-[10px] uppercase font-bold">Facility Location</span>
                <span className="font-bold text-navy-900">Ras Tanura Refinery, Eastern Province</span>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px] uppercase font-bold">Execution Window</span>
                <span className="font-bold text-navy-900">Aug 25 – Sep 08, 2026 (14 Days)</span>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px] uppercase font-bold">Risk Assessment</span>
                <div className="mt-1"><RiskLevelBadge level="critical" /></div>
              </div>
              <div>
                <span className="text-navy-400 block text-[10px] uppercase font-bold">Active Working Lines</span>
                <span className="font-bold text-navy-900">4 Ropes (Dual System) @ 110m</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-navy-950 text-sm border-b border-navy-100 pb-2 flex items-center justify-between">
              <span>Assigned Deployment Roster (6 Personnel)</span>
              <span className="text-xs font-normal text-emerald-700 font-bold">100% Certified</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Tariq Al-Ghamdi', level: 'level_3' as const, role: 'Lead Safety Supervisor', hours: 4850 },
                { name: 'Hassan Al-Zahrani', level: 'level_2' as const, role: 'NDT Rigging Lead', hours: 2180 },
                { name: 'David Mitchell', level: 'level_3' as const, role: 'Offshore Rescue Lead', hours: 6200 },
                { name: 'Omar Farooq Al-Qarni', level: 'level_1' as const, role: 'Rope Access Tech', hours: 680 },
                { name: 'Fahad Al-Shehri', level: 'level_2' as const, role: 'Welding & NDT Tech', hours: 1490 },
              ].map((tech, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-navy-50/50 border border-navy-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                      {tech.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-950">{tech.name}</h4>
                      <p className="text-[11px] text-navy-400">{tech.role} • {tech.hours.toLocaleString()} hrs</p>
                    </div>
                  </div>
                  <IrataBadge level={tech.level} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Quote Breakdown & Safety Logs */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-navy-950 text-sm border-b border-navy-100 pb-2">
              Financial Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-navy-600">
                <span>Manpower Rate (14 Days)</span>
                <span>{formatCurrency(82500)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>H2S & Extreme Risk Margin</span>
                <span>{formatCurrency(12375)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-navy-950 border-t border-navy-100 pt-2">
                <span>Total Authorized Quote</span>
                <span className="text-orange-600">{formatCurrency(94875)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-emerald-50/50 border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Safety Compliance Verified
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              All anchor test reports, daily pre-rigging checklists, and Saudi Aramco work permits are verified and synchronized.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
