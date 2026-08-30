import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  irataLevelLabel,
  irataLevelShort,
  technicianStatusConfig,
  jobStatusConfig,
  riskLevelConfig,
} from "@/lib/utils"
import type {
  IrataLevel,
  TechnicianStatus,
  JobStatus,
  RiskLevel,
} from "@/types/database.types"
import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

/** IRATA level badge with color and shield icon */
export function IrataBadge({
  level,
  short = false,
}: {
  level: IrataLevel
  short?: boolean
}) {
  const variantMap: Record<IrataLevel, "irata1" | "irata2" | "irata3"> = {
    level_1: "irata1",
    level_2: "irata2",
    level_3: "irata3",
  }

  return (
    <Badge variant={variantMap[level]} className="gap-1 shadow-sm">
      <Shield className="h-3 w-3" />
      {short ? irataLevelShort(level) : irataLevelLabel(level)}
    </Badge>
  )
}

/** Technician availability status badge */
export function TechnicianStatusBadge({
  status,
}: {
  status: TechnicianStatus
}) {
  const config = technicianStatusConfig(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}

/** Job lifecycle status badge */
export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = jobStatusConfig(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-50 border border-navy-100 ${config.color}`}
    >
      <Clock className="h-3 w-3" />
      {config.label}
    </span>
  )
}

/** AI Risk assessment badge */
export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const config = riskLevelConfig(level)
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${config.className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
