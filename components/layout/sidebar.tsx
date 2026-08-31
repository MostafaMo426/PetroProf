"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/database.types"
import { useLanguage } from "@/lib/i18n/context"
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
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  FileSpreadsheet,
  AlertOctagon,
} from "lucide-react"

interface SidebarItem {
  titleKey: string
  href: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "default" | "orange" | "warning" | "success"
}

interface SidebarGroup {
  labelKey: string
  items: SidebarItem[]
}

const roleNavConfig: Record<UserRole, SidebarGroup[]> = {
  super_admin: [
    {
      labelKey: "platformCommand",
      items: [
        { titleKey: "dispatchOverview", href: "/admin", icon: LayoutDashboard },
        { titleKey: "liveDeployments", href: "/admin/deployments", icon: Layers, badge: "Live", badgeVariant: "success" },
        { titleKey: "techniciansDirectory", href: "/admin/technicians", icon: Users },
        { titleKey: "clientOrganizations", href: "/admin/organizations", icon: Briefcase },
        { titleKey: "jobRequestsAndQuotes", href: "/admin/jobs", icon: FileSpreadsheet },
      ],
    },
    {
      labelKey: "safetyAndIntelligence",
      items: [
        { titleKey: "complianceTracker", href: "/admin/compliance", icon: ShieldCheck },
        { titleKey: "irataAiAssistant", href: "/admin/ai-assistant", icon: Sparkles },
        { titleKey: "dynamicQuotingEngine", href: "/admin/quoting", icon: Calculator },
      ],
    },
    {
      labelKey: "system",
      items: [
        { titleKey: "auditTrail", href: "/admin/audit", icon: AlertOctagon },
        { titleKey: "platformSettings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  admin: [
    {
      labelKey: "dispatchOperations",
      items: [
        { titleKey: "overview", href: "/admin", icon: LayoutDashboard },
        { titleKey: "techniciansDirectory", href: "/admin/technicians", icon: Users },
        { titleKey: "jobRequests", href: "/admin/jobs", icon: Briefcase },
        { titleKey: "liveDeployments", href: "/admin/deployments", icon: Layers },
      ],
    },
    {
      labelKey: "safetyAndCompliance",
      items: [
        { titleKey: "complianceTracker", href: "/admin/compliance", icon: ShieldCheck },
        { titleKey: "safetyAiAdvisor", href: "/admin/ai-assistant", icon: Sparkles },
        { titleKey: "quotingCalculator", href: "/admin/quoting", icon: Calculator },
      ],
    },
    {
      labelKey: "management",
      items: [
        { titleKey: "centerSettings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
  client: [
    {
      labelKey: "clientHub",
      items: [
        { titleKey: "clientDashboard", href: "/client", icon: LayoutDashboard },
        { titleKey: "requestManpower", href: "/client/new-request", icon: Sparkles, badge: "AI", badgeVariant: "orange" },
        { titleKey: "activeProjects", href: "/client/projects", icon: Briefcase },
        { titleKey: "techniciansRoster", href: "/client/technicians", icon: Users },
      ],
    },
    {
      labelKey: "safetyAndQuotes",
      items: [
        { titleKey: "dynamicPriceEstimator", href: "/client/calculator", icon: Calculator },
        { titleKey: "irataAiSafetyAdvisor", href: "/client/ai-assistant", icon: Sparkles },
        { titleKey: "complianceSafetyDocs", href: "/client/compliance", icon: ShieldCheck },
      ],
    },
    {
      labelKey: "organization",
      items: [
        { titleKey: "companyProfile", href: "/client/settings", icon: Settings },
      ],
    },
  ],
  technician: [
    {
      labelKey: "technicianHub",
      items: [
        { titleKey: "myDashboard", href: "/technician", icon: LayoutDashboard },
        { titleKey: "digitalLogbook", href: "/technician/logbook", icon: BookOpen, badge: "QR", badgeVariant: "success" },
        { titleKey: "qrVerification", href: "/technician/qr-verify", icon: QrCode },
        { titleKey: "myCertifications", href: "/technician/certificates", icon: Award, badge: "AI", badgeVariant: "orange" },
        { titleKey: "jobDeployments", href: "/technician/jobs", icon: Briefcase },
      ],
    },
    {
      labelKey: "safetyAssistant",
      items: [
        { titleKey: "irataGuidelinesAi", href: "/technician/ai-assistant", icon: Sparkles },
        { titleKey: "safetyChecklist", href: "/technician/checklist", icon: ShieldCheck },
      ],
    },
    {
      labelKey: "account",
      items: [
        { titleKey: "profileAndIqama", href: "/technician/profile", icon: Settings },
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
  const { t, isRTL } = useLanguage()
  const groups = roleNavConfig[role] || roleNavConfig.client

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-navy-800 bg-navy-950 text-white transition-all duration-300 z-30",
        isRTL && "border-r-0 border-l border-navy-800",
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
                {t('brandName')}
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
            title={collapsed ? t('expandSidebar') : t('collapseSidebar')}
          >
            {collapsed ? (
              isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
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
                {t(group.labelKey as any)}
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
                    title={collapsed ? t(item.titleKey as any) : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 group relative",
                      isRTL && "flex-row-reverse text-right",
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
                      <span className="flex-1 truncate">{t(item.titleKey as any)}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                          isRTL && "ml-0 mr-auto",
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

      {/* IRATA Safety Badge Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-navy-900/90 border border-navy-800/80 text-xs">
          <div className={cn("flex items-center gap-2 mb-1.5", isRTL && "flex-row-reverse")}>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-[11px]">
              {t('irataCompliant')}
            </span>
          </div>
          <p className={cn("text-[10px] text-navy-400 leading-tight", isRTL && "text-right")}>
            {t('saudiSafetyVerified')}
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
