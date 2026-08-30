"use client"

import * as React from "react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  FileCheck2,
  Briefcase,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import type { Notification, NotificationType } from "@/types/database.types"
import { toast } from "sonner"

interface NotificationCenterProps {
  initialNotifications?: Notification[]
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    recipient_id: "user-1",
    type: "cert_expiry_warning",
    title: "IRATA Level 3 Recertification Due",
    body: "Technician Tariq Al-Ghamdi's IRATA Level 3 certificate expires in 28 days. Action required.",
    action_url: "/admin/compliance",
    metadata: { urgency: "urgent", daysLeft: 28 },
    is_read: false,
    read_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "notif-2",
    recipient_id: "user-1",
    type: "job_status_update",
    title: "New Job Request from Saudi Aramco",
    body: "Manpower requested for Offshore Rig Flare Tip Replacement (5 Technicians required).",
    action_url: "/admin/jobs",
    metadata: { job_number: "PR-2026-0042" },
    is_read: false,
    read_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "notif-3",
    recipient_id: "user-1",
    type: "logbook_verified",
    title: "Logbook Hours Approved (8.5 hrs)",
    body: "Supervisor verified rope hours at Yanbu Petrochemical Flare Stack #4 via QR scan.",
    action_url: "/technician/logbook",
    metadata: {},
    is_read: true,
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export function NotificationCenter({
  initialNotifications = mockNotifications,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  )
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
    )
    toast.success("All notifications marked as read")
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "cert_expiry_warning":
      case "medical_expiry_warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "logbook_verified":
        return <FileCheck2 className="h-4 w-4 text-emerald-500" />
      case "job_status_update":
      case "crew_assignment":
        return <Briefcase className="h-4 w-4 text-orange-500" />
      default:
        return <Sparkles className="h-4 w-4 text-navy-500" />
    }
  }

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.is_read : true
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-navy-700 hover:bg-navy-100/70"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 sm:w-96 p-0 shadow-2xl border-navy-100"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-100 p-4 bg-navy-50/50">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-navy-950 text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 border-b border-navy-100 p-2 bg-white">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
              filter === "all"
                ? "bg-navy-900 text-white"
                : "text-navy-500 hover:bg-navy-50"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-lg transition-colors",
              filter === "unread"
                ? "bg-navy-900 text-white"
                : "text-navy-500 hover:bg-navy-50"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-navy-50">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-navy-400 text-sm">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-navy-700">All caught up!</p>
              <p className="text-xs text-navy-400 mt-0.5">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "p-3.5 transition-colors cursor-pointer hover:bg-navy-50/70 flex items-start gap-3",
                  !notif.is_read && "bg-orange-50/30"
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-navy-100 shadow-sm">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        "text-xs truncate",
                        !notif.is_read
                          ? "font-bold text-navy-950"
                          : "font-medium text-navy-700"
                      )}
                    >
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-navy-400 shrink-0">
                      {formatDate(notif.created_at, {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed">
                    {notif.body}
                  </p>
                </div>
                {!notif.is_read && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-navy-100 p-2.5 text-center bg-navy-50/50">
          <a
            href="/notifications"
            className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-orange-600 transition-colors"
          >
            View all alerts & history
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
