'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge } from '@/components/ui/status-badge'
import { getLogbookEntries, type LogbookEntryView } from '@/lib/services/logbook'
import { formatDate } from '@/lib/utils'
import {
  BookOpen,
  Plus,
  QrCode,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TechnicianLogbookPage() {
  const [entries, setEntries] = useState<LogbookEntryView[]>([])
  const [showNewModal, setShowNewModal] = useState(false)

  // Form states
  const [siteName, setSiteName] = useState('')
  const [clientName, setClientName] = useState('')
  const [workScope, setWorkScope] = useState('')
  const [hours, setHours] = useState(8.0)
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0])
  const [supervisor, setSupervisor] = useState('')

  useEffect(() => {
    getLogbookEntries().then(setEntries)
  }, [])

  const totalVerifiedHours = entries
    .filter((e) => e.verification_status === 'verified')
    .reduce((sum, e) => sum + e.rope_hours, 0)

  const totalPendingHours = entries
    .filter((e) => e.verification_status === 'pending')
    .reduce((sum, e) => sum + e.rope_hours, 0)

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!siteName || !workScope || !supervisor) {
      toast.error('Please fill in all required fields.')
      return
    }

    const newEntry: LogbookEntryView = {
      id: `log-${Date.now()}`,
      technician_id: 'tech-current',
      site_name: siteName,
      site_location: 'Saudi Arabia',
      client_org_name: clientName || 'Client Org',
      work_description: workScope,
      irata_level_used: 'level_2',
      rope_hours: Number(hours),
      work_date: workDate,
      supervisor_name: supervisor,
      verification_status: 'pending',
      qr_token: `qr_token_${Date.now()}`,
      verified_at: null,
      created_at: new Date().toISOString(),
    }

    setEntries([newEntry, ...entries])
    setShowNewModal(false)
    // Reset form
    setSiteName('')
    setWorkScope('')
    setSupervisor('')
    toast.success('Rope hours logged! Present QR token to L3 supervisor for instant sign-off.')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Digital IRATA Logbook"
        description="Record verified rope hours in accordance with IRATA International Code of Practice (ICOP). Present on-site QR tokens for supervisor sign-offs."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            IRATA Verified
          </span>
        }
      >
        <Link href="/technician/qr-verify">
          <Button variant="outline" className="gap-2 text-xs font-bold">
            <QrCode className="h-4 w-4 text-navy-800" />
            Show QR Token
          </Button>
        </Link>
        <Button
          variant="primary"
          onClick={() => setShowNewModal(true)}
          className="gap-2 shadow-orange-glow"
        >
          <Plus className="h-4 w-4" />
          Log Daily Hours
        </Button>
      </PageHeader>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900 text-white shadow-xl space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Verified Rope Hours
          </p>
          <h3 className="text-3xl font-black">{totalVerifiedHours.toLocaleString()} hrs</h3>
          <p className="text-xs text-navy-300">Signed off by Level 3 Supervisors</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Pending QR Sign-Off
          </p>
          <h3 className="text-3xl font-black text-navy-950">{totalPendingHours.toLocaleString()} hrs</h3>
          <p className="text-xs text-navy-400">Awaiting supervisor on-site scan</p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-700">
            Progress to IRATA Level 3
          </p>
          <h3 className="text-3xl font-black text-purple-950">
            {Math.min(1500, totalVerifiedHours)} / 1,500 hrs
          </h3>
          <p className="text-xs text-purple-700">
            {Math.max(0, 1500 - totalVerifiedHours)} hours remaining
          </p>
        </div>
      </div>

      {/* Logbook Entries Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-black text-navy-950">
              Logged Work Shifts
            </CardTitle>
            <CardDescription>
              Official logbook record of industrial access hours
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Official IRATA Logbook PDF Export Generated.')}
            className="text-xs font-bold gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export Logbook
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/75 border-y border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Site / Facility</th>
                  <th className="py-3 px-4">Client Org</th>
                  <th className="py-3 px-4">Scope & Rigging Details</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">L3 Supervisor</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 font-medium">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {formatDate(entry.work_date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy-950">
                      {entry.site_name}
                    </td>
                    <td className="py-3.5 px-4 text-orange-600 font-semibold">
                      {entry.client_org_name}
                    </td>
                    <td className="py-3.5 px-4 text-navy-600 max-w-sm">
                      {entry.work_description}
                    </td>
                    <td className="py-3.5 px-4">
                      <IrataBadge level={entry.irata_level_used} short />
                    </td>
                    <td className="py-3.5 px-4 font-black text-navy-950 text-sm">
                      {entry.rope_hours} hrs
                    </td>
                    <td className="py-3.5 px-4 text-navy-700">
                      {entry.supervisor_name}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {entry.verification_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <Link href="/technician/qr-verify">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer">
                            <QrCode className="h-3 w-3 text-amber-600" />
                            Scan QR
                          </span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Hour Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-black text-navy-950">Log Rope Access Hours</h2>
              </div>
              <p className="text-xs text-navy-500">
                Submit your shift hours for on-site L3 supervisor QR sign-off.
              </p>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-navy-700 uppercase tracking-wider">Date *</label>
                  <input
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-navy-700 uppercase tracking-wider">Rope Hours (0-24) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-700 uppercase tracking-wider">Site / Facility Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ras Tanura Refinery Flare Stack #3"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-700 uppercase tracking-wider">Client Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Saudi Aramco"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-700 uppercase tracking-wider">Work Description & Rigging Method *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Ultrasonic testing on flare tip riser welds at 90m height. Anchor rigging with twin static 11mm ropes & edge rollers."
                  value={workScope}
                  onChange={(e) => setWorkScope(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-navy-700 uppercase tracking-wider">Level 3 Safety Supervisor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Al-Ghamdi (IRATA L3)"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowNewModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1 shadow-orange-glow">
                  Log Entry & Generate QR
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
