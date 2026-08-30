'use client'

import * as React from 'react'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Shield, Bell, Database, Key, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [centerName, setCenterName] = useState('PetroProf Rope Access Center Riyadh')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [autoSmsReminders, setAutoSmsReminders] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Platform operational settings saved.')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Center & Platform Settings"
        description="Configure IRATA dispatch thresholds, automated compliance SMS alerts, and center operational credentials."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-navy-100 pb-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-950">Operations & Safety Parameters</h2>
              <p className="text-xs text-navy-500">Saudi Arabia Region (Riyadh / Eastern Province)</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-navy-700 uppercase tracking-wider">Training & Dispatch Center Name</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-navy-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-navy-900 uppercase tracking-wider text-[10px]">
                Automated Safety & Expiry Notifications
              </h3>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-50 border border-navy-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 text-orange-500 rounded border-navy-300 focus:ring-orange-500"
                />
                <div>
                  <span className="font-bold text-navy-950 block">30-Day Certificate Expiry Warnings</span>
                  <span className="text-[11px] text-navy-500">Automatically notify technicians when IRATA or medical fitness renewal is approaching.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-navy-50 border border-navy-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSmsReminders}
                  onChange={(e) => setAutoSmsReminders(e.target.checked)}
                  className="h-4 w-4 text-orange-500 rounded border-navy-300 focus:ring-orange-500"
                />
                <div>
                  <span className="font-bold text-navy-950 block">High-Risk Dispatch SMS Authorization</span>
                  <span className="text-[11px] text-navy-500">Require Level 3 supervisor mobile confirmation before activating offshore deployments.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-navy-100">
            <Button type="submit" variant="primary" className="gap-2 shadow-orange-glow">
              <CheckCircle2 className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
