'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobStatusBadge, RiskLevelBadge } from '@/components/ui/status-badge'
import { getJobs, type JobWithOrganization } from '@/lib/services/jobs'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  X,
  FileCheck,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobWithOrganization[]>([])
  const [selectedJob, setSelectedJob] = useState<JobWithOrganization | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  const handleApproveQuote = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'approved' as const } : j))
    )
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: 'approved' as const } : null))
    }
    toast.success('Quote approved & client notification dispatched.')
  }

  const handleAssignCrew = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'crew_assigned' as const } : j))
    )
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: 'crew_assigned' as const } : null))
    }
    toast.success('Crew roster confirmed and mobilization scheduled.')
  }

  const filteredJobs = jobs.filter((j) =>
    statusFilter === 'all' ? true : j.status === statusFilter
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Job Requests & Quote Authorizations"
        description="Review inbound client manpower requests, inspect AI risk ratings, adjust quote figures, and dispatch qualified rope access teams."
      >
        <Button variant="outline" className="gap-2 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-orange-500" />
          Batch AI Risk Review
        </Button>
      </PageHeader>

      {/* Filter bar */}
      <div className="flex gap-2 bg-white p-2.5 rounded-2xl border border-navy-100 overflow-x-auto">
        {['all', 'submitted', 'ai_assessed', 'quoted', 'approved', 'in_progress', 'completed'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 uppercase tracking-wider ${
                statusFilter === st
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/75 border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Request / Client</th>
                  <th className="py-3 px-4">Project Scope</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Crew Required</th>
                  <th className="py-3 px-4">Quote (SAR)</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 font-medium">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-navy-950">{job.request_number}</p>
                      <p className="text-[11px] text-orange-600 font-semibold">{job.organization_name}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-navy-950 truncate">{job.project_name}</p>
                      <p className="text-[11px] text-navy-400 line-clamp-1">{job.project_description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-navy-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-navy-400 shrink-0" />
                        {job.work_city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-navy-800 font-semibold">
                      {job.required_level_3}x L3, {job.required_level_2}x L2, {job.required_level_1}x L1
                    </td>
                    <td className="py-3.5 px-4 font-black text-navy-950">
                      {formatCurrency(job.final_quote_sar)}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskLevelBadge level={job.risk_level || 'medium'} />
                    </td>
                    <td className="py-3.5 px-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                        className="text-xs h-7 px-2.5 font-bold"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inspect / Approval Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-navy-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-navy-400">
                  {selectedJob.request_number}
                </span>
                <RiskLevelBadge level={selectedJob.risk_level || 'high'} />
                <JobStatusBadge status={selectedJob.status} />
              </div>
              <h2 className="text-xl font-black text-navy-950">
                {selectedJob.project_name}
              </h2>
              <p className="text-xs text-orange-600 font-bold">
                Client: {selectedJob.organization_name} • Contact: {selectedJob.client_contact_name}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-50 border border-navy-100 text-xs space-y-2">
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[10px]">
                Project Scope & Specifications
              </h4>
              <p className="text-navy-700 leading-relaxed">
                {selectedJob.project_description}
              </p>
              <div className="flex gap-4 pt-2 border-t border-navy-100 text-navy-600">
                <span>📍 <strong>Location:</strong> {selectedJob.work_location}</span>
                <span>⏱️ <strong>Duration:</strong> {selectedJob.estimated_duration_days} Days</span>
              </div>
            </div>

            {/* Crew Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="text-xs font-bold text-purple-900 block">Level 3 (Supervisor)</span>
                <span className="text-lg font-black text-purple-950">{selectedJob.required_level_3} Required</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-xs font-bold text-blue-900 block">Level 2 (Lead)</span>
                <span className="text-lg font-black text-blue-950">{selectedJob.required_level_2} Required</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs font-bold text-emerald-900 block">Level 1 (Tech)</span>
                <span className="text-lg font-black text-emerald-950">{selectedJob.required_level_1} Required</span>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="flex items-center justify-between p-4 bg-navy-900 text-white rounded-2xl">
              <div>
                <p className="text-xs text-navy-300">Total Calculated Estimate</p>
                <p className="text-2xl font-black text-white">{formatCurrency(selectedJob.final_quote_sar)}</p>
              </div>
              <div className="text-right text-xs text-navy-300">
                <p>Includes 15% VAT & Risk Adjustments</p>
                <p className="text-emerald-400 font-bold">Standard Payment Terms: 30 Days</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {selectedJob.status === 'quoted' && (
                <Button
                  variant="primary"
                  className="flex-1 gap-2 shadow-orange-glow"
                  onClick={() => handleApproveQuote(selectedJob.id)}
                >
                  <FileCheck className="h-4 w-4" />
                  Authorize & Send Final Quote
                </Button>
              )}
              {selectedJob.status === 'approved' && (
                <Button
                  variant="primary"
                  className="flex-1 gap-2 shadow-orange-glow"
                  onClick={() => handleAssignCrew(selectedJob.id)}
                >
                  <UserCheck className="h-4 w-4" />
                  Dispatch Crew Roster
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
