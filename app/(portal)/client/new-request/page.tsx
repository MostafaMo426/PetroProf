'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, RiskLevelBadge } from '@/components/ui/status-badge'
import { calculateDynamicQuote, type PricingParams, type QuoteBreakdown } from '@/lib/services/pricing'
import { formatCurrency } from '@/lib/utils'
import {
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Send,
  Calculator,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ClientNewRequestWizardPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Project Scope
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [city, setCity] = useState('Jubail')
  const [facilityLocation, setFacilityLocation] = useState('')
  const [durationDays, setDurationDays] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')

  // Step 2: Crew & Risk
  const [level1Count, setLevel1Count] = useState(2)
  const [level2Count, setLevel2Count] = useState(1)
  const [level3Count, setLevel3Count] = useState(1) // Mandatory 1 supervisor
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('high')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(['NDT UT/MT'])
  const [includeEquipment, setIncludeEquipment] = useState(true)

  // AI scope analysis trigger helper
  const handleAiAutoAssess = async () => {
    if (!projectDescription.trim()) {
      toast.error('Please enter a brief project description first.')
      return
    }

    const toastId = toast.loading('Gemini 1.5 Flash is analyzing project scope & hazards...')
    try {
      const res = await fetch('/api/ai/assess-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: projectDescription,
          city,
          facilityLocation,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to assess scope')

      const data = json.data
      setRiskLevel(data.riskRating)
      setLevel1Count(data.recommendedCrew.level1)
      setLevel2Count(data.recommendedCrew.level2)
      setLevel3Count(data.recommendedCrew.level3)
      if (data.specializations?.length) {
        setSelectedSpecs(data.specializations)
      }
      if (data.estimatedDurationDays) {
        setDurationDays(data.estimatedDurationDays)
      }

      toast.success(
        `AI Scope Formulated! Risk: ${data.riskRating.toUpperCase()} (${data.recommendedCrew.total} Techs recommended)`,
        { id: toastId }
      )
    } catch (err: any) {
      toast.error(err.message || 'Could not connect to AI Engine', { id: toastId })
    }
  }

  // Calculate live dynamic quote
  const quote: QuoteBreakdown = calculateDynamicQuote({
    level1Count,
    level2Count,
    level3Count,
    durationDays,
    riskLevel,
    specializations: selectedSpecs,
    includeEquipmentPackage: includeEquipment,
    emergencyDispatch: priority === 'urgent',
  })

  const handleSubmitRequest = () => {
    toast.success('Manpower Request Submitted! Quote sent to your email & dashboard.')
    router.push('/client/projects')
  }

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Request Certified Manpower"
        description="Configure your project scope, receive AI-powered safety recommendations, and get a binding price estimate."
      />

      {/* Stepper Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-navy-100 shadow-sm">
        {[
          { num: 1, label: 'Scope & Location' },
          { num: 2, label: 'Crew & Safety' },
          { num: 3, label: 'Quote Breakdown' },
          { num: 4, label: 'Confirm & Submit' },
        ].map((st, i) => (
          <div key={st.num} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step === st.num
                  ? 'bg-orange-500 text-white shadow-orange-glow'
                  : step > st.num
                  ? 'bg-navy-900 text-white'
                  : 'bg-navy-100 text-navy-500'
              }`}
            >
              {step > st.num ? <CheckCircle2 className="h-4 w-4" /> : st.num}
            </div>
            <span
              className={`text-xs font-bold hidden sm:inline ${
                step >= st.num ? 'text-navy-950' : 'text-navy-400'
              }`}
            >
              {st.label}
            </span>
            {i < 3 && <div className="h-px w-6 sm:w-12 bg-navy-100 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Project Scope */}
      {step === 1 && (
        <Card className="animate-fade-in space-y-6 p-6 sm:p-8">
          <div className="space-y-1 border-b border-navy-100 pb-4">
            <CardTitle className="text-lg font-bold text-navy-950">
              Step 1: Project Scope & Site Location
            </CardTitle>
            <CardDescription>
              Enter the industrial facility specifications and work duration
            </CardDescription>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Storage Tank 402 Ultrasonic Weld Inspection"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Work Scope & Site Conditions *
                </label>
                <button
                  type="button"
                  onClick={handleAiAutoAssess}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Auto-Assess with Gemini AI
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Describe height, structure type (flare stack, storage tank, offshore boom), wind exposure, confined spaces, and work permits required..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full p-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  City / Industrial Zone *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                >
                  <option value="Jubail">Jubail Industrial City</option>
                  <option value="Yanbu">Yanbu Industrial City</option>
                  <option value="Ras Tanura">Ras Tanura</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Dammam">Dammam / Khobar</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="Safaniya">Safaniya (Offshore)</option>
                  <option value="NEOM">NEOM / Red Sea</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Facility / Plant Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aramco Refinery Plant #2"
                  value={facilityLocation}
                  onChange={(e) => setFacilityLocation(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Estimated Duration (Days) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Dispatch Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                >
                  <option value="normal">Standard Notice (3-7 days)</option>
                  <option value="urgent">Emergency / Fast-Track (&lt; 48 hours)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={() => {
                if (!projectName) {
                  toast.error('Please enter a project name')
                  return
                }
                setStep(2)
              }}
              className="gap-2 shadow-orange-glow"
            >
              Continue to Crew Setup <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Crew Composition & Risk */}
      {step === 2 && (
        <Card className="animate-fade-in space-y-6 p-6 sm:p-8">
          <div className="space-y-1 border-b border-navy-100 pb-4">
            <CardTitle className="text-lg font-bold text-navy-950">
              Step 2: Crew Composition & Safety Parameters
            </CardTitle>
            <CardDescription>
              Select required IRATA certified technicians (Per IRATA ICOP, 1 Level 3 Supervisor is mandatory)
            </CardDescription>
          </div>

          {/* Technicians Counter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">
              Required IRATA Technicians
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Level 3 */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <IrataBadge level="level_3" short />
                    <p className="text-xs font-bold text-navy-950 mt-1">Level 3 Supervisor</p>
                    <p className="text-[11px] text-navy-500">SAR 1,850 / day</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-purple-200/60">
                  <span className="text-xs font-semibold text-purple-900">Crew Count</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLevel3Count(Math.max(1, level3Count - 1))}
                      className="h-7 w-7 rounded-lg bg-white border border-purple-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-black text-navy-950 text-sm">{level3Count}</span>
                    <button
                      onClick={() => setLevel3Count(level3Count + 1)}
                      className="h-7 w-7 rounded-lg bg-white border border-purple-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <IrataBadge level="level_2" short />
                    <p className="text-xs font-bold text-navy-950 mt-1">Level 2 Tech / Lead</p>
                    <p className="text-[11px] text-navy-500">SAR 1,250 / day</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
                  <span className="text-xs font-semibold text-blue-900">Crew Count</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLevel2Count(Math.max(0, level2Count - 1))}
                      className="h-7 w-7 rounded-lg bg-white border border-blue-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-black text-navy-950 text-sm">{level2Count}</span>
                    <button
                      onClick={() => setLevel2Count(level2Count + 1)}
                      className="h-7 w-7 rounded-lg bg-white border border-blue-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Level 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <IrataBadge level="level_1" short />
                    <p className="text-xs font-bold text-navy-950 mt-1">Level 1 Technician</p>
                    <p className="text-[11px] text-navy-500">SAR 850 / day</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                  <span className="text-xs font-semibold text-emerald-900">Crew Count</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLevel1Count(Math.max(0, level1Count - 1))}
                      className="h-7 w-7 rounded-lg bg-white border border-emerald-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-black text-navy-950 text-sm">{level1Count}</span>
                    <button
                      onClick={() => setLevel1Count(level1Count + 1)}
                      className="h-7 w-7 rounded-lg bg-white border border-emerald-200 flex items-center justify-center font-bold text-navy-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment Level */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                Site Risk Severity Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { lvl: 'low' as const, label: 'Low', desc: 'Commercial height < 30m' },
                  { lvl: 'medium' as const, label: 'Medium', desc: 'Standard industrial plant' },
                  { lvl: 'high' as const, label: 'High', desc: 'Confined & live plant' },
                  { lvl: 'critical' as const, label: 'Critical', desc: 'Flare tips & toxic H2S' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setRiskLevel(item.lvl)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      riskLevel === item.lvl
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-navy-100 bg-white hover:border-navy-200'
                    }`}
                  >
                    <RiskLevelBadge level={item.lvl} />
                    <p className="text-[11px] text-navy-500 mt-1 font-medium">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Specializations */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                Required Technical Skills (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'NDT UT/MT',
                  'Welding 6G',
                  'Painting & Blasting',
                  'H2S Gas Safety',
                  'Heavy Rigging',
                  'Facade Glazing',
                  'BOSIET Offshore',
                ].map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpec(spec)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedSpecs.includes(spec)
                        ? 'bg-navy-900 text-white border-navy-950 shadow-sm'
                        : 'bg-navy-50 text-navy-700 border-navy-100 hover:bg-navy-100'
                    }`}
                  >
                    {selectedSpecs.includes(spec) ? `✓ ${spec}` : `+ ${spec}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Package Toggle */}
            <label className="flex items-center gap-3 p-4 bg-navy-50 rounded-2xl border border-navy-100 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEquipment}
                onChange={(e) => setIncludeEquipment(e.target.checked)}
                className="h-4 w-4 text-orange-500 rounded border-navy-300 focus:ring-orange-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy-950 block">
                  Include Full PetroProf Certified Equipment Package
                </span>
                <span className="text-[11px] text-navy-500 block">
                  Harnesses, 11mm static ropes, descenders, backup devices, and inspection logs.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-navy-100">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} className="gap-2 shadow-orange-glow">
              Review Quote Breakdown <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Dynamic Quote Breakdown */}
      {step === 3 && (
        <Card className="animate-fade-in space-y-6 p-6 sm:p-8">
          <div className="space-y-1 border-b border-navy-100 pb-4">
            <CardTitle className="text-lg font-bold text-navy-950">
              Step 3: Itemized Dynamic Quote Breakdown
            </CardTitle>
            <CardDescription>
              Transparent rate formulation based on Saudi industrial standards
            </CardDescription>
          </div>

          <div className="space-y-4">
            {/* Summary Banner */}
            <div className="flex items-center justify-between p-6 bg-navy-900 text-white rounded-2xl shadow-xl">
              <div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Total Manpower Estimate
                </p>
                <h3 className="text-3xl font-black text-white mt-1">
                  {formatCurrency(quote.grandTotalSar)}
                </h3>
                <p className="text-xs text-navy-300 mt-1">
                  Equivalent to {formatCurrency(quote.dailyRateEquivalent)} / working day (incl. 15% VAT)
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Fixed Rate Guarantee
                </span>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-navy-100 rounded-2xl overflow-hidden divide-y divide-navy-50 text-xs">
              <div className="flex justify-between p-3.5 bg-navy-50 font-bold text-navy-900">
                <span>Cost Component</span>
                <span>Calculation Basis</span>
                <span>Amount (SAR)</span>
              </div>
              <div className="flex justify-between p-3 text-navy-700">
                <span>IRATA Level 3 Supervisor Labor</span>
                <span className="text-navy-400">{level3Count}x @ SAR 1,850 × {durationDays} days</span>
                <span className="font-bold text-navy-950">{formatCurrency(quote.level3Total)}</span>
              </div>
              {level2Count > 0 && (
                <div className="flex justify-between p-3 text-navy-700">
                  <span>IRATA Level 2 Lead Labor</span>
                  <span className="text-navy-400">{level2Count}x @ SAR 1,250 × {durationDays} days</span>
                  <span className="font-bold text-navy-950">{formatCurrency(quote.level2Total)}</span>
                </div>
              )}
              {level1Count > 0 && (
                <div className="flex justify-between p-3 text-navy-700">
                  <span>IRATA Level 1 Technician Labor</span>
                  <span className="text-navy-400">{level1Count}x @ SAR 850 × {durationDays} days</span>
                  <span className="font-bold text-navy-950">{formatCurrency(quote.level1Total)}</span>
                </div>
              )}
              {quote.riskAdjustment > 0 && (
                <div className="flex justify-between p-3 text-orange-800 bg-orange-50/30">
                  <span>Risk Allowance ({riskLevel.toUpperCase()})</span>
                  <span className="text-orange-600">Hazard factor adjustment</span>
                  <span className="font-bold">{formatCurrency(quote.riskAdjustment)}</span>
                </div>
              )}
              {quote.equipmentPackageFee > 0 && (
                <div className="flex justify-between p-3 text-navy-700">
                  <span>Certified Equipment Kit</span>
                  <span className="text-navy-400">{level1Count + level2Count + level3Count} kits × SAR 250/day</span>
                  <span className="font-bold text-navy-950">{formatCurrency(quote.equipmentPackageFee)}</span>
                </div>
              )}
              <div className="flex justify-between p-3 text-navy-700">
                <span>Mobilization & Site Setup</span>
                <span className="text-navy-400">Fixed rate logistics & rigging</span>
                <span className="font-bold text-navy-950">{formatCurrency(quote.mobilizationFee)}</span>
              </div>
              <div className="flex justify-between p-3 bg-navy-50 font-bold text-navy-950">
                <span>Subtotal (Excl. VAT)</span>
                <span></span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between p-3 text-navy-600">
                <span>Saudi VAT (15%)</span>
                <span>Standard ZATCA Rate</span>
                <span>{formatCurrency(quote.vatAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-navy-100">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="primary" onClick={() => setStep(4)} className="gap-2 shadow-orange-glow">
              Proceed to Submission <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Submission */}
      {step === 4 && (
        <Card className="animate-fade-in space-y-6 p-6 sm:p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm mb-2">
            <Send className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-black text-navy-950">
              Ready to Dispatch Request?
            </CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Your request for &quot;<strong>{projectName}</strong>&quot; ({level1Count + level2Count + level3Count} Technicians) will be sent to the PetroProf dispatch team in Riyadh.
            </CardDescription>
          </div>

          <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100 text-xs text-navy-700 max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-navy-400">Total Quote Value:</span>
              <span className="font-black text-navy-950">{formatCurrency(quote.grandTotalSar)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Location:</span>
              <span className="font-bold text-navy-900">{facilityLocation || city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-400">Duration:</span>
              <span className="font-bold text-navy-900">{durationDays} Calendar Days</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back to Breakdown
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitRequest}
              className="gap-2 shadow-orange-glow px-8"
            >
              <CheckCircle2 className="h-5 w-5" />
              Confirm & Dispatch Request
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
