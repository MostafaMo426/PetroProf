import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: {
    value: string
    isPositive: boolean
    label: string
  }
  badge?: {
    text: string
    variant?: "default" | "warning" | "orange" | "success"
  }
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-orange-500",
  iconBg = "bg-orange-50",
  trend,
  badge,
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-navy-100 bg-white transition-all duration-200 hover:border-navy-200 hover:shadow-card-hover",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-navy-950 tracking-tight">
                {value}
              </h3>
              {badge && (
                <span className="inline-flex items-center rounded-md bg-navy-50 px-2 py-0.5 text-[10px] font-bold text-navy-700">
                  {badge.text}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-navy-500 font-medium">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105",
              iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        {trend && (
          <div className="mt-4 flex items-center gap-1.5 border-t border-navy-50 pt-3 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-bold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
            <span className="text-navy-400">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
