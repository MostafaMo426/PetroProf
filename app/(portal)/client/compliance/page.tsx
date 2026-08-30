'use client'

import * as React from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  ShieldCheck,
  Download,
  ExternalLink,
  Award,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

export default function ClientComplianceDocsPage() {
  const docs = [
    {
      title: 'IRATA International Operator Certificate (Full Member)',
      category: 'IRATA Accreditation',
      ref: 'IRATA-OP-2026-SA',
      validUntil: 'Dec 2027',
      size: '2.4 MB',
      verified: true,
    },
    {
      title: 'Saudi Aramco General Contractor Safety Approval (CSM)',
      category: 'Vendor Qualification',
      ref: 'ARAMCO-VEN-981024',
      validUntil: 'Nov 2026',
      size: '1.8 MB',
      verified: true,
    },
    {
      title: 'Comprehensive General Third-Party Liability Insurance (SAR 50,000,000)',
      category: 'Insurance Policy',
      ref: 'INS-POL-2026-091',
      validUntil: 'Jan 2027',
      size: '3.1 MB',
      verified: true,
    },
    {
      title: 'ISO 45001:2018 Occupational Health & Safety Management System',
      category: 'Quality & Safety',
      ref: 'ISO-45001-9281',
      validUntil: 'Aug 2028',
      size: '1.5 MB',
      verified: true,
    },
    {
      title: 'Saudi Civil Defense Working at Height Operations License',
      category: 'Statutory License',
      ref: 'SCD-LIC-2026-441',
      validUntil: 'May 2027',
      size: '1.1 MB',
      verified: true,
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="Safety Credentials & Compliance Library"
        description="Official verified documentation covering IRATA Operator licenses, Aramco vendor qualifications, and statutory liability insurance."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Compliant
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc, idx) => (
          <Card key={idx} className="flex flex-col justify-between hover:border-navy-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {doc.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
              <CardTitle className="text-sm font-bold text-navy-950 mt-2">
                {doc.title}
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                Ref: {doc.ref} • Valid until: {doc.validUntil}
              </CardDescription>
            </CardHeader>

            <div className="p-3 border-t border-navy-50 bg-navy-50/30 flex items-center justify-between text-xs rounded-b-2xl">
              <span className="text-navy-400 font-medium">PDF ({doc.size})</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-bold gap-1 text-navy-700"
                onClick={() => alert(`Downloading ${doc.title}`)}
              >
                <Download className="h-3.5 w-3.5" />
                Download Document
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
