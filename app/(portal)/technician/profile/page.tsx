'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, TechnicianStatusBadge } from '@/components/ui/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  HardHat,
  Award,
} from 'lucide-react'
import { toast } from 'sonner'

export default function TechnicianProfilePage() {
  const [fullName, setFullName] = useState('Hassan Al-Zahrani')
  const [phone, setPhone] = useState('+966 54 819 2831')
  const [iqama, setIqama] = useState('1092817462')
  const [bloodType, setBloodType] = useState('A+')
  const [emergencyContact, setEmergencyContact] = useState('Waleed Al-Zahrani (+966 54 000 1111)')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile and emergency records updated successfully.')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Technician Profile & Credentials"
        description="Manage your contact details, emergency medical contacts, and verified Saudi residence records."
        badge={<IrataBadge level="level_2" />}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-navy-100 pb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-navy-900 text-white font-black text-2xl">
                HA
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h2 className="text-xl font-black text-navy-950">{fullName}</h2>
                  <p className="text-xs text-navy-500 font-mono">Employee ID: PP-T0189</p>
                </div>
                <TechnicianStatusBadge status="available" />
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <IrataBadge level="level_2" />
                <span className="px-2.5 py-0.5 rounded-full bg-navy-50 text-[11px] font-bold text-navy-700 border border-navy-100">
                  IRATA #2/104829
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  2,180 Verified Rope Hours
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-700 uppercase tracking-wider">
                Full Name (As per IQAMA/Passport)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-700 uppercase tracking-wider">
                Mobile Number (Saudi WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-700 uppercase tracking-wider">
                Saudi National ID / IQAMA Number
              </label>
              <input
                type="text"
                value={iqama}
                onChange={(e) => setIqama(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-700 uppercase tracking-wider">
                Blood Type
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-navy-700 uppercase tracking-wider">
                Emergency Contact (Name & Phone)
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-navy-100">
            <Button type="submit" variant="primary" className="gap-2 shadow-orange-glow">
              <Save className="h-4 w-4" />
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
