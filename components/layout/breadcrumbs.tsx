"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const routeNameMap: Record<string, string> = {
  admin: "Admin Center",
  client: "Client Portal",
  technician: "Technician Hub",
  technicians: "Technician Directory",
  jobs: "Job Requests",
  compliance: "Compliance Tracker",
  logbook: "Digital Logbook",
  certificates: "Certificates",
  chat: "IRATA AI Assistant",
  quotes: "Quote Calculator",
  settings: "Settings",
  new: "New Request",
  profile: "My Profile",
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs font-medium text-navy-400", className)}
    >
      <Link
        href={`/${segments[0]}`}
        className="flex items-center gap-1 hover:text-navy-900 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const href = `/${segments.slice(0, index + 1).join("/")}`
        const displayName =
          routeNameMap[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-navy-300 shrink-0" />
            {isLast ? (
              <span className="font-bold text-navy-900 truncate max-w-[200px]">
                {displayName}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-navy-900 transition-colors truncate max-w-[150px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
