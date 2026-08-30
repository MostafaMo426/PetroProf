'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, TechnicianStatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Filter,
  Sparkles,
  Download,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'

interface ComplianceItem {
  id: string
  technicianName: string
  irataLevel: 'level_1' | 'level_2' | 'level_3'
  certType: string
  issuingBody: string
  expiryDate: string
  daysUntilExpiry: number
  status: 'critical' | 'urgent' | 'warning' | 'ok'
  verified: boolean
}

const MOCK_COMPLIANCE: ComplianceItem[] = [
  {
    id: 'c-1',
    technicianName: 'Tariq Al-Ghamdi',
    irataLevel: 'level_3',
    certType: 'IRATA Level 3 Recertification',
    issuingBody: 'IRATA International',
    expiryDate: '2026-09-28',
    daysUntilExpiry: 12,
    status: 'critical',
    verified: true,
  },
  {
    id: 'c-2',
    technicianName: 'Hassan Al-Zahrani',
    irataLevel: 'level_2',
    certType: 'Annual Medical Fitness (Offshore)',
    issuingBody: 'Saudi Aramco Medical Services',
    expiryDate: '2026-09-18',
    daysUntilExpiry: 18,
    status: 'urgent',
    verified: true,
  },
  {
    id: 'c-3',
    technicianName: 'Omar Farooq Al-Qarni',
    irataLevel: 'level_1',
    certType: 'H2S Gas Safety & Escape',
    issuingBody: 'Saudi Red Crescent',
    expiryDate: '2026-09-27',
    daysUntilExpiry: 27,
    status: 'urgent',
    verified: true,
  },
  {
    id: 'c-4',
    technicianName: 'Fahad Al-Shehri',
    irataLevel: 'level_2',
    certType: 'Confined Space Entry Permit',
    issuingBody: 'Saudi Civil Defense',
    expiryDate: '2026-10-03',
    daysUntilExpiry: 34,
    status: 'warning',
    verified: false,
  },
  {
    id: 'c-5',
    technicianName: 'David Mitchell',
    irataLevel: 'level_3',
    certType: 'BOSIET Offshore Survival with EBS',
    issuingBody: 'OPITO Certified',
    expiryDate: '2027-08-19',
    daysUntilExpiry: 354,
    status: 'ok',
    verified: true,
  },
]

export default function AdminCompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>(MOCK_COMPLIANCE)
  const [filter, setFilter] = useState<'all' | 'critical' | 'urgent' | 'warning'>('all')

  const handleNotifyTech = (name: string) => {
    toast.success(`Automated SMS & Email renewal notification sent to ${name}.`)
  }

  const handleVerifyCert = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verified: true } : item))
    )
    toast.success('Certificate marked as audited & verified in national registry.')
  }

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.status === filter
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="IRATA & Safety Compliance Tracker"
        description="Automated audit tracking of expiring technician credentials, annual offshore medicals, and mandatory Saudi safety permits."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            4 Expiries in 30 Days
          </span>
        }
      >
        <Button
          variant="outline"
          className="gap-1.5 text-xs font-bold"
          onClick={() => toast.success('Compliance audit export downloaded.')}
        >
          <Download className="h-4 w-4" />
          Export Audit PDF
        </Button>
      </PageHeader>

      {/* Expiry breakdown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('critical')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'critical'
              ? 'bg-red-500 text-white border-red-600 shadow-md'
              : 'bg-white border-red-200 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Critical (0 - 14 Days)</span>
            <span className="h-3 w-3 rounded-full bg-red-600 animate-ping" />
          </div>
          <p className="text-2xl font-black mt-2">1 Tech Expiring</p>
          <p className="text-xs opacity-80 mt-1">Requires immediate recertification booking</p>
        </div>

        <div
          onClick={() => setFilter('urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'urgent'
              ? 'bg-orange-500 text-white border-orange-600 shadow-md'
              : 'bg-white border-orange-200 hover:border-orange-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Urgent (15 - 30 Days)</span>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black mt-2">2 Techs Expiring</p>
          <p className="text-xs opacity-80 mt-1">Medical & Gas safety renewals</p>
        </div>

        <div
          onClick={() => setFilter('warning')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'warning'
              ? 'bg-yellow-400 text-navy-950 border-yellow-500 shadow-md'
              : 'bg-white border-yellow-200 hover:border-yellow-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Warning (31 - 90 Days)</span>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-black mt-2">1 Tech Notice</p>
          <p className="text-xs opacity-80 mt-1">Confined space safety refresher</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-xl border border-navy-100">
        {(['all', 'critical', 'urgent', 'warning'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              filter === tab
                ? 'bg-navy-900 text-white'
                : 'text-navy-600 hover:bg-navy-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Compliance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/75 border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Certification Title</th>
                  <th className="py-3 px-4">Issuing Body</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Countdown</th>
                  <th className="py-3 px-4">Audit Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-navy-950">{item.technicianName}</p>
                      <IrataBadge level={item.irataLevel} short />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-navy-800">
                      {item.certType}
                    </td>
                    <td className="py-3.5 px-4 text-navy-500">
                      {item.issuingBody}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {formatDate(item.expiryDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black ${
                          item.status === 'critical'
                            ? 'bg-red-500 text-white'
                            : item.status === 'urgent'
                            ? 'bg-orange-500 text-white'
                            : item.status === 'warning'
                            ? 'bg-amber-400 text-navy-950'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.daysUntilExpiry > 0 ? `${item.daysUntilExpiry} days left` : 'EXPIRED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          Audited
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {!item.verified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyCert(item.id)}
                          className="text-xs h-7 px-2 font-bold text-emerald-700 hover:bg-emerald-50"
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNotifyTech(item.technicianName)}
                        className="text-xs h-7 px-2 text-navy-600"
                        title="Send Reminder"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
