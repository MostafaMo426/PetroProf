'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CreateUserModal } from '@/components/admin/CreateUserModal'
import {
  Building2,
  Trash2,
  MapPin,
  Search,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'

import type { Profile } from '@/types/database.types'

interface ClientAccount {
  id: string
  fullName: string
  email: string
  role: string
  organizationName: string
  industry: string
  city: string
  createdAt: string
}

export default function AdminOrganizationsPage() {
  const [clients, setClients] = useState<ClientAccount[]>([])
  const [search, setSearch] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadClientProfiles() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        const profiles = data as Profile[]
        setClients(
          profiles.map((p) => ({
            id: p.id,
            fullName: p.full_name,
            email: p.email,
            role: p.role,
            organizationName: 'Client Enterprise',
            industry: 'Industrial Services',
            city: 'Saudi Arabia',
            createdAt: p.created_at.split('T')[0],
          }))
        )
      } else {
        setClients([])
      }
    } catch (err) {
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientProfiles()
  }, [])

  const handleDeleteClient = async (client: ClientAccount) => {
    if (
      confirm(
        `Are you sure you want to PERMANENTLY REMOVE the client account for ${client.fullName}? This will revoke their portal access.`
      )
    ) {
      const toastId = toast.loading(`Removing account for ${client.fullName}...`)
      try {
        const res = await fetch(`/api/admin/users/${client.id}`, {
          method: 'DELETE',
        })

        let result: any = {}
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          result = await res.json()
        } else {
          const rawText = await res.text()
          if (!res.ok) throw new Error(rawText || `Server returned ${res.status}`)
        }

        if (!res.ok) throw new Error(result.error || 'Failed to delete client account')

        toast.success(`Client account for ${client.fullName} has been removed.`, { id: toastId })
        setClients((prev) => prev.filter((c) => c.id !== client.id))
      } catch (err: any) {
        toast.error(err.message || 'Could not delete account', { id: toastId })
      }
    }
  }

  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Client Accounts & Organizations"
        description="Manage registered enterprise client accounts, review corporate affiliations, and administer user access rights."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
            <Building2 className="h-3.5 w-3.5" />
            {clients.length} Registered Enterprise Clients
          </span>
        }
      >
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 text-xs font-bold shadow-orange-glow"
        >
          <UserPlus className="h-4 w-4" />
          Add Client / User Account
        </Button>
      </PageHeader>

      {/* Search Filter */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-navy-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search by client name, organization (e.g. Aramco, SABIC), or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-navy-50/60 border border-navy-100 text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Table / Empty State */}
      <Card>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-navy-50 text-navy-400 rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-950">No Client Accounts Registered</h3>
                <p className="text-xs text-navy-500 max-w-sm mx-auto">
                  Click &quot;Add Client / User Account&quot; to provision a new client organization.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="gap-1.5 text-xs font-bold shadow-orange-glow"
              >
                <UserPlus className="h-4 w-4" />
                Add First Client Account
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50/75 border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Contact Representative</th>
                    <th className="py-3 px-4">Organization Name</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950">{client.fullName}</p>
                        <p className="text-[11px] text-navy-400">{client.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-orange-600">
                        {client.organizationName}
                      </td>
                      <td className="py-3.5 px-4 text-navy-700">
                        {client.industry}
                      </td>
                      <td className="py-3.5 px-4 text-navy-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-navy-400 shrink-0" />
                          {client.city}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-navy-500">
                        {client.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClient(client)}
                          className="text-xs h-7 px-2.5 font-bold gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove Account
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultRole="client"
        onUserCreated={() => loadClientProfiles()}
      />
    </div>
  )
}
