/**
 * app/(portal)/layout.tsx
 * Server component that fetches session & profile data, then wraps children with PortalLayout.
 */
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalLayout } from "@/components/layout/portal-layout"
import type { UserRole, Profile } from "@/types/database.types"

export default async function PortalServerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, email, role, avatar_url")
    .eq("id", user.id)
    .single()

  const profile = profileData as Pick<
    Profile,
    "full_name" | "email" | "role" | "avatar_url"
  > | null

  const currentUser = {
    id: user.id,
    email: user.email || profile?.email || "",
    fullName: profile?.full_name || user.email?.split("@")[0] || "User",
    role: (profile?.role as UserRole) || "client",
    avatarUrl: profile?.avatar_url || null,
  }

  return <PortalLayout user={currentUser}>{children}</PortalLayout>
}
