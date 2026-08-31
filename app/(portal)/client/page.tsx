'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
import { getJobs, type JobWithOrganization } from "@/lib/services/jobs"
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Calculator,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function ClientDashboardPage() {
  const { t, isRTL } = useLanguage()
  const [projects, setProjects] = useState<JobWithOrganization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  const activeCount = projects.filter((p) => p.status === 'in_progress').length
  const pendingCount = projects.filter((p) => p.status === 'submitted' || p.status === 'quoted').length
  const completedCount = projects.filter((p) => p.status === 'completed').length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title={t('clientOperationsCenter')}
        description={t('clientOperationsCenterDesc')}
      >
        <Link href="/client/calculator">
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4 text-orange-500" />
            {t('dynamicEstimator')}
          </Button>
        </Link>
        <Link href="/client/new-request">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            {t('requestManpower')}
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('activeProjects')}
          value={`${activeCount} ${activeCount === 1 ? 'Site' : 'Sites'}`}
          subtitle={`${projects.length} Total Projects`}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: activeCount > 0 ? t('onSchedule') : "Idle", variant: activeCount > 0 ? "success" : "default" }}
        />
        <MetricCard
          title={t('totalRopeHours')}
          value="0 hrs"
          subtitle={t('zeroIncident')}
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: "100%", isPositive: true, label: t('irataVerified') }}
        />
        <MetricCard
          title={t('pendingQuotes')}
          value={`${pendingCount}`}
          subtitle={t('aiAssessmentReady')}
          icon={Sparkles}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: pendingCount > 0 ? t('actionRequired') : "All Quoted", variant: pendingCount > 0 ? "orange" : "default" }}
        />
        <MetricCard
          title={t('completedJobs')}
          value={`${completedCount}`}
          subtitle={t('clientSatisfaction')}
          icon={CheckCircle2}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* AI Risk Assessment Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className={`relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className="space-y-2 max-w-xl">
            <div className={`inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('poweredByGemini')}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {t('aiScopeAnalysis')}
            </h2>
            <p className="text-xs sm:text-sm text-navy-200 leading-relaxed">
              {t('aiScopeAnalysisDesc')}
            </p>
          </div>
          <Link href="/client/new-request" className="shrink-0">
            <Button variant="primary" size="lg" className={`gap-2 font-bold shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              {t('launchAiWizard')}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-lg font-bold text-navy-950">{t('activeProjectsStatus')}</h2>
            <p className="text-xs text-navy-500">{t('activeProjectsStatusDesc')}</p>
          </div>
          <Link href="/client/projects">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-navy-600">
              {t('allProjects')} <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-navy-100 shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="h-16 w-16 bg-navy-50 text-navy-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              0
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-navy-950">{t('noJobs')}</h3>
              <p className="text-sm text-navy-500">{t('noJobsDesc')}</p>
            </div>
            <Link href="/client/new-request">
              <Button variant="primary" className="gap-2 shadow-orange-glow">
                <Plus className="h-4 w-4" />
                {t('requestManpower')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col justify-between hover:border-navy-300">
                <CardHeader className="pb-3">
                  <div className={`flex items-center justify-between gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">
                      {project.request_number || project.id}
                    </span>
                    <JobStatusBadge status={project.status} />
                  </div>
                  <CardTitle className="text-base font-bold text-navy-950">
                    {project.project_name}
                  </CardTitle>
                  <CardDescription className={`flex items-center gap-1 text-xs text-navy-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-3 w-3 text-navy-400 shrink-0" />
                    {project.work_location || project.work_city || 'Saudi Arabia'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="p-3 rounded-xl bg-navy-50/70 border border-navy-100/80 space-y-1.5 text-xs">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-navy-400 font-medium">{t('crew')}:</span>
                      <span className="text-navy-900 font-bold">{project.required_level_3}x L3, {project.required_level_2}x L2, {project.required_level_1}x L1</span>
                    </div>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-navy-400 font-medium">{t('riskLevel')}:</span>
                      <RiskLevelBadge level={project.risk_level || 'medium'} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className={`pt-0 border-t border-navy-50 mt-auto p-4 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-xs font-semibold text-emerald-600 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t('irataVerifiedLabel')}
                  </span>
                  <Link href={`/client/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold h-7">
                      {t('viewDetails')}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
