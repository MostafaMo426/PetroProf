import type { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge, TechnicianStatusBadge } from "@/components/ui/status-badge"
import {
  Clock,
  Award,
  BookOpen,
  QrCode,
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ArrowUpRight,
  Plus,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Technician Hub",
  description: "IRATA Digital Logbook & Credentials Management",
}

export default async function TechnicianDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Technician Hub & Digital Logbook"
        description="Log your daily rope hours, present digital QR verification tokens to site supervisors, and monitor IRATA renewal milestones."
        badge={<IrataBadge level="level_2" />}
      >
        <Link href="/technician/qr-verify">
          <Button variant="outline" className="gap-2">
            <QrCode className="h-4 w-4 text-navy-700" />
            Show QR Token
          </Button>
        </Link>
        <Link href="/technician/logbook">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Log Work Hours
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Rope Hours"
          value="1,248 hrs"
          subtitle="252 hrs to IRATA Level 3"
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: "83% to L3", variant: "orange" }}
        />
        <MetricCard
          title="Availability Status"
          value="Available"
          subtitle="Ready for deployment"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: "Fatigue: 0.8", variant: "success" }}
        />
        <MetricCard
          title="IRATA Level 2 Cert"
          value="142 Days"
          subtitle="Valid until Dec 2026"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: "Verified", variant: "default" }}
        />
        <MetricCard
          title="Pending QR Sign-offs"
          value="1 Entry"
          subtitle="8.5 hrs at Ras Tanura"
          icon={QrCode}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{ text: "Awaiting L3", variant: "warning" }}
        />
      </div>

      {/* Main Grid: Recent Logbook & Certification Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Logbook Entries (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-black text-navy-950">
                Recent Digital Logbook Entries
              </CardTitle>
              <CardDescription>
                Verified rope access hours recorded on project sites
              </CardDescription>
            </div>
            <Link href="/technician/logbook">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-navy-600">
                Full Logbook <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date / Site</th>
                    <th className="py-3 px-4">Work Scope</th>
                    <th className="py-3 px-4">Hours</th>
                    <th className="py-3 px-4">L3 Supervisor</th>
                    <th className="py-3 px-4">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {[
                    {
                      date: "Aug 29, 2026",
                      site: "Ras Tanura Flare Stack #3",
                      scope: "NDT Ultrasonic Thickness Testing on riser welds",
                      hours: "8.5 hrs",
                      supervisor: "Tariq Al-Ghamdi (L3)",
                      status: "pending",
                    },
                    {
                      date: "Aug 28, 2026",
                      site: "Ras Tanura Flare Stack #3",
                      scope: "Rigging dual line system & anchor bolt inspection",
                      hours: "7.0 hrs",
                      supervisor: "Tariq Al-Ghamdi (L3)",
                      status: "verified",
                    },
                    {
                      date: "Aug 24, 2026",
                      site: "SABIC Digital City HQ",
                      scope: "Glazing sealant renewal & structural bracket torque check",
                      hours: "9.0 hrs",
                      supervisor: "Mansour Al-Harbi (L3)",
                      status: "verified",
                    },
                  ].map((entry, idx) => (
                    <tr key={idx} className="hover:bg-navy-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950">{entry.site}</p>
                        <p className="text-[11px] text-navy-400">{entry.date}</p>
                      </td>
                      <td className="py-3.5 px-4 text-navy-600 max-w-xs truncate">
                        {entry.scope}
                      </td>
                      <td className="py-3.5 px-4 font-black text-navy-950">
                        {entry.hours}
                      </td>
                      <td className="py-3.5 px-4 text-navy-700">
                        {entry.supervisor}
                      </td>
                      <td className="py-3.5 px-4">
                        {entry.status === "verified" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            QR Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="h-3 w-3" />
                            Pending Sign-off
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

        {/* Credentials & IRATA Progression (1 col) */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-black text-navy-950">
              Credentials & IRATA Progress
            </CardTitle>
            <CardDescription>
              Progression roadmap towards Level 3 Supervisor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {/* Level 3 Progression Meter */}
            <div className="p-4 rounded-xl bg-navy-gradient text-white space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-navy-300 font-semibold">IRATA Level 3 Prerequisite</span>
                <span className="font-bold text-orange-400">1,248 / 1,500 hrs</span>
              </div>
              <div className="h-2 w-full rounded-full bg-navy-800 overflow-hidden">
                <div className="h-full rounded-full bg-orange-gradient" style={{ width: "83.2%" }} />
              </div>
              <p className="text-[10px] text-navy-300">
                You need 252 more verified rope hours + 6 months in Level 2 before applying for IRATA Level 3 assessment.
              </p>
            </div>

            {/* Certs List */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                Active Documents
              </p>
              {[
                { name: "IRATA Level 2 Certificate", body: "IRATA Int.", exp: "Dec 2026", valid: true },
                { name: "Offshore Medical Fitness", body: "Aramco Approved", exp: "Apr 2027", valid: true },
                { name: "H2S Awareness & Escape", body: "Saudi Civil Defense", exp: "Nov 2026", valid: true },
              ].map((cert, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-navy-50/70 border border-navy-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-navy-950">{cert.name}</p>
                    <p className="text-[10px] text-navy-400">{cert.body} • Exp: {cert.exp}</p>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t border-navy-100 bg-navy-50/30">
            <Link href="/technician/certificates" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold text-navy-700">
                Upload New Document (AI OCR)
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
