'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, RiskLevelBadge } from '@/components/ui/status-badge'
import { calculateDynamicQuote, type QuoteBreakdown } from '@/lib/services/pricing'
import { formatCurrency } from '@/lib/utils'
import {
  Calculator,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function ClientCalculatorPage() {
  const [level1Count, setLevel1Count] = useState(2)
  const [level2Count, setLevel2Count] = useState(1)
  const [level3Count, setLevel3Count] = useState(1)
  const [durationDays, setDurationDays] = useState(7)
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [specializations, setSpecializations] = useState<string[]>(['NDT UT/MT'])
  const [includeEquipment, setIncludeEquipment] = useState(true)

  const quote: QuoteBreakdown = calculateDynamicQuote({
    level1Count,
    level2Count,
    level3Count,
    durationDays,
    riskLevel,
    specializations,
    includeEquipmentPackage: includeEquipment,
  })

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="Dynamic Quoting Calculator"
        description="Instant price estimator for rope access manpower deployments in Saudi Arabia based on duration, technical skills, and site risk parameters."
      >
        <Link href="/client/new-request">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Create Official Request
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-navy-950 text-base mb-1">1. Crew Composition</h3>
              <p className="text-xs text-navy-500">
                Adjust the number of IRATA Level 1, 2, and 3 technicians.
              </p>
            </div>

            <div className="space-y-3">
              {/* Level 3 */}
              <div className="flex items-center justify-between p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <IrataBadge level="level_3" short />
                    <span className="font-bold text-navy-950 text-xs">Level 3 Supervisor</span>
                  </div>
                  <span className="text-[11px] text-navy-500">SAR 1,850 / shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLevel3Count(Math.max(1, level3Count - 1))}
                    className="h-8 w-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-black text-navy-950 w-5 text-center">{level3Count}</span>
                  <button
                    onClick={() => setLevel3Count(level3Count + 1)}
                    className="h-8 w-8 rounded-lg bg-white border border-purple-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Level 2 */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <IrataBadge level="level_2" short />
                    <span className="font-bold text-navy-950 text-xs">Level 2 Tech / Lead</span>
                  </div>
                  <span className="text-[11px] text-navy-500">SAR 1,250 / shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLevel2Count(Math.max(0, level2Count - 1))}
                    className="h-8 w-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-black text-navy-950 w-5 text-center">{level2Count}</span>
                  <button
                    onClick={() => setLevel2Count(level2Count + 1)}
                    className="h-8 w-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Level 1 */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <IrataBadge level="level_1" short />
                    <span className="font-bold text-navy-950 text-xs">Level 1 Technician</span>
                  </div>
                  <span className="text-[11px] text-navy-500">SAR 850 / shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLevel1Count(Math.max(0, level1Count - 1))}
                    className="h-8 w-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-black text-navy-950 w-5 text-center">{level1Count}</span>
                  <button
                    onClick={() => setLevel1Count(level1Count + 1)}
                    className="h-8 w-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center font-bold text-navy-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Duration slider */}
            <div className="space-y-2 pt-2 border-t border-navy-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-navy-950">2. Duration of Work</span>
                <span className="font-black text-orange-600 text-sm">{durationDays} Calendar Days</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-navy-400 font-semibold">
                <span>1 Day</span>
                <span>30 Days</span>
                <span>60 Days</span>
              </div>
            </div>

            {/* Risk Factor */}
            <div className="space-y-2 pt-2 border-t border-navy-100">
              <span className="font-bold text-navy-950 text-xs block">3. Site Hazard & Risk Factor</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { lvl: 'low' as const, label: 'Low' },
                  { lvl: 'medium' as const, label: 'Medium' },
                  { lvl: 'high' as const, label: 'High' },
                  { lvl: 'critical' as const, label: 'Critical' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setRiskLevel(item.lvl)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      riskLevel === item.lvl
                        ? 'bg-navy-900 text-white border-navy-950 shadow-sm'
                        : 'bg-navy-50 text-navy-700 border-navy-100 hover:bg-navy-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Estimate Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-navy-900 text-white p-6 sm:p-8 space-y-6 shadow-2xl border-navy-800">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Instant Estimate
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {formatCurrency(quote.grandTotalSar)}
              </h2>
              <p className="text-xs text-navy-300">
                SAR {quote.dailyRateEquivalent.toLocaleString()} / day (inclusive of 15% VAT)
              </p>
            </div>

            <div className="border-t border-navy-800 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-navy-300">
                <span>Labor Subtotal:</span>
                <span className="font-bold text-white">{formatCurrency(quote.laborSubtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Risk Surcharge:</span>
                <span className="font-bold text-orange-400">+{formatCurrency(quote.riskAdjustment)}</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Mobilization & Logistics:</span>
                <span className="font-bold text-white">{formatCurrency(quote.mobilizationFee)}</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Saudi VAT (15%):</span>
                <span className="font-bold text-white">{formatCurrency(quote.vatAmount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-navy-800">
              <Link href="/client/new-request">
                <Button variant="primary" size="lg" className="w-full gap-2 font-bold shadow-orange-glow">
                  Request Official Scope
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
