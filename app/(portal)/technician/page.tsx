'use client'

import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge } from "@/components/ui/status-badge"
import { useLanguage } from "@/lib/i18n/context"
import {
  Clock,
  Award,
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function TechnicianDashboardPage() {
  const { t, isRTL } = useLanguage()

  const logbookEntries = [
    {
      dateEn: "Aug 29, 2026",
      dateAr: "29 أغسطس 2026",
      siteEn: "Ras Tanura Flare Stack #3",
      siteAr: "برج الشعلة #3 - رأس تنورة",
      scopeEn: "NDT Ultrasonic Thickness Testing on riser welds",
      scopeAr: "فحص سماكة اللحامات بالموجات فوق الصوتية NDT",
      hours: "8.5 hrs",
      supervisorEn: "Tariq Al-Ghamdi (L3)",
      supervisorAr: "طارق الغامدي (L3)",
      status: "pending",
    },
    {
      dateEn: "Aug 28, 2026",
      dateAr: "28 أغسطس 2026",
      siteEn: "Ras Tanura Flare Stack #3",
      siteAr: "برج الشعلة #3 - رأس تنورة",
      scopeEn: "Rigging dual line system & anchor bolt inspection",
      scopeAr: "تركيب نظام الحبال المزدوج وفحص مراسي التثبيت",
      hours: "7.0 hrs",
      supervisorEn: "Tariq Al-Ghamdi (L3)",
      supervisorAr: "طارق الغامدي (L3)",
      status: "verified",
    },
    {
      dateEn: "Aug 24, 2026",
      dateAr: "24 أغسطس 2026",
      siteEn: "SABIC Digital City HQ",
      siteAr: "مقر سابك - المدينة الرقمية",
      scopeEn: "Glazing sealant renewal & structural bracket torque check",
      scopeAr: "تجديد مواد العزل الزجاجي وفحص عزم ربط الأقواس",
      hours: "9.0 hrs",
      supervisorEn: "Mansour Al-Harbi (L3)",
      supervisorAr: "منصور الحربي (L3)",
      status: "verified",
    },
  ]

  const certDocs = [
    {
      nameEn: "IRATA Level 2 Certificate",
      nameAr: "شهادة IRATA المستوى 2",
      bodyEn: "IRATA Int.",
      bodyAr: "IRATA الدولي",
      expEn: "Dec 2026",
      expAr: "ديسمبر 2026",
    },
    {
      nameEn: "Offshore Medical Fitness",
      nameAr: "شهادة اللياقة الطبية البحرية",
      bodyEn: "Aramco Approved",
      bodyAr: "معتمد أرامكو",
      expEn: "Apr 2027",
      expAr: "أبريل 2027",
    },
    {
      nameEn: "H2S Awareness & Escape",
      nameAr: "السلامة من غاز H2S والإخلاء",
      bodyEn: "Saudi Civil Defense",
      bodyAr: "الدفاع المدني السعودي",
      expEn: "Nov 2026",
      expAr: "نوفمبر 2026",
    },
  ]

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
          value="1,248 hrs"
          subtitle={t('hoursToLevel3')}
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: "83% to L3", variant: "orange" }}
        />
        <MetricCard
          title={t('availabilityStatus')}
          value={t('available')}
          subtitle={t('readyForDeployment')}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: `${t('fatigueScore')}: 0.8`, variant: "success" }}
        />
        <MetricCard
          title={t('irataCert')}
          value="142 Days"
          subtitle={t('validUntil')}
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: t('verified'), variant: "default" }}
        />
        <MetricCard
          title={t('pendingQrSignoffs')}
          value="1"
          subtitle={t('pendingQrDesc')}
          icon={QrCode}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{ text: t('awaitingL3'), variant: "warning" }}
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
            <div className="overflow-x-auto">
              <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{t('dateSite')}</th>
                    <th className="py-3 px-4">{t('workScope')}</th>
                    <th className="py-3 px-4">{t('hours')}</th>
                    <th className="py-3 px-4">{t('supervisor')}</th>
                    <th className="py-3 px-4">{t('verification')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {logbookEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-navy-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950">{isRTL ? entry.siteAr : entry.siteEn}</p>
                        <p className="text-[11px] text-navy-400">{isRTL ? entry.dateAr : entry.dateEn}</p>
                      </td>
                      <td className="py-3.5 px-4 text-navy-600 max-w-xs truncate">
                        {isRTL ? entry.scopeAr : entry.scopeEn}
                      </td>
                      <td className="py-3.5 px-4 font-black text-navy-950">{entry.hours}</td>
                      <td className="py-3.5 px-4 text-navy-700">
                        {isRTL ? entry.supervisorAr : entry.supervisorEn}
                      </td>
                      <td className="py-3.5 px-4">
                        {entry.status === "verified" ? (
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
                <span className="font-bold text-orange-400">1,248 / 1,500 hrs</span>
              </div>
              <div className="h-2 w-full rounded-full bg-navy-800 overflow-hidden">
                <div className="h-full rounded-full bg-orange-gradient" style={{ width: "83.2%" }} />
              </div>
              <p className="text-[10px] text-navy-300">{t('level3RequirementDesc')}</p>
            </div>

            {/* Certs List */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-400">{t('activeDocuments')}</p>
              {certDocs.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-navy-50/70 border border-navy-100 flex items-center justify-between text-xs"
                >
                  <div className={`space-y-0.5 ${isRTL ? 'text-right' : ''}`}>
                    <p className="font-bold text-navy-950">{isRTL ? cert.nameAr : cert.nameEn}</p>
                    <p className="text-[10px] text-navy-400">
                      {isRTL ? cert.bodyAr : cert.bodyEn} • {t('exp')}: {isRTL ? cert.expAr : cert.expEn}
                    </p>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
              ))}
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
