'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IrataBadge } from '@/components/ui/status-badge'
import {
  UserPlus,
  Shield,
  Building2,
  HardHat,
  Lock,
  Mail,
  User,
  Phone,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import type { UserRole, IrataLevel } from '@/types/database.types'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  defaultRole?: UserRole
  onUserCreated?: (user: any) => void
}

export function CreateUserModal({
  isOpen,
  onClose,
  defaultRole = 'technician',
  onUserCreated,
}: CreateUserModalProps) {
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Password123!')
  const [phone, setPhone] = useState('')

  // Technician fields
  const [irataLevel, setIrataLevel] = useState<IrataLevel>('level_1')
  const [irataMembershipNo, setIrataMembershipNo] = useState('')
  const [yearsExperience, setYearsExperience] = useState(3)
  const [dailyRateSar, setDailyRateSar] = useState(850)
  const [specializations, setSpecializations] = useState<string[]>(['NDT UT/MT'])

  // Client fields
  const [organizationName, setOrganizationName] = useState('')
  const [industrySector, setIndustrySector] = useState('Oil & Gas')
  const [city, setCity] = useState('Jubail')

  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    if (newRole === 'technician') {
      setDailyRateSar(irataLevel === 'level_3' ? 1850 : irataLevel === 'level_2' ? 1250 : 850)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast.error('Please enter full name, email, and password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          role,
          irataLevel,
          irataMembershipNo,
          yearsExperience,
          dailyRateSar,
          specializations,
          organizationName,
          industrySector,
          city,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      toast.success(`Account created for ${fullName} as ${role}!`)
      if (onUserCreated) onUserCreated(data.user)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-navy-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 hover:text-navy-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <UserPlus className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-navy-950">
              Provision New User Account
            </h2>
          </div>
          <p className="text-xs text-navy-500">
            Create an active user in Supabase with customized role and credentials.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
            Select Account Role *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'technician' as const, label: 'Technician', icon: HardHat },
              { id: 'client' as const, label: 'Client', icon: Building2 },
              { id: 'admin' as const, label: 'Admin', icon: Shield },
              { id: 'super_admin' as const, label: 'Super Admin', icon: Sparkles },
            ].map((r) => {
              const Icon = r.icon
              const isSelected = role === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-navy-900 text-white border-navy-950 shadow-md'
                      : 'bg-navy-50 text-navy-700 border-navy-100 hover:bg-navy-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-orange-400' : 'text-navy-500'}`} />
                  <span>{r.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* General Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider text-[10px]">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Mansour Al-Harbi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider text-[10px]">
                Work Email Address *
              </label>
              <input
                type="email"
                placeholder="user@petroprof.sa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider text-[10px]">
                Initial Password *
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider text-[10px]">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="+966 5x xxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Role-specific fields: Technician */}
          {role === 'technician' && (
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                <HardHat className="h-4 w-4 text-orange-600" />
                IRATA Technician Credentials
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">IRATA Level *</label>
                  <select
                    value={irataLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as IrataLevel
                      setIrataLevel(lvl)
                      setDailyRateSar(lvl === 'level_3' ? 1850 : lvl === 'level_2' ? 1250 : 850)
                    }}
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white cursor-pointer"
                  >
                    <option value="level_1">Level 1 - Technician</option>
                    <option value="level_2">Level 2 - Lead Tech</option>
                    <option value="level_3">Level 3 - Supervisor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">IRATA ID / Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 2/194820"
                    value={irataMembershipNo}
                    onChange={(e) => setIrataMembershipNo(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">Years Experience</label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">Daily Rate (SAR)</label>
                  <input
                    type="number"
                    value={dailyRateSar}
                    onChange={(e) => setDailyRateSar(Number(e.target.value))}
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white font-bold text-orange-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role-specific fields: Client */}
          {role === 'client' && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Building2 className="h-4 w-4 text-blue-600" />
                Enterprise Client Organization
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">Organization Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Petro Rabigh"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy-700 text-[10px]">Industry Sector</label>
                  <select
                    value={industrySector}
                    onChange={(e) => setIndustrySector(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-navy-200 text-xs bg-white cursor-pointer"
                  >
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Petrochemical">Petrochemical</option>
                    <option value="Offshore Marine">Offshore Marine</option>
                    <option value="Power & Utilities">Power & Utilities</option>
                    <option value="Commercial High-Rise">Commercial High-Rise</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex gap-3 pt-3 border-t border-navy-100">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1 gap-2 shadow-orange-glow"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Provisioning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
