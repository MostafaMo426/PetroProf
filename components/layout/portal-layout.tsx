"use client"

import * as React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { AnimatedTechnician } from "@/components/ui/animated-technician"
import type { UserRole } from "@/types/database.types"
import { cn } from "@/lib/utils"

interface PortalLayoutProps {
  user: {
    id: string
    email: string
    fullName: string
    role: UserRole
    avatarUrl?: string | null
  }
  children: React.ReactNode
}

export function PortalLayout({ user, children }: PortalLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col antialiased relative">
      {/* Animated Rope Access Technician (Scroll Driven) */}
      <AnimatedTechnician />

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <Sidebar
          role={user.role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          className="hidden md:flex min-h-screen sticky top-0"
        />

        {/* Mobile Drawer Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden flex",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar
            role={user.role}
            collapsed={false}
            className="w-72 shadow-2xl h-full"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav user={user} onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in pe-6 lg:pe-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
