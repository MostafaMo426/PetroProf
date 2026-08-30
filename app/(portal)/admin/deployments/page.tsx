'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobStatusBadge, RiskLevelBadge, IrataBadge } from '@/components/ui/status-badge'
import { getJobs, type JobWithOrganization } from '@/lib/services/jobs'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Layers,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDeploymentsPage() {
  const [jobs, setJobs] = useState<JobWithOrganization[]>([])

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  const activeDeployments = jobs.filter((j) => j.status === 'in_progress')
  const assignedDeployments = jobs.filter((j) => j.status === 'crew_assigned')
  const quotedDeployments = jobs.filter((j) => j.status === 'quoted')

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Live Deployment Board"
        description="Real-time site visibility across active rope access crews, assigned supervisor leads, and site safety parameters."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeDeployments.length} Active Sites
          </span>
        }
      >
        <Link href="/admin/jobs">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Deploy New Crew
          </Button>
        </Link>
      </PageHeader>

      {/* Kanban / Deployment Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Active Deployments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="font-bold text-navy-950 text-sm">Active On-Rope</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-black">
              {activeDeployments.length}
            </span>
          </div>

          <div className="space-y-4">
            {activeDeployments.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-blue-600 hover:shadow-card-hover transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy-400 font-mono">
                      {job.request_number}
                    </span>
                    <RiskLevelBadge level={job.risk_level || 'medium'} />
                  </div>
                  <CardTitle className="text-sm font-bold text-navy-950 mt-1">
                    {job.project_name}
                  </CardTitle>
                  <p className="text-xs text-orange-600 font-semibold">{job.organization_name}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 text-navy-600">
                    <MapPin className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                    <span className="truncate">{job.work_location}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-navy-50 border border-navy-100 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-navy-400">Roster:</span>
                      <span className="text-navy-900 font-bold">{job.assigned_crew_count} Technicians</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-navy-400">Duration:</span>
                      <span className="text-navy-900 font-bold">{job.estimated_duration_days} Days</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-navy-500 pt-1 border-t border-navy-50">
                    <span>Started: {formatDate(job.start_date)}</span>
                    <span className="font-bold text-navy-900">{formatCurrency(job.final_quote_sar)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Assigned & Mobilizing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-100">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              <h3 className="font-bold text-navy-950 text-sm">Crew Assigned</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-black">
              {assignedDeployments.length}
            </span>
          </div>

          <div className="space-y-4">
            {assignedDeployments.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-navy-100 rounded-2xl text-center text-xs text-navy-400">
                No crews currently in mobilization staging.
              </div>
            ) : (
              assignedDeployments.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-teal-600">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-navy-400 font-mono">
                        {job.request_number}
                      </span>
                      <RiskLevelBadge level={job.risk_level || 'high'} />
                    </div>
                    <CardTitle className="text-sm font-bold text-navy-950 mt-1">
                      {job.project_name}
                    </CardTitle>
                    <p className="text-xs text-navy-500 font-semibold">{job.organization_name}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-xs space-y-2">
                    <p className="text-navy-600">{job.work_location}</p>
                    <div className="flex justify-between items-center bg-navy-50 p-2 rounded-lg text-navy-700 font-medium">
                      <span>Mobilization Date</span>
                      <span className="font-bold">{formatDate(job.start_date)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Quoted & Awaiting Authorization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 border border-orange-100">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <h3 className="font-bold text-navy-950 text-sm">Quoted / Pending</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-xs font-black">
              {quotedDeployments.length}
            </span>
          </div>

          <div className="space-y-4">
            {quotedDeployments.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-orange-500 hover:shadow-card-hover transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy-400 font-mono">
                      {job.request_number}
                    </span>
                    <RiskLevelBadge level={job.risk_level || 'critical'} />
                  </div>
                  <CardTitle className="text-sm font-bold text-navy-950 mt-1">
                    {job.project_name}
                  </CardTitle>
                  <p className="text-xs text-orange-600 font-semibold">{job.organization_name}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-2.5">
                  <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200/80 space-y-1">
                    <div className="flex justify-between text-navy-900 font-bold">
                      <span>Quoted Value:</span>
                      <span>{formatCurrency(job.final_quote_sar)}</span>
                    </div>
                    <p className="text-[11px] text-navy-500">
                      Req: {job.required_level_3}x L3, {job.required_level_2}x L2, {job.required_level_1}x L1
                    </p>
                  </div>
                  <Link href="/admin/jobs" className="block pt-1">
                    <Button variant="primary" size="sm" className="w-full text-xs font-bold shadow-xs">
                      Review & Approve Quote
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
