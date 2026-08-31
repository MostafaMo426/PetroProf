'use client'

import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
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

  const projects = [
    {
      id: "PR-2026-0041",
      titleEn: "Flare Stack Inspection #3",
      titleAr: "فحص برج الشعلة #3",
      facilityEn: "Ras Tanura Refinery",
      facilityAr: "مصفاة رأس تنورة",
      crewEn: "1x L3 Supervisor, 2x L2 NDT, 3x L1",
      crewAr: "1 مشرف L3، 2 فني L2 NDT، 3 فني L1",
      hoursLogged: "128 hrs",
      risk: "high" as const,
      status: "in_progress" as const,
      progress: 65,
    },
    {
      id: "PR-2026-0040",
      titleEn: "SABIC Tower Cladding Repair",
      titleAr: "إصلاح كسوة برج سابك",
      facilityEn: "Riyadh Digital City HQ",
      facilityAr: "مقر مدينة الرياض الرقمية",
      crewEn: "1x L3 Supervisor, 3x L1",
      crewAr: "1 مشرف L3، 3 فني L1",
      hoursLogged: "94 hrs",
      risk: "medium" as const,
      status: "in_progress" as const,
      progress: 40,
    },
    {
      id: "PR-2026-0038",
      titleEn: "Offshore Rig Flare Tip Replacement",
      titleAr: "استبدال طرف الشعلة بالمنصة البحرية",
      facilityEn: "Safaniya Field (Offshore)",
      facilityAr: "حقل صفانية (بحري)",
      crewEn: "AI Crew Recommendation Ready",
      crewAr: "توصية الفريق بالذكاء الاصطناعي جاهزة",
      hoursLogged: "0 hrs",
      risk: "critical" as const,
      status: "quoted" as const,
      progress: 10,
    },
  ]

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
          value="3 Sites"
          subtitle={t('techniciansDeployed')}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: t('onSchedule'), variant: "success" }}
        />
        <MetricCard
          title={t('totalRopeHours')}
          value="1,420 hrs"
          subtitle={t('zeroIncident')}
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: "100%", isPositive: true, label: t('irataVerified') }}
        />
        <MetricCard
          title={t('pendingQuotes')}
          value="1"
          subtitle={t('aiAssessmentReady')}
          icon={Sparkles}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: t('actionRequired'), variant: "orange" }}
        />
        <MetricCard
          title={t('completedJobs')}
          value="19"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between hover:border-navy-300">
              <CardHeader className="pb-3">
                <div className={`flex items-center justify-between gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">
                    {project.id}
                  </span>
                  <JobStatusBadge status={project.status} />
                </div>
                <CardTitle className="text-base font-bold text-navy-950">
                  {isRTL ? project.titleAr : project.titleEn}
                </CardTitle>
                <CardDescription className={`flex items-center gap-1 text-xs text-navy-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="h-3 w-3 text-navy-400 shrink-0" />
                  {isRTL ? project.facilityAr : project.facilityEn}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="p-3 rounded-xl bg-navy-50/70 border border-navy-100/80 space-y-1.5 text-xs">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-navy-400 font-medium">{t('crew')}:</span>
                    <span className="text-navy-900 font-bold">{isRTL ? project.crewAr : project.crewEn}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-navy-400 font-medium">{t('ropeHours')}:</span>
                    <span className="text-navy-900 font-bold">{project.hoursLogged}</span>
                  </div>
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-navy-400 font-medium">{t('riskLevel')}:</span>
                    <RiskLevelBadge level={project.risk} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className={`flex justify-between text-[10px] font-bold text-navy-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('projectProgress')}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
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
      </div>
    </div>
  )
}
