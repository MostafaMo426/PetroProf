import type { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobStatusBadge, RiskLevelBadge } from "@/components/ui/status-badge"
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
  Calendar,
  Layers,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Manage Rope Access Projects and Request Certified Manpower",
}

export default async function ClientDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header with Primary Call to Action */}
      <PageHeader
        title="Client Operations Center"
        description="Submit project scopes for AI safety assessment, review instant manpower quotes, and track certified rope access teams deployed on your sites."
      >
        <Link href="/client/calculator">
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4 text-orange-500" />
            Dynamic Estimator
          </Button>
        </Link>
        <Link href="/client/new-request">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Request Manpower Crew
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Projects"
          value="3 Sites"
          subtitle="14 Technicians deployed"
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          badge={{ text: "On-Schedule", variant: "success" }}
        />
        <MetricCard
          title="Total Rope Hours"
          value="1,420 hrs"
          subtitle="Zero incident safety record"
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: "100%", isPositive: true, label: "IRATA verified" }}
        />
        <MetricCard
          title="Pending Quotes"
          value="1 Pending"
          subtitle="AI Safety Assessment ready"
          icon={Sparkles}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
          badge={{ text: "Action Req", variant: "orange" }}
        />
        <MetricCard
          title="Completed Jobs"
          value="19 Projects"
          subtitle="100% Client Satisfaction"
          icon={CheckCircle2}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* AI Risk Assessment Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Google Gemini 1.5 Flash
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Instant AI Scope Analysis & Safety Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-navy-200 leading-relaxed">
              Paste your raw job specifications (e.g. height, wind exposure, confined spaces), and our AI automatically formulates the required IRATA crew composition, equipment checklist, and hazard mitigation plan.
            </p>
          </div>
          <Link href="/client/new-request" className="shrink-0">
            <Button variant="primary" size="lg" className="gap-2 font-bold shadow-lg">
              Launch AI Request Wizard
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Projects Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Active Projects & Status</h2>
            <p className="text-xs text-navy-500">Live operational status on your designated facilities</p>
          </div>
          <Link href="/client/projects">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-navy-600">
              All projects <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: "PR-2026-0041",
              title: "Flare Stack Inspection #3",
              facility: "Ras Tanura Refinery",
              crew: "1x L3 Supervisor, 2x L2 NDT, 3x L1",
              hoursLogged: "128 hrs",
              risk: "high" as const,
              status: "in_progress" as const,
              progress: 65,
            },
            {
              id: "PR-2026-0040",
              title: "SABIC Tower Cladding Repair",
              facility: "Riyadh Digital City HQ",
              crew: "1x L3 Supervisor, 3x L1",
              hoursLogged: "94 hrs",
              risk: "medium" as const,
              status: "in_progress" as const,
              progress: 40,
            },
            {
              id: "PR-2026-0038",
              title: "Offshore Rig Flare Tip Replacement",
              facility: "Safaniya Field (Offshore)",
              crew: "AI Crew Recommendation Ready",
              hoursLogged: "0 hrs (Quoted)",
              risk: "critical" as const,
              status: "quoted" as const,
              progress: 10,
            },
          ].map((project) => (
            <Card key={project.id} className="flex flex-col justify-between hover:border-navy-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">
                    {project.id}
                  </span>
                  <JobStatusBadge status={project.status} />
                </div>
                <CardTitle className="text-base font-bold text-navy-950">
                  {project.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs text-navy-500">
                  <MapPin className="h-3 w-3 text-navy-400 shrink-0" />
                  {project.facility}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="p-3 rounded-xl bg-navy-50/70 border border-navy-100/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-navy-400 font-medium">Crew:</span>
                    <span className="text-navy-900 font-bold">{project.crew}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400 font-medium">Rope Hours:</span>
                    <span className="text-navy-900 font-bold">{project.hoursLogged}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-navy-400 font-medium">Risk Level:</span>
                    <RiskLevelBadge level={project.risk} />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-navy-500">
                    <span>Project Progress</span>
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
              <CardFooter className="pt-0 border-t border-navy-50 mt-auto p-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  IRATA Verified
                </span>
                <Link href={`/client/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="text-xs font-bold h-7">
                    View Details
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
