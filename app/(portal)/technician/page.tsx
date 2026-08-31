'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
import { createClient } from "@/lib/supabase/client"
import {
  Clock,
  Award,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function TechnicianDashboardPage() {
  const { t, isRTL } = useLanguage()
  const [logbookEntries, setLogbookEntries] = useState<any[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch technician info
      const { data: tech }: { data: any } = await supabase
        .from('technicians')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (tech) {
        setTotalHours(Number(tech.total_rope_hours) || 0)
        // Fetch recent logbook entries
        const { data: logs } = await supabase
          .from('logbook_entries')
          .select('*')
          .eq('technician_id', tech.id)
          .order('work_date', { ascending: false })
          .limit(5)

        if (logs) setLogbookEntries(logs)
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title={t('technicianHubTitle')}
        description={t('technicianHubDesc')}
        badge={<IrataBadge level="level_2" />}
      >
        <Link href="/technician/qr-verify">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4 text-navy-700" />
            {t('showQrToken')}
          </Button>
        </Link>
        <Link href="/technician/logbook">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            {t('logWorkHours')}
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('totalRopeHours')}
          value={`${totalHours} hrs`}
          subtitle={`${Math.max(0, 1500 - totalHours)} hrs to IRATA L3`}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: "Target: 1,500 hrs", variant: "orange" }}
        />
        <MetricCard
          title={t('availabilityStatus')}
          value={t('available')}
          subtitle={t('readyForDeployment')}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: "Active", variant: "success" }}
        />
        <MetricCard
          title={t('irataCert')}
          value="IRATA Level 2"
          subtitle="Valid & Verified"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: t('verified'), variant: "default" }}
        />
        <MetricCard
          title={t('pendingQrSignoffs')}
          value={`${logbookEntries.filter((l) => !l.is_verified).length}`}
          subtitle="Awaiting Supervisor Sign-off"
          icon={QrCode}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{ text: "QR Sync", variant: "warning" }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Logbook */}
        <Card className="lg:col-span-2">
          <CardHeader className={`flex flex-row items-center justify-between pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <CardTitle className="text-base font-black text-navy-950">
                {t('recentLogbookEntries')}
              </CardTitle>
              <CardDescription>{t('recentLogbookDesc')}</CardDescription>
            </div>
            <Link href="/technician/logbook">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-navy-600">
                {t('fullLogbook')} <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {logbookEntries.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-400 flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-navy-900">No Logbook Entries Yet</p>
                  <p className="text-xs text-navy-500">Log your first verified rope hours on project sites.</p>
                </div>
                <Link href="/technician/logbook">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold mt-2">
                    <Plus className="h-3.5 w-3.5" />
                    {t('logWorkHours')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">{t('dateSite')}</th>
                      <th className="py-3 px-4">{t('workScope')}</th>
                      <th className="py-3 px-4">{t('hours')}</th>
                      <th className="py-3 px-4">{t('verification')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50 font-medium">
                    {logbookEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-navy-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-navy-950">{entry.site_name || 'Project Site'}</p>
                          <p className="text-[11px] text-navy-400">{entry.work_date}</p>
                        </td>
                        <td className="py-3.5 px-4 text-navy-600 max-w-xs truncate">
                          {entry.task_description || 'Rope access operations'}
                        </td>
                        <td className="py-3.5 px-4 font-black text-navy-950">{entry.hours_logged} hrs</td>
                        <td className="py-3.5 px-4">
                          {entry.is_verified ? (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <CheckCircle2 className="h-3 w-3" />
                              {t('qrVerified')}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Clock className="h-3 w-3" />
                              {t('pendingSignoff')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credentials & IRATA Progress */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-black text-navy-950">
              {t('credentialsProgress')}
            </CardTitle>
            <CardDescription>{t('credentialsProgressDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {/* Level 3 Progression Meter */}
            <div className="p-4 rounded-xl bg-navy-gradient text-white space-y-2">
              <div className={`flex justify-between items-center text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-navy-300 font-semibold">{t('irataLevel3Prerequisite')}</span>
                <span className="font-bold text-orange-400">{totalHours} / 1,500 hrs</span>
              </div>
              <div className="h-2 w-full rounded-full bg-navy-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-gradient transition-all"
                  style={{ width: `${Math.min(100, (totalHours / 1500) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-navy-300">{t('level3RequirementDesc')}</p>
            </div>

            {/* Upload CTA */}
            <div className="p-4 rounded-xl bg-navy-50 border border-navy-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-navy-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                IRATA & Medical Documents
              </div>
              <p className="text-navy-500 text-[11px]">Upload your certificate scans to extract verification codes automatically via AI OCR.</p>
            </div>
          </CardContent>
          <div className="p-4 border-t border-navy-100 bg-navy-50/30">
            <Link href="/technician/certificates" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold text-navy-700">
                {t('uploadDocumentAiOcr')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
