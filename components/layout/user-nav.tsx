"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { UserRole } from "@/types/database.types"
import {
  User,
  Settings,
  LogOut,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

interface UserNavProps {
  user: {
    id: string
    email: string
    fullName: string
    role: UserRole
    avatarUrl?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success(t('navSignOut'))
      router.push("/login")
      router.refresh()
    } catch (err) {
      toast.error(t('error'))
    }
  }

  const roleLabelMap: Record<UserRole, { label: string; bg: string }> = {
    super_admin: { label: "Super Admin", bg: "bg-purple-100 text-purple-800" },
    admin: { label: "Center Admin", bg: "bg-navy-100 text-navy-800" },
    client: { label: "Client Partner", bg: "bg-orange-100 text-orange-800" },
    technician: { label: "IRATA Tech", bg: "bg-emerald-100 text-emerald-800" },
  }

  const roleInfo = roleLabelMap[user.role] || {
    label: user.role,
    bg: "bg-navy-100 text-navy-800",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
        <Avatar className="h-9 w-9 border-2 border-white shadow-sm transition-transform hover:scale-105">
          <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
          <AvatarFallback className="bg-navy-900 text-white font-bold text-xs">
            {getInitials(user.fullName || user.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-navy-950 truncate">
                {user.fullName || t('navProfile')}
              </p>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleInfo.bg}`}
              >
                {roleInfo.label}
              </span>
            </div>
            <p className="text-xs text-navy-400 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/${user.role}/profile`)}
            className="gap-2.5"
          >
            <User className="h-4 w-4 text-navy-400" />
            <span>{t('navProfile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${user.role}/settings`)}
            className="gap-2.5"
          >
            <Settings className="h-4 w-4 text-navy-400" />
            <span>{t('navSettings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${user.role}/ai-assistant`)}
            className="gap-2.5"
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span>{t('navAiAssistant')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.open("https://irata.org", "_blank")}
          className="gap-2.5 text-navy-500"
        >
          <Shield className="h-4 w-4 text-navy-400" />
          <span>IRATA International</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/support")}
          className="gap-2.5 text-navy-500"
        >
          <HelpCircle className="h-4 w-4 text-navy-400" />
          <span>{t('support')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="gap-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 font-semibold"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>{t('navSignOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
