'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobStatusBadge, RiskLevelBadge } from '@/components/ui/status-badge'
import { getJobs, type JobWithOrganization } from '@/lib/services/jobs'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export default function ClientProjectsPage() {
  const [jobs, setJobs] = useState<JobWithOrganization[]>([])

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="My Projects & Operations"
        description="Monitor active rope access job requests, verify assigned certified crews, and review safety compliance documentation."
      >
        <Link href="/client/new-request">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Request New Crew
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col justify-between hover:border-navy-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-[10px] font-bold text-navy-400">
                  {job.request_number}
                </span>
                <JobStatusBadge status={job.status} />
              </div>
              <CardTitle className="text-base font-bold text-navy-950">
                {job.project_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs text-navy-500">
                <MapPin className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                {job.work_location}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-4 text-xs">
              <p className="text-navy-600 line-clamp-2 leading-relaxed">
                {job.project_description}
              </p>

              <div className="p-3 rounded-xl bg-navy-50 border border-navy-100 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-navy-400">Roster Required:</span>
                  <span className="text-navy-900 font-bold">
                    {job.required_level_3}x L3, {job.required_level_2}x L2, {job.required_level_1}x L1
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Estimated Duration:</span>
                  <span className="text-navy-900 font-bold">{job.estimated_duration_days} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-navy-400">Site Risk:</span>
                  <RiskLevelBadge level={job.risk_level || 'medium'} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-navy-400">Quote Value</span>
                <span className="font-black text-navy-950 text-sm">{formatCurrency(job.final_quote_sar)}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t border-navy-50 mt-auto p-4 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                IRATA ICOP
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold h-7"
                onClick={() => alert(`Showing details for ${job.project_name}`)}
              >
                View Scope
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
