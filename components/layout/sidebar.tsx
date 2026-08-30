"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/database.types"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  BookOpen,
  Award,
  Sparkles,
  Calculator,
  QrCode,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  FileSpreadsheet,
  AlertOctagon,
} from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "default" | "orange" | "warning" | "success"
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

const roleNavConfig: Record<UserRole, SidebarGroup[]> = {
  super_admin: [
    {
      label: "Platform Command",
      items: [
        { title: "Dispatch Overview", href: "/admin", icon: LayoutDashboard },
        { title: "Live Deployments", href: "/admin/deployments", icon: Layers, badge: "Live", badgeVariant: "success" },
        { title: "Technicians Directory", href: "/admin/technicians", icon: Users },
        { title: "Client Organizations", href: "/admin/organizations", icon: Briefcase },
        { title: "Job Requests & Quotes", href: "/admin/jobs", icon: FileSpreadsheet, badge: "3 New", badgeVariant: "orange" },
      ],
    },
    {
      label: "Safety & Intelligence",
      items: [
        { title: "Compliance Tracker", href: "/admin/compliance", icon: ShieldCheck, badge: "4 Expiries", badgeVariant: "warning" },
        { title: "IRATA AI Assistant", href: "/admin/ai-assistant", icon: Sparkles },
        { title: "Dynamic Quoting Engine", href: "/admin/quoting", icon: Calculator },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Audit Trail", href: "/admin/audit", icon: AlertOctagon },
        { title: "Platform Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  admin: [
    {
      label: "Dispatch Operations",
      items: [
        { title: "Overview", href: "/admin", icon: LayoutDashboard },
        { title: "Technicians Directory", href: "/admin/technicians", icon: Users },
        { title: "Job Requests", href: "/admin/jobs", icon: Briefcase, badge: "3 New", badgeVariant: "orange" },
        { title: "Live Deployments", href: "/admin/deployments", icon: Layers },
      ],
    },
    {
      label: "Safety & Compliance",
      items: [
        { title: "Compliance Tracker", href: "/admin/compliance", icon: ShieldCheck, badge: "4 Alert", badgeVariant: "warning" },
        { title: "IRATA Safety AI", href: "/admin/ai-assistant", icon: Sparkles },
        { title: "Quoting Calculator", href: "/admin/quoting", icon: Calculator },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Center Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  client: [
    {
      label: "Client Hub",
      items: [
        { title: "Client Dashboard", href: "/client", icon: LayoutDashboard },
        { title: "Request Manpower", href: "/client/new-request", icon: Sparkles, badge: "AI Powered", badgeVariant: "orange" },
        { title: "Active Projects", href: "/client/projects", icon: Briefcase },
        { title: "Technicians Roster", href: "/client/technicians", icon: Users },
      ],
    },
    {
      label: "Safety & Quotes",
      items: [
        { title: "Dynamic Price Estimator", href: "/client/calculator", icon: Calculator },
        { title: "IRATA AI Safety Advisor", href: "/client/ai-assistant", icon: Sparkles },
        { title: "Compliance & Safety Docs", href: "/client/compliance", icon: ShieldCheck },
      ],
    },
    {
      label: "Organization",
      items: [
        { title: "Company Profile", href: "/client/settings", icon: Settings },
      ],
    },
  ],
  technician: [
    {
      label: "Technician Hub",
      items: [
        { title: "My Dashboard", href: "/technician", icon: LayoutDashboard },
        { title: "Digital Logbook", href: "/technician/logbook", icon: BookOpen, badge: "QR Sync", badgeVariant: "success" },
        { title: "QR Verification", href: "/technician/qr-verify", icon: QrCode },
        { title: "My Certifications", href: "/technician/certificates", icon: Award, badge: "AI OCR", badgeVariant: "orange" },
        { title: "Job Deployments", href: "/technician/jobs", icon: Briefcase },
      ],
    },
    {
      label: "Safety Assistant",
      items: [
        { title: "IRATA Guidelines AI", href: "/technician/ai-assistant", icon: Sparkles },
        { title: "Safety Checklist", href: "/technician/checklist", icon: ShieldCheck },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Profile & IQAMA", href: "/technician/profile", icon: Settings },
      ],
    },
  ],
}

interface SidebarProps {
  role: UserRole
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function Sidebar({
  role,
  collapsed = false,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const pathname = usePathname()
  const groups = roleNavConfig[role] || roleNavConfig.client

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-navy-800 bg-navy-950 text-white transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-72",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-900">
        <Link
          href={`/${role}`}
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-gradient shadow-orange-glow transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 text-white fill-white/20" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                PetroProf
                <span className="rounded-md bg-orange-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-orange-400 border border-orange-500/30">
                  IRATA
                </span>
              </span>
              <span className="text-[10px] font-semibold text-navy-400 uppercase tracking-widest truncate">
                Rope Access SaaS
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {groups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-navy-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${role}` && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 group relative",
                      isActive
                        ? "bg-orange-gradient text-white shadow-orange-glow font-bold"
                        : "text-navy-300 hover:bg-navy-900 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-navy-400 group-hover:text-orange-400"
                      )}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                          item.badgeVariant === "orange" && "bg-orange-500 text-white",
                          item.badgeVariant === "warning" && "bg-yellow-400 text-navy-950",
                          item.badgeVariant === "success" && "bg-emerald-500 text-white",
                          !item.badgeVariant && "bg-navy-800 text-navy-200"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Standard Badge Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-navy-900/90 border border-navy-800/80 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-[11px]">
              IRATA ICOP Compliant
            </span>
          </div>
          <p className="text-[10px] text-navy-400 leading-tight">
            Saudi Industrial Safety & Height Regulations verified.
          </p>
        </div>
      ) : (
        <div className="p-3 text-center">
          <div className="h-2.5 w-2.5 mx-auto rounded-full bg-emerald-400 animate-pulse" title="IRATA Compliant" />
        </div>
      )}
    </aside>
  )
}
