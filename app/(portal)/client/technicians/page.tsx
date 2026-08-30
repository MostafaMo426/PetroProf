'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IrataBadge, TechnicianStatusBadge } from '@/components/ui/status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getTechnicians, type TechnicianWithProfile } from '@/lib/services/technicians'
import { getInitials, formatCurrency } from '@/lib/utils'
import { Search, Plus, Star, ShieldCheck, HardHat } from 'lucide-react'
import Link from 'next/link'

export default function ClientTechniciansRosterPage() {
  const [technicians, setTechnicians] = useState<TechnicianWithProfile[]>([])
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  useEffect(() => {
    getTechnicians().then(setTechnicians)
  }, [])

  const filtered = technicians.filter((t) => {
    const matchSearch =
      t.profile.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (t.specializations || []).some((s) => s.toLowerCase().includes(search.toLowerCase()))
    const matchLevel = levelFilter === 'all' || t.irata_level === levelFilter
    return matchSearch && matchLevel
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Verified Technicians Roster"
        description="Browse available IRATA Level 1, 2, and 3 certified personnel ready for industrial and offshore mobilization."
      >
        <Link href="/client/new-request">
          <Button variant="primary" className="gap-2 shadow-orange-glow">
            <Plus className="h-4 w-4" />
            Request Manpower Crew
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-navy-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search by technician skill (e.g. NDT, Glazing, Welding)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-navy-50/60 border border-navy-100 text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'level_1', 'level_2', 'level_3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
            >
              {lvl === 'all'
                ? 'All Levels'
                : lvl === 'level_1'
                ? 'Level 1'
                : lvl === 'level_2'
                ? 'Level 2'
                : 'Level 3 Supervisor'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tech) => (
          <Card key={tech.id} className="hover:border-navy-300 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-navy-100">
                    <AvatarFallback className="bg-navy-900 text-white font-bold text-sm">
                      {getInitials(tech.profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-navy-950 text-sm">
                      {tech.profile.full_name}
                    </h3>
                    <p className="text-[11px] text-navy-400 font-mono">
                      {tech.nationality} • {tech.years_experience} yrs exp
                    </p>
                  </div>
                </div>
                <TechnicianStatusBadge status={tech.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-3 text-xs">
              <div className="flex items-center justify-between py-1.5 px-3 bg-navy-50/70 rounded-xl border border-navy-100/80">
                <span className="text-navy-500 font-medium">IRATA Credential</span>
                <IrataBadge level={tech.irata_level} />
              </div>

              <div className="flex justify-between p-2 bg-white rounded-lg border border-navy-100 text-navy-700">
                <span>Verified Rope Hours</span>
                <span className="font-black text-navy-950">{tech.total_rope_hours.toLocaleString()} hrs</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block">
                  Specializations
                </span>
                <div className="flex flex-wrap gap-1">
                  {(tech.specializations || []).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-navy-50 text-[10px] font-bold text-navy-700 border border-navy-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <div className="p-3 border-t border-navy-50 bg-navy-50/30 flex items-center justify-between text-xs rounded-b-2xl">
              <span className="flex items-center gap-1 font-bold text-emerald-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {tech.performance_rating} ({tech.rating_count} jobs)
              </span>
              <span className="text-orange-600 font-bold">
                {formatCurrency(tech.daily_rate_sar)} / shift
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
