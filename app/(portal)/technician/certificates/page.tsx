'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/utils'
import {
  Award,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Plus,
  X,
  Sparkles,
  Download,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

interface CertItem {
  id: string
  title: string
  issuingBody: string
  certNumber: string
  issueDate: string
  expiryDate: string
  daysUntilExpiry: number
  verified: boolean
  aiExtracted: boolean
}

const MOCK_CERTS: CertItem[] = [
  {
    id: 'c-1',
    title: 'IRATA Level 2 Rope Access Technician',
    issuingBody: 'IRATA International',
    certNumber: '2/104829',
    issueDate: '2024-05-14',
    expiryDate: '2027-05-14',
    daysUntilExpiry: 256,
    verified: true,
    aiExtracted: true,
  },
  {
    id: 'c-2',
    title: 'Annual Offshore Medical Fitness',
    issuingBody: 'Saudi Aramco Medical Services',
    certNumber: 'MED-2025-9182',
    issueDate: '2025-09-18',
    expiryDate: '2026-09-18',
    daysUntilExpiry: 18,
    verified: true,
    aiExtracted: true,
  },
  {
    id: 'c-3',
    title: 'H2S Gas Safety & Escape Breathing Apparatus',
    issuingBody: 'Saudi Red Crescent Authority',
    certNumber: 'H2S-891024',
    issueDate: '2024-09-27',
    expiryDate: '2026-09-27',
    daysUntilExpiry: 27,
    verified: true,
    aiExtracted: false,
  },
  {
    id: 'c-4',
    title: 'First Aid & CPR at Height',
    issuingBody: 'Saudi Heart Association',
    certNumber: 'FA-91028',
    issueDate: '2025-01-10',
    expiryDate: '2027-01-10',
    daysUntilExpiry: 132,
    verified: true,
    aiExtracted: true,
  },
]

export default function TechnicianCertificatesPage() {
  const [certs, setCerts] = useState<CertItem[]>(MOCK_CERTS)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const [isUploading, setIsUploading] = useState(false)

  const handleSimulateAiUpload = async (fileBase64?: string, mimeType?: string) => {
    setIsUploading(true)
    const toastId = toast.loading('Gemini 1.5 Flash Vision is extracting certificate credentials...')

    try {
      const res = await fetch('/api/ai/parse-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: fileBase64 || null,
          mimeType: mimeType || 'image/jpeg',
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to parse certificate')

      const data = json.data
      const newCert: CertItem = {
        id: `c-${Date.now()}`,
        title: data.certType,
        issuingBody: data.issuingBody,
        certNumber: data.certNumber,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        daysUntilExpiry: data.daysUntilExpiry,
        verified: data.isVerified,
        aiExtracted: true,
      }

      setCerts([newCert, ...certs])
      setShowUploadModal(false)
      toast.success(`OCR Verified: ${data.certType} (#${data.certNumber}) registered!`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract certificate details', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Certifications & Documents"
        description="Upload IRATA cards, medical fitness certificates, and technical permits. Gemini AI OCR automatically parses and registers your renewal dates."
        badge={<IrataBadge level="level_2" />}
      >
        <Button
          variant="primary"
          onClick={() => setShowUploadModal(true)}
          className="gap-2 shadow-orange-glow"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Certificate (AI OCR)
        </Button>
      </PageHeader>

      {/* Expiry Alert banner if any cert expiring soon */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">
              Annual Offshore Medical Fitness expires in 18 days!
            </p>
            <p className="text-amber-700">
              Schedule your clinic appointment to maintain deployment readiness.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Aramco approved clinic booking link opened.')}
          className="shrink-0 text-xs font-bold border-amber-300 text-amber-900 bg-white"
        >
          Book Medical
        </Button>
      </div>

      {/* Certs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert) => (
          <Card key={cert.id} className="hover:border-navy-300 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-800 shrink-0">
                    <Award className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-navy-950">
                      {cert.title}
                    </CardTitle>
                    <p className="text-[11px] text-navy-400 font-mono">
                      {cert.issuingBody} • #{cert.certNumber}
                    </p>
                  </div>
                </div>
                {cert.aiExtracted && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 flex items-center gap-1 shrink-0">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    AI Parsed
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-navy-50/70 p-3 rounded-xl border border-navy-100/80">
                <div>
                  <span className="text-navy-400 block font-semibold text-[10px] uppercase">
                    Issue Date
                  </span>
                  <span className="font-bold text-navy-900">{formatDate(cert.issueDate)}</span>
                </div>
                <div>
                  <span className="text-navy-400 block font-semibold text-[10px] uppercase">
                    Expiry Date
                  </span>
                  <span className="font-bold text-navy-900">{formatDate(cert.expiryDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-navy-500 font-medium">Renewal Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                    cert.daysUntilExpiry <= 30
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {cert.daysUntilExpiry} days remaining
                </span>
              </div>
            </CardContent>

            <div className="p-3 border-t border-navy-50 bg-navy-50/30 flex items-center justify-between text-xs rounded-b-2xl">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified & Active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.success(`Viewing certificate PDF for ${cert.title}`)}
                className="h-7 text-xs font-bold text-navy-600 gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Modal (AI Integration Preview) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-black text-navy-950">
                  AI Certificate Parser
                </h2>
              </div>
              <p className="text-xs text-navy-500">
                Upload your IRATA ID card, medical fitness PDF, or training certificate. Google Gemini 1.5 Flash Vision automatically extracts certificate numbers and expiration dates.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleSimulateAiUpload() }}
              className={`p-8 border-2 border-dashed rounded-3xl text-center space-y-3 transition-colors cursor-pointer ${
                dragOver ? 'border-orange-500 bg-orange-50/50' : 'border-navy-200 bg-navy-50/50 hover:bg-navy-50'
              }`}
            >
              <div className="mx-auto h-12 w-12 rounded-2xl bg-white border border-navy-100 shadow-sm flex items-center justify-center text-orange-500">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-950">
                  Drag & drop certificate image or PDF
                </p>
                <p className="text-xs text-navy-400 mt-0.5">
                  Supports PNG, JPG, PDF (up to 10MB)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSimulateAiUpload()}
                disabled={isUploading}
                className="flex-1 gap-2 shadow-orange-glow"
              >
                <Sparkles className="h-4 w-4" />
                Simulate AI Parsing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
