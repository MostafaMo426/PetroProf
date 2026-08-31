'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { AlertOctagon, ShieldCheck, UserCheck, Key, Shield } from 'lucide-react'

interface AuditLogEntry {
  id: string
  action: string
  target: string
  actor: string
  ip: string
  timestamp: string
}

export default function AdminAuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAuditTrail() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('audit_log')
          .select('*, actor:profiles!actor_id(full_name)')
          .order('created_at', { ascending: false })
          .limit(50)

        if (data && data.length > 0) {
          setAuditLogs(
            data.map((log: any) => ({
              id: log.id,
              action: log.action || 'System Event',
              target: log.entity_type ? `${log.entity_type} (${log.entity_id || ''})` : 'System Entity',
              actor: log.actor?.full_name || 'System Admin',
              ip: log.ip_address || '127.0.0.1',
              timestamp: new Date(log.created_at).toLocaleString(),
            }))
          )
        } else {
          setAuditLogs([])
        }
      } catch (err) {
        setAuditLogs([])
      } finally {
        setLoading(false)
      }
    }

    loadAuditTrail()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="Platform Audit Trail & Security Log"
        description="Immutable timestamped record of administrative actions, user creation, quote authorizations, and safety compliance audits."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-bold text-navy-800">
            <AlertOctagon className="h-3.5 w-3.5" />
            {auditLogs.length} Logged Events
          </span>
        }
      />

      <Card>
        <CardContent className="p-0">
          {auditLogs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 bg-navy-50 text-navy-400 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-950">Security Audit Log Active</h3>
                <p className="text-xs text-navy-500 max-w-sm mx-auto">
                  Administrative activities and security operations will be logged here automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50/75 border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Event / Action</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Authorized Actor</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-blue-600 bg-blue-50">
                            <Shield className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-bold text-navy-950">{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-navy-700 font-medium">{log.target}</td>
                      <td className="py-3.5 px-4 text-navy-600">{log.actor}</td>
                      <td className="py-3.5 px-4 font-mono text-navy-400">{log.ip}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-navy-500">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
