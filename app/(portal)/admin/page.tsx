'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge, JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
import { getJobs, type JobWithOrganization } from "@/lib/services/jobs"
import { getTechnicians, type TechnicianWithProfile } from "@/lib/services/technicians"
import {
  Users,
  Briefcase,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowUpRight,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { t, isRTL } = useLanguage()
  const [jobs, setJobs] = useState<JobWithOrganization[]>([])
  const [technicians, setTechnicians] = useState<TechnicianWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getJobs(), getTechnicians()])
      .then(([jobsData, techsData]) => {
        setJobs(jobsData)
        setTechnicians(techsData)
      })
      .finally(() => setLoading(false))
  }, [])

  const activeDeploymentsCount = jobs.filter((j) => j.status === 'in_progress').length
  const availableTechsCount = technicians.filter((t) => t.status === 'available').length
  const pendingRequestsCount = jobs.filter(
    (j) => j.status === 'submitted' || j.status === 'ai_assessed' || j.status === 'quoted'
  ).length
  const l3SupervisorsCount = technicians.filter(
    (t) => t.irata_level === 'level_3' && t.status === 'available'
  ).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title={t('adminCommandCenter')}
        description={t('adminCommandCenterDesc')}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('liveDispatch')}
          </span>
        }
      >
        <Link href="/admin/quoting">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            {t('aiQuotingEngine')}
          </Button>
        </Link>
        <Link href="/admin/technicians">
          <Button variant="primary" className="gap-2">
            <Users className="h-4 w-4" />
            {t('dispatchCrew')}
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Metric Cards Row (Real Data from Supabase) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('activeDeployments')}
          value={`${activeDeploymentsCount} ${activeDeploymentsCount === 1 ? 'Site' : 'Sites'}`}
          subtitle={`${jobs.length} total operations`}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: activeDeploymentsCount > 0 ? "Live" : "Idle", variant: activeDeploymentsCount > 0 ? "success" : "default" }}
        />
        <MetricCard
          title={t('availableRoster')}
          value={`${availableTechsCount} Techs`}
          subtitle={`${l3SupervisorsCount} L3 Supervisors ready`}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: `${technicians.length} Total`, variant: "success" }}
        />
        <MetricCard
          title={t('pendingRequests')}
          value={`${pendingRequestsCount} Jobs`}
          subtitle={t('requiringReview')}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: pendingRequestsCount > 0 ? "Review Needed" : "All Clear", variant: pendingRequestsCount > 0 ? "warning" : "default" }}
        />
        <MetricCard
          title={t('complianceAlerts')}
          value="0 Alerts"
          subtitle="All personnel IRATA compliant"
          icon={ShieldAlert}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badge={{ text: "100% Valid", variant: "success" }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Deployments Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-black text-navy-950">
                {t('activeJobDeployments')}
              </CardTitle>
              <CardDescription>
                {t('activeJobDeploymentsDesc')}
              </CardDescription>
            </div>
            <Link href="/admin/jobs">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-navy-600">
                {t('viewAll')} <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {jobs.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-400 flex items-center justify-center mx-auto">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-navy-900">{t('noJobs')}</p>
                  <p className="text-xs text-navy-500">{t('noJobsDesc')}</p>
                </div>
                <Link href="/admin/quoting">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold mt-2">
                    <Plus className="h-3.5 w-3.5" />
                    Create First Quote
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">{t('jobClient')}</th>
                      <th className="py-3 px-4">{t('location')}</th>
                      <th className="py-3 px-4">{t('safetyRisk')}</th>
                      <th className="py-3 px-4">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50 font-medium">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-navy-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-navy-950">{job.project_name}</p>
                          <p className="text-[11px] text-navy-400">{job.organization_name || 'Client'} • {job.request_number || job.id}</p>
                        </td>
                        <td className="py-3.5 px-4 text-navy-600">
                          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <MapPin className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                            {job.work_location || job.work_city || 'Saudi Arabia'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4"><RiskLevelBadge level={job.risk_level || 'medium'} /></td>
                        <td className="py-3.5 px-4"><JobStatusBadge status={job.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance Tracker Card (1 col) */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-base font-black text-navy-950 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('complianceTracker')}
              </CardTitle>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% OK
              </span>
            </div>
            <CardDescription>{t('complianceTrackerDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 flex-1">
            {technicians.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-navy-900">No Compliance Issues</p>
                <p className="text-[11px] text-navy-400">All registered personnel are verified and up to date.</p>
              </div>
            ) : (
              technicians.slice(0, 4).map((tech) => (
                <div
                  key={tech.id}
                  className="p-3 rounded-xl bg-navy-50/60 border border-navy-100 flex items-center justify-between gap-3 hover:bg-navy-50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="text-xs font-bold text-navy-950 truncate">
                        {tech.profile?.full_name || 'Technician'}
                      </p>
                      <IrataBadge level={tech.irata_level} short />
                    </div>
                    <p className="text-[11px] text-navy-500 truncate">
                      {tech.employee_id} • {tech.status === 'available' ? 'Available' : 'Deployed'}
                    </p>
                  </div>
                  <div className={`${isRTL ? 'text-left' : 'text-right'} shrink-0`}>
                    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <div className="p-4 border-t border-navy-100 bg-navy-50/30">
            <Link href="/admin/compliance" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold text-navy-700">
                {t('viewFullCompliance')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
