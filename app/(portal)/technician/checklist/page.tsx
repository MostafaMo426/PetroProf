'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function TechnicianChecklistPage() {
  const [items, setItems] = useState([
    { id: 1, text: 'Dual-rope system inspected for cuts, abrasion, and glazing', checked: false },
    { id: 2, text: 'Independent anchors tested and rated for minimum 15kN load', checked: false },
    { id: 3, text: 'Petzl ASAP Lock backup device functional check completed', checked: false },
    { id: 4, text: 'Full body harness straps adjusted and auto-locking carabiners locked', checked: false },
    { id: 5, text: 'Helmet chin strap secured (EN 397/12492 compliant)', checked: false },
    { id: 6, text: 'Tool tether lanyards attached to prevent drop hazards', checked: false },
    { id: 7, text: 'Permit to Work (PTW) signed by Area Safety Officer', checked: false },
    { id: 8, text: 'Emergency rescue plan confirmed with Level 3 Safety Supervisor', checked: false },
  ])

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const allChecked = items.every((i) => i.checked)

  const handleSubmit = () => {
    if (!allChecked) {
      toast.error('Please complete all safety verification checks before rigging.')
      return
    }
    toast.success('Pre-Rigging Safety Checklist signed and transmitted to Level 3 Supervisor!')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title="Pre-Rigging Safety Checklist"
        description="Mandatory daily IRATA ICOP & Saudi Aramco pre-suspension equipment and environmental verification."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            IRATA ICOP 2024
          </span>
        }
      />

      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                item.checked
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-semibold'
                  : 'bg-navy-50/50 border-navy-100 text-navy-800 hover:bg-navy-100/50'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="mt-0.5 h-4 w-4 rounded text-orange-500 border-navy-300 focus:ring-orange-500"
              />
              <span className="flex-1">{item.text}</span>
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-navy-100 flex justify-end">
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={!allChecked}
            className="shadow-orange-glow gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Sign & Transmit Safety Check
          </Button>
        </div>
      </Card>
    </div>
  )
}
