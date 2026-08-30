import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { AiAssistantChat } from '@/components/ai/AiAssistantChat'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'IRATA Safety AI | Technician Hub',
  description: 'AI Field Safety Assistant for Rope Access Technicians',
}

export default function TechnicianAiAssistantPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="Field Safety & Rigging AI Assistant"
        description="Instant answers to rigging angle limits, knot friction loss, Level 3 progression requirements, and emergency rescue step-by-step procedures."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
            <Sparkles className="h-3.5 w-3.5" />
            Field AI Assistant
          </span>
        }
      />

      <AiAssistantChat />
    </div>
  )
}
