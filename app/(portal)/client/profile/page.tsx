'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Save, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function ClientProfilePage() {
  const [orgName, setOrgName] = useState('Saudi Aramco')
  const [contactName, setContactName] = useState('Eng. Khalid Al-Otaibi')
  const [email, setEmail] = useState('khalid.otaibi@aramco.com')
  const [phone, setPhone] = useState('+966 13 872 0115')
  const [city, setCity] = useState('Dhahran')
  const [crNumber, setCrNumber] = useState('2050000001')
  const [vatNumber, setVatNumber] = useState('300000000000003')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Organization profile & billing details updated.')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Company Profile & Billing"
        description="Manage corporate entity details, verified VAT numbers, and representative contact information."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-navy-100 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-xl">
              <Building2 className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-950">{orgName}</h2>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Enterprise Client
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Representative Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Commercial Reg (CR Number)</label>
              <input
                type="text"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">VAT Identification Number</label>
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-navy-100">
            <Button type="submit" variant="primary" className="gap-2 shadow-orange-glow">
              <Save className="h-4 w-4" />
              Save Company Profile
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
