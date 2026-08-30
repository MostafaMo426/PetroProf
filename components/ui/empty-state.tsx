import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-100 bg-white/50 p-8 text-center animate-fade-in",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 mb-4">
        <Icon className="h-8 w-8 text-navy-500" />
      </div>
      <h3 className="text-lg font-bold text-navy-950">{title}</h3>
      <p className="mt-1 text-sm text-navy-500 max-w-sm">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="primary"
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
