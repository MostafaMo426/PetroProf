'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge } from '@/components/ui/status-badge'
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TechnicianQrVerifyPage() {
  const [isVerified, setIsVerified] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)

  const handleSimulateSupervisorScan = () => {
    setIsVerified(true)
    toast.success('🎉 Shift verified by Level 3 Supervisor! 8.5 Rope Hours synced.')
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fade-in text-center">
      <PageHeader
        title="On-Site QR Verification"
        description="Present this dynamic QR code to your Level 3 Safety Supervisor on site to verify and sign off your logged rope hours instantly."
      />

      <Card className="p-6 sm:p-8 space-y-6 shadow-2xl border-navy-100">
        <div className="flex items-center justify-between border-b border-navy-100 pb-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">
              Active Shift Token
            </span>
            <h3 className="font-bold text-navy-950 text-sm">
              Ras Tanura Refinery Flare Stack #3
            </h3>
          </div>
          <IrataBadge level="level_2" short />
        </div>

        {/* QR Code Container with SVG representation */}
        <div className="relative mx-auto w-64 h-64 p-4 rounded-3xl bg-white border-2 border-navy-200 shadow-inner flex flex-col items-center justify-center space-y-2">
          {!isVerified ? (
            <>
              {/* Dynamic QR visual grid */}
              <div className="w-48 h-48 bg-navy-950 p-2 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-white fill-current"
                >
                  <rect width="25" height="25" fill="white" rx="4" />
                  <rect x="5" y="5" width="15" height="15" fill="#0A192F" rx="2" />
                  <rect x="8" y="8" width="9" height="9" fill="white" />

                  <rect x="75" width="25" height="25" fill="white" rx="4" />
                  <rect x="80" y="5" width="15" height="15" fill="#0A192F" rx="2" />
                  <rect x="83" y="8" width="9" height="9" fill="white" />

                  <rect y="75" width="25" height="25" fill="white" rx="4" />
                  <rect x="5" y="80" width="15" height="15" fill="#0A192F" rx="2" />
                  <rect x="8" y="83" width="9" height="9" fill="white" />

                  {/* Randomized barcode dots for realistic look */}
                  <rect x="32" y="10" width="8" height="8" fill="white" />
                  <rect x="45" y="10" width="15" height="8" fill="white" />
                  <rect x="35" y="25" width="25" height="8" fill="white" />
                  <rect x="10" y="40" width="25" height="8" fill="white" />
                  <rect x="40" y="40" width="20" height="20" fill="#FF6B00" rx="3" />
                  <rect x="70" y="40" width="20" height="8" fill="white" />
                  <rect x="35" y="65" width="15" height="10" fill="white" />
                  <rect x="55" y="65" width="25" height="10" fill="white" />
                  <rect x="40" y="80" width="25" height="10" fill="white" />
                  <rect x="75" y="80" width="15" height="10" fill="white" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Token Active • Expires in 48 hrs
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 animate-fade-in">
              <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <span className="font-black text-navy-950 text-base">
                Hours Verified & Signed!
              </span>
              <span className="text-xs text-navy-500">
                Logged to official PetroProf logbook
              </span>
            </div>
          )}
        </div>

        {/* Shift Details Summary */}
        <div className="bg-navy-50 p-4 rounded-2xl border border-navy-100 text-xs space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-navy-400 font-medium">Logged Hours:</span>
            <span className="font-black text-navy-950">8.5 Rope Hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-400 font-medium">Date & Shift:</span>
            <span className="font-bold text-navy-900">Today (Day Shift)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-400 font-medium">Assigned Supervisor:</span>
            <span className="font-bold text-navy-900">Tariq Al-Ghamdi (IRATA L3 #3/89421)</span>
          </div>
        </div>

        {/* Simulation action trigger */}
        <div className="space-y-3 pt-2">
          {!isVerified ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSimulateSupervisorScan}
              className="w-full gap-2 shadow-orange-glow"
            >
              <Smartphone className="h-4 w-4" />
              Simulate Supervisor Scan & Sign-Off
            </Button>
          ) : (
            <Link href="/technician/logbook" className="block">
              <Button variant="outline" size="lg" className="w-full">
                Back to Digital Logbook
              </Button>
            </Link>
          )}

          <p className="text-[11px] text-navy-400">
            Per IRATA International bylaws, unauthorized hour falsification invalidates certification.
          </p>
        </div>
      </Card>
    </div>
  )
}
