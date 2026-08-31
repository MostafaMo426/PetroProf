'use client'

import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge, TechnicianStatusBadge, JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
import {
  Users,
  Briefcase,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowUpRight,
  MapPin,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { t, isRTL } = useLanguage()

  const deployments = [
    {
      id: "PR-2026-0041",
      titleEn: "Flare Stack Inspection #3",
      titleAr: "فحص برج الشعلة #3",
      clientEn: "Saudi Aramco",
      clientAr: "أرامكو السعودية",
      locationEn: "Ras Tanura Refinery",
      locationAr: "مصفاة رأس تنورة",
      crew: "1x L3, 2x L2, 3x L1",
      risk: "high" as const,
      status: "in_progress" as const,
    },
    {
      id: "PR-2026-0040",
      titleEn: "SABIC Tower Cladding Repair",
      titleAr: "إصلاح كسوة برج سابك",
      clientEn: "SABIC HQ",
      clientAr: "سابك",
      locationEn: "Riyadh Digital City",
      locationAr: "مدينة الرياض الرقمية",
      crew: "1x L3, 3x L1",
      risk: "medium" as const,
      status: "in_progress" as const,
    },
    {
      id: "PR-2026-0039",
      titleEn: "Storage Tank NDT Inspection",
      titleAr: "فحص خزان التخزين بالـ NDT",
      clientEn: "Petro Rabigh",
      clientAr: "بترو رابغ",
      locationEn: "Rabigh Complex",
      locationAr: "مجمع رابغ",
      crew: "1x L3, 2x L2 (NDT)",
      risk: "high" as const,
      status: "crew_assigned" as const,
    },
    {
      id: "PR-2026-0038",
      titleEn: "Offshore Rig Flare Tip Maintenance",
      titleAr: "صيانة طرف الشعلة بالمنصة البحرية",
      clientEn: "ADES Arabia",
      clientAr: "أديس العربية",
      locationEn: "Safaniya Field (Offshore)",
      locationAr: "حقل صفانية (بحري)",
      crew: "2x L3, 4x L2, 4x L1",
      risk: "critical" as const,
      status: "quoted" as const,
    },
  ]

  const complianceItems = [
    { nameEn: "Tariq Al-Ghamdi", nameAr: "طارق الغامدي", certEn: "IRATA Level 3 Recert", certAr: "تجديد IRATA المستوى 3", days: 12, level: "level_3" as const },
    { nameEn: "Hassan Al-Zahrani", nameAr: "حسن الزهراني", certEn: "Medical Fitness Cert", certAr: "شهادة اللياقة الطبية", days: 18, level: "level_2" as const },
    { nameEn: "Omar Farooq", nameAr: "عمر فاروق", certEn: "H2S Gas Safety Awareness", certAr: "السلامة من غاز H2S", days: 27, level: "level_1" as const },
    { nameEn: "Fahad Al-Shehri", nameAr: "فهد الشهري", certEn: "Confined Space Entry", certAr: "الدخول للأماكن المحصورة", days: 34, level: "level_2" as const },
  ]

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

      {/* KPI Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('activeDeployments')}
          value="18 Crews"
          subtitle={t('techniciansOnRope')}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={{ value: "+12%", isPositive: true, label: t('vsLastMonth') }}
        />
        <MetricCard
          title={t('availableRoster')}
          value="42 Techs"
          subtitle={t('supervisorsReady')}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: t('readyPercent'), variant: "success" }}
        />
        <MetricCard
          title={t('pendingRequests')}
          value="7 Jobs"
          subtitle={t('estimatedQuote')}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          trend={{ value: t('urgentJobs'), isPositive: false, label: t('requiringReview') }}
        />
        <MetricCard
          title={t('complianceAlerts')}
          value={t('expiryCount')}
          subtitle={t('withinDays')}
          icon={ShieldAlert}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badge={{ text: t('actionRequired'), variant: "warning" }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Deployments Table */}
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
            <div className="overflow-x-auto">
              <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{t('jobClient')}</th>
                    <th className="py-3 px-4">{t('location')}</th>
                    <th className="py-3 px-4">{t('crewProfile')}</th>
                    <th className="py-3 px-4">{t('safetyRisk')}</th>
                    <th className="py-3 px-4">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {deployments.map((job) => (
                    <tr key={job.id} className="hover:bg-navy-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950">{isRTL ? job.titleAr : job.titleEn}</p>
                        <p className="text-[11px] text-navy-400">{isRTL ? job.clientAr : job.clientEn} • {job.id}</p>
                      </td>
                      <td className="py-3.5 px-4 text-navy-600">
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                          {isRTL ? job.locationAr : job.locationEn}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-navy-700 font-semibold">{job.crew}</td>
                      <td className="py-3.5 px-4"><RiskLevelBadge level={job.risk} /></td>
                      <td className="py-3.5 px-4"><JobStatusBadge status={job.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className={`flex items-center justify-between`}>
              <CardTitle className={`text-base font-black text-navy-950 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {t('complianceTracker')}
              </CardTitle>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                4 {t('critical')}
              </span>
            </div>
            <CardDescription>{t('complianceTrackerDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 flex-1">
            {complianceItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-navy-50/60 border border-navy-100 flex items-center justify-between gap-3 hover:bg-navy-50 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {isRTL ? item.nameAr : item.nameEn}
                    </p>
                    <IrataBadge level={item.level} short />
                  </div>
                  <p className="text-[11px] text-navy-500 truncate">
                    {isRTL ? item.certAr : item.certEn}
                  </p>
                </div>
                <div className={`${isRTL ? 'text-left' : 'text-right'} shrink-0`}>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${
                    item.days <= 14 ? "bg-red-500 text-white" : item.days <= 30 ? "bg-orange-500 text-white" : "bg-amber-400 text-navy-950"
                  }`}>
                    {item.days}{t('daysLeft')}
                  </span>
                </div>
              </div>
            ))}
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
