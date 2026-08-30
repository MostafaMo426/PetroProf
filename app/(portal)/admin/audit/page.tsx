import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertOctagon, ShieldCheck, UserCheck, Trash2, Edit3, Key } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Platform Audit Trail | PetroProf Command',
  description: 'Immutable Audit Log of System Actions, Roster Dispatches, and Security Events',
}

export default function AdminAuditTrailPage() {
  const auditLogs = [
    {
      id: 'aud-001',
      action: 'Account Created',
      target: 'Tariq Al-Ghamdi (Technician PP-T0142)',
      actor: 'Admin System',
      ip: '10.0.4.12',
      timestamp: '2026-08-30 16:24:10',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'aud-002',
      action: 'Quote Authorized',
      target: 'Job PR-2026-0041 (Saudi Aramco)',
      actor: 'Center Admin',
      ip: '192.168.1.45',
      timestamp: '2026-08-30 14:15:32',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'aud-003',
      action: 'Compliance Verification',
      target: 'Medical Fitness (Hassan Al-Zahrani)',
      actor: 'Safety Officer',
      ip: '10.0.2.88',
      timestamp: '2026-08-30 11:05:19',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'aud-004',
      action: 'Role Elevated',
      target: 'Super Admin Privileges Activated',
      actor: 'System Root',
      ip: '127.0.0.1',
      timestamp: '2026-08-30 09:00:00',
      icon: Key,
      color: 'text-orange-600 bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="Platform Audit Trail & Security Log"
        description="Immutable timestamped record of administrative actions, user creation, quote authorizations, and safety compliance audits."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-bold text-navy-800">
            <AlertOctagon className="h-3.5 w-3.5" />
            Security Log
          </span>
        }
      />

      <Card>
        <CardContent className="p-0">
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
                {auditLogs.map((log) => {
                  const Icon = log.icon
                  return (
                    <tr key={log.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${log.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-bold text-navy-950">{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-navy-700 font-medium">{log.target}</td>
                      <td className="py-3.5 px-4 text-navy-600">{log.actor}</td>
                      <td className="py-3.5 px-4 font-mono text-navy-400">{log.ip}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-navy-500">{log.timestamp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
