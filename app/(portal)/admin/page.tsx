import type { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IrataBadge, TechnicianStatusBadge, JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
import {
  Users,
  Briefcase,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin Command Center",
  description: "PetroProf Operations & Dispatch Command Center",
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Actions */}
      <PageHeader
        title="Operations Command Center"
        description="Real-time monitoring of rope access deployments, active manpower rosters, and IRATA compliance alerts across the Kingdom."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Dispatch
          </span>
        }
      >
        <Link href="/admin/quoting">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            AI Quoting Engine
          </Button>
        </Link>
        <Link href="/admin/technicians">
          <Button variant="primary" className="gap-2">
            <Users className="h-4 w-4" />
            Dispatch Crew
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Deployments"
          value="18 Crews"
          subtitle="74 Technicians on-rope"
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={{ value: "+12%", isPositive: true, label: "vs last month" }}
        />
        <MetricCard
          title="Available Roster"
          value="42 Techs"
          subtitle="12 L3 Supervisors ready"
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          badge={{ text: "94% Ready", variant: "success" }}
        />
        <MetricCard
          title="Pending Requests"
          value="7 Jobs"
          subtitle="SAR 340,000 estimated quote"
          icon={Clock}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          trend={{ value: "3 Urgent", isPositive: false, label: "requiring review" }}
        />
        <MetricCard
          title="Compliance Alerts"
          value="4 Expiries"
          subtitle="Within next 30 days"
          icon={ShieldAlert}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          badge={{ text: "Action Req", variant: "warning" }}
        />
      </div>

      {/* Main Grid: Live Deployments & Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Deployments Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-black text-navy-950">
                Active Job Deployments
              </CardTitle>
              <CardDescription>
                Live industrial & offshore sites currently executing rope access operations
              </CardDescription>
            </div>
            <Link href="/admin/jobs">
              <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold text-navy-600">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Job / Client</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Crew Profile</th>
                    <th className="py-3 px-4">Safety Risk</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {[
                    {
                      id: "PR-2026-0041",
                      title: "Flare Stack Inspection #3",
                      client: "Saudi Aramco",
                      location: "Ras Tanura Refinery",
                      crew: "1x L3, 2x L2, 3x L1",
                      risk: "high" as const,
                      status: "in_progress" as const,
                    },
                    {
                      id: "PR-2026-0040",
                      title: "SABIC Tower Cladding Repair",
                      client: "SABIC HQ",
                      location: "Riyadh Digital City",
                      crew: "1x L3, 3x L1",
                      risk: "medium" as const,
                      status: "in_progress" as const,
                    },
                    {
                      id: "PR-2026-0039",
                      title: "Storage Tank NDT Inspection",
                      client: "Petro Rabigh",
                      location: "Rabigh Complex",
                      crew: "1x L3, 2x L2 (NDT)",
                      risk: "high" as const,
                      status: "crew_assigned" as const,
                    },
                    {
                      id: "PR-2026-0038",
                      title: "Offshore Rig Flare Tip Maintenance",
                      client: "ADES Arabia",
                      location: "Safaniya Field (Offshore)",
                      crew: "2x L3, 4x L2, 4x L1",
                      risk: "critical" as const,
                      status: "quoted" as const,
                    },
                  ].map((job) => (
                    <tr key={job.id} className="hover:bg-navy-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950">{job.title}</p>
                        <p className="text-[11px] text-navy-400">{job.client} • {job.id}</p>
                      </td>
                      <td className="py-3.5 px-4 text-navy-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                          {job.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-navy-700 font-semibold">
                        {job.crew}
                      </td>
                      <td className="py-3.5 px-4">
                        <RiskLevelBadge level={job.risk} />
                      </td>
                      <td className="py-3.5 px-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* IRATA Compliance Countdown Card (1 col) */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black text-navy-950 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Compliance Tracker
              </CardTitle>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                4 Critical
              </span>
            </div>
            <CardDescription>
              Certificates requiring renewal or audit verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 flex-1">
            {[
              {
                name: "Tariq Al-Ghamdi",
                cert: "IRATA Level 3 Recert",
                days: 12,
                level: "level_3" as const,
                urgent: true,
              },
              {
                name: "Hassan Al-Zahrani",
                cert: "Medical Fitness Cert",
                days: 18,
                level: "level_2" as const,
                urgent: true,
              },
              {
                name: "Omar Farooq",
                cert: "H2S Gas Safety Awareness",
                days: 27,
                level: "level_1" as const,
                urgent: false,
              },
              {
                name: "Fahad Al-Shehri",
                cert: "Confined Space Entry",
                days: 34,
                level: "level_2" as const,
                urgent: false,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-navy-50/60 border border-navy-100 flex items-center justify-between gap-3 hover:bg-navy-50 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-navy-950 truncate">
                      {item.name}
                    </p>
                    <IrataBadge level={item.level} short />
                  </div>
                  <p className="text-[11px] text-navy-500 truncate">{item.cert}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black ${
                      item.days <= 14
                        ? "bg-red-500 text-white"
                        : item.days <= 30
                        ? "bg-orange-500 text-white"
                        : "bg-amber-400 text-navy-950"
                    }`}
                  >
                    {item.days}d left
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-navy-100 bg-navy-50/30">
            <Link href="/admin/compliance" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold text-navy-700">
                View Full Compliance Audit Board
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
