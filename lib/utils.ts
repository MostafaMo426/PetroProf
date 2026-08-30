/**
 * lib/utils.ts
 * Shared utility functions for PetroProf Portal.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IrataLevel, TechnicianStatus, JobStatus, RiskLevel } from '@/types/database.types'

/** shadcn/ui cn() — merges Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date string to locale-aware display */
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-SA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

/** Format currency in SAR with locale */
export function formatCurrency(amount: number | null | undefined, currency = 'SAR'): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Get days until a date (negative = already expired) */
export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/** Map IRATA level enum to human-readable label */
export function irataLevelLabel(level: IrataLevel): string {
  const map: Record<IrataLevel, string> = {
    level_1: 'Level 1 — Technician',
    level_2: 'Level 2 — Technician',
    level_3: 'Level 3 — Supervisor',
  }
  return map[level]
}

/** Map IRATA level to short display */
export function irataLevelShort(level: IrataLevel): string {
  return { level_1: 'L1', level_2: 'L2', level_3: 'L3' }[level]
}

/** Map technician status to display config */
export function technicianStatusConfig(status: TechnicianStatus) {
  const configs: Record<TechnicianStatus, { label: string; className: string }> = {
    available:      { label: 'Available',       className: 'badge-available' },
    deployed:       { label: 'Deployed',        className: 'badge-deployed' },
    on_leave:       { label: 'On Leave',        className: 'badge-pending' },
    in_training:    { label: 'In Training',     className: 'badge-pending' },
    inactive:       { label: 'Inactive',        className: 'badge-expired' },
    pending_review: { label: 'Pending Review',  className: 'badge-warning' },
  }
  return configs[status]
}

/** Map job status to display config */
export function jobStatusConfig(status: JobStatus) {
  const configs: Record<JobStatus, { label: string; color: string }> = {
    draft:          { label: 'Draft',           color: 'text-muted-foreground' },
    submitted:      { label: 'Submitted',       color: 'text-blue-600' },
    ai_assessed:    { label: 'AI Assessed',     color: 'text-purple-600' },
    quoted:         { label: 'Quoted',          color: 'text-orange-600' },
    approved:       { label: 'Approved',        color: 'text-green-600' },
    crew_assigned:  { label: 'Crew Assigned',   color: 'text-teal-600' },
    in_progress:    { label: 'In Progress',     color: 'text-blue-700' },
    completed:      { label: 'Completed',       color: 'text-green-700' },
    cancelled:      { label: 'Cancelled',       color: 'text-red-600' },
    disputed:       { label: 'Disputed',        color: 'text-red-700' },
  }
  return configs[status]
}

/** Map risk level to display config */
export function riskLevelConfig(level: RiskLevel) {
  const configs: Record<RiskLevel, { label: string; className: string; icon: string }> = {
    low:      { label: 'Low Risk',      className: 'badge-available', icon: '🟢' },
    medium:   { label: 'Medium Risk',   className: 'badge-warning',   icon: '🟡' },
    high:     { label: 'High Risk',     className: 'badge-urgent',    icon: '🟠' },
    critical: { label: 'Critical Risk', className: 'badge-critical',  icon: '🔴' },
  }
  return configs[level]
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
