"use client"

import * as React from "react"
import { useState } from "react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { NotificationCenter } from "@/components/layout/notification-center"
import { UserNav } from "@/components/layout/user-nav"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Search,
  Sparkles,
  Command,
  Plus,
  ShieldCheck,
} from "lucide-react"
import type { UserRole } from "@/types/database.types"
import Link from "next/link"

interface TopNavProps {
  user: {
    id: string
    email: string
    fullName: string
    role: UserRole
    avatarUrl?: string | null
  }
  onMenuClick?: () => void
}

export function TopNav({ user, onMenuClick }: TopNavProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-navy-100 bg-white/95 px-4 sm:px-6 backdrop-blur-md transition-all">
      {/* Left: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden text-navy-800"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Universal Search & AI Shortcut */}
      <div className="flex items-center gap-2 max-w-md w-full mx-4 hidden lg:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search technicians, jobs, certifications, or IRATA standards... (⌘K)"
            className="w-full h-9 pl-9 pr-12 rounded-xl bg-navy-50/80 border border-navy-100 text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-navy-400 border border-navy-200 shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick CTA, Notifications, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Role Quick Action Button */}
        {user.role === "client" && (
          <Link href="/client/new-request">
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Request Crew
            </Button>
          </Link>
        )}

        {user.role === "admin" && (
          <Link href="/admin/quoting">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-600" />
              AI Quoting
            </Button>
          </Link>
        )}

        {user.role === "technician" && (
          <Link href="/technician/logbook">
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Log Hours
            </Button>
          </Link>
        )}

        {/* AI Assistant Quick Link */}
        <Link
          href={`/${user.role}/ai-assistant`}
          title="IRATA Safety AI"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-orange-500" />
        </Link>

        {/* Notification Center Popover */}
        <NotificationCenter />

        {/* Language Switcher (EN / العربية) */}
        <LanguageToggle />

        <div className="h-6 w-px bg-navy-100 mx-0.5" />

        {/* User Navigation Dropdown */}
        <UserNav user={user} />
      </div>
    </header>
  )
}
