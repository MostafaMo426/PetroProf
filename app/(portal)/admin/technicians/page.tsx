'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, TechnicianStatusBadge } from '@/components/ui/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTechnicians, type TechnicianWithProfile } from '@/lib/services/technicians'
import { getInitials, formatCurrency, formatDate } from '@/lib/utils'
import type { IrataLevel, TechnicianStatus } from '@/types/database.types'
import { CreateUserModal } from '@/components/admin/CreateUserModal'
import { useLanguage } from '@/lib/i18n/context'
import {
  Search,
  Users,
  Star,
  Phone,
  Mail,
  X,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<TechnicianWithProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTech, setSelectedTech] = useState<TechnicianWithProfile | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { t, isRTL } = useLanguage()

  const loadTechnicians = () => {
    getTechnicians().then(setTechnicians)
  }

  useEffect(() => {
    loadTechnicians()
  }, [])

  const filteredTechs = technicians.filter((tech) => {
    const nameMatch = tech.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    const empMatch = (tech.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase())
    const specMatch = (tech.specializations || []).some((s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesSearch = nameMatch || empMatch || specMatch

    const matchesLevel = levelFilter === 'all' || tech.irata_level === levelFilter
    const matchesStatus = statusFilter === 'all' || tech.status === statusFilter

    return matchesSearch && matchesLevel && matchesStatus
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={t('techniciansDirectory')}
        description={t('noTechniciansDesc')}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-bold text-navy-800">
            <Users className="h-3.5 w-3.5" />
            {technicians.length} {t('registeredPersonnel')}
          </span>
        }
      >
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 text-xs font-bold shadow-orange-glow"
        >
          <UserPlus className="h-4 w-4" />
          {t('addNewTechnician')}
        </Button>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-navy-100 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400`} />
          <input
            type="text"
            placeholder={t('searchTechnicianPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-10 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} rounded-xl bg-navy-50/60 border border-navy-100 text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-navy-400 mr-1 hidden md:inline">{t('level')}:</span>
          {['all', 'level_1', 'level_2', 'level_3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                levelFilter === lvl
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              {lvl === 'all' ? t('allLevels') : lvl === 'level_1' ? 'Level 1' : lvl === 'level_2' ? 'Level 2' : 'Level 3'}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-navy-50/60 border border-navy-100 text-xs font-semibold text-navy-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
        >
          <option value="all">{t('allStatuses')}</option>
          <option value="available">{t('available')}</option>
          <option value="deployed">{t('deployed')}</option>
          <option value="in_training">{t('inTraining')}</option>
          <option value="on_leave">{t('onLeave')}</option>
        </select>
      </div>

      {/* Technicians Grid */}
      {filteredTechs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-navy-100 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="h-16 w-16 bg-navy-50 text-navy-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            0
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-navy-950">{t('noTechnicians')}</h3>
            <p className="text-sm text-navy-500">{t('noTechniciansDesc')}</p>
          </div>
          <Button
            variant="primary"
            className="gap-2 shadow-orange-glow"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            {t('addFirstTechnician')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechs.map((tech) => (
            <Card
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              className="cursor-pointer hover:border-orange-300 hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-navy-100 group-hover:scale-105 transition-transform">
                      <AvatarFallback className="bg-navy-900 text-white font-bold text-sm">
                        {getInitials(tech.profile?.full_name || 'Tech')}
                      </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-navy-950 text-sm group-hover:text-orange-600 transition-colors">
                      {tech.profile.full_name}
                    </h3>
                    <p className="text-[11px] text-navy-400 font-mono">
                      {tech.employee_id} • {tech.nationality}
                    </p>
                  </div>
                </div>
                <TechnicianStatusBadge status={tech.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3 text-xs">
              <div className="flex items-center justify-between py-1.5 px-3 bg-navy-50/70 rounded-xl border border-navy-100/80">
                <span className="text-navy-500 font-medium">{t('irataCredential')}</span>
                <IrataBadge level={tech.irata_level} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-navy-700">
                <div className="p-2 bg-white rounded-lg border border-navy-100/80">
                  <span className="text-[10px] text-navy-400 font-semibold block uppercase">
                    {t('ropeHours')}
                  </span>
                  <span className="font-black text-navy-950 text-sm">
                    {tech.total_rope_hours.toLocaleString()} hrs
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-navy-100/80">
                  <span className="text-[10px] text-navy-400 font-semibold block uppercase">
                    {t('dailyRate')}
                  </span>
                  <span className="font-black text-navy-950 text-sm">
                    {formatCurrency(tech.daily_rate_sar)}
                  </span>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block">
                  {t('specializations')}
                </span>
                <div className="flex flex-wrap gap-1">
                  {(tech.specializations || []).slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-navy-50 text-[10px] font-bold text-navy-700 border border-navy-100"
                    >
                      {spec}
                    </span>
                  ))}
                  {(tech.specializations || []).length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-navy-50 text-[10px] font-bold text-navy-400">
                      +{(tech.specializations || []).length - 3}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>

            <div className="p-3 border-t border-navy-50 bg-navy-50/30 flex items-center justify-between text-xs text-navy-500 rounded-b-2xl">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {tech.performance_rating} ({tech.rating_count} jobs)
              </span>
              <span className="text-navy-400 text-[11px]">
                {t('availableFrom')}: {formatDate(tech.next_available_date)}
              </span>
            </div>
            </Card>
          ))}
        </div>
      )}

      {/* Technician Detail Modal / Drawer */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-navy-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTech(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 hover:text-navy-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile Summary Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-orange-500 shadow-orange-glow">
                <AvatarFallback className="bg-navy-900 text-white font-black text-lg">
                  {getInitials(selectedTech.profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-navy-950">
                  {selectedTech.profile.full_name}
                </h2>
                <div className="flex items-center gap-2">
                  <IrataBadge level={selectedTech.irata_level} />
                  <TechnicianStatusBadge status={selectedTech.status} />
                </div>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-navy-50 p-4 rounded-2xl border border-navy-100">
              <div>
                <span className="text-navy-400 block font-semibold">{t('irataNumber')}</span>
                <span className="font-mono font-bold text-navy-900">{selectedTech.irata_membership_no}</span>
              </div>
              <div>
                <span className="text-navy-400 block font-semibold">{t('totalRopeHoursVerified')}</span>
                <span className="font-bold text-navy-900">{selectedTech.total_rope_hours} hrs</span>
              </div>
              <div>
                <span className="text-navy-400 block font-semibold">{t('fatigueScore')}</span>
                <span className="font-bold text-emerald-700">{selectedTech.fatigue_score} / 10 ({t('fatigueNormal')})</span>
              </div>
              <div>
                <span className="text-navy-400 block font-semibold">{t('dailyRate')}</span>
                <span className="font-bold text-orange-600">{formatCurrency(selectedTech.daily_rate_sar)} / {t('perShift')}</span>
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400">
                {t('certifiedSkills')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedTech.specializations || []).map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact & Medical Details */}
            <div className="space-y-2 text-xs border-t border-navy-100 pt-4">
              <div className="flex items-center justify-between text-navy-600">
                <span className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-navy-400" />
                  {selectedTech.profile.phone || '+966 50 000 0000'}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-navy-400" />
                  {selectedTech.profile.email}
                </span>
              </div>
              <p className="text-navy-500 italic bg-white p-2.5 rounded-xl border border-navy-100">
                {t('medical')}: {selectedTech.medical_notes}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="destructive"
                className="gap-1.5 text-xs font-bold"
                onClick={async () => {
                  const targetId = selectedTech.profile?.id || selectedTech.id
                  const techName = selectedTech.profile?.full_name || 'Technician'
                  if (
                    confirm(
                      `Are you sure you want to PERMANENTLY REMOVE the account for ${techName}? This action cannot be undone.`
                    )
                  ) {
                    const toastId = toast.loading(`Removing account for ${techName}...`)
                    try {
                      const res = await fetch(`/api/admin/users/${targetId}`, {
                        method: 'DELETE',
                      })

                      let result: any = {}
                      const contentType = res.headers.get('content-type') || ''
                      if (contentType.includes('application/json')) {
                        result = await res.json()
                      } else {
                        const rawText = await res.text()
                        if (!res.ok) throw new Error(rawText || `Server returned ${res.status}`)
                      }

                      if (!res.ok) {
                        throw new Error(result.error || `Failed to remove account (${res.status})`)
                      }

                      toast.success(`Account for ${techName} has been removed.`, { id: toastId })
                      setTechnicians((prev) => prev.filter((t) => t.id !== selectedTech.id))
                      setSelectedTech(null)
                    } catch (err: any) {
                      toast.error(err.message || 'Could not delete technician account', { id: toastId })
                    }
                  }
                }}
              >
                {t('removeAccount')}
              </Button>
              <div className="flex-1 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTech(null)}
                  className="flex-1"
                >
                  {t('close')}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 shadow-orange-glow"
                  onClick={() => {
                    toast.success(`${selectedTech.profile.full_name} ${t('assignToDeployment')}`)
                    setSelectedTech(null)
                  }}
                >
                  {t('assignToDeployment')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultRole="technician"
        onUserCreated={() => loadTechnicians()}
      />
    </div>
  )
}
