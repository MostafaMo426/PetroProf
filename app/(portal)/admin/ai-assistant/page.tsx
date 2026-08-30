import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { AiAssistantChat } from '@/components/ai/AiAssistantChat'
import { Sparkles, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'IRATA Safety AI Assistant | PetroProf Admin',
  description: 'AI Safety Advisor for Industrial Rope Access Operations',
}

export default function AdminAiAssistantPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="IRATA Safety & Engineering AI"
        description="Instant consultation on IRATA International Code of Practice (ICOP), anchor load calculations, and Saudi Aramco high-risk safety requirements."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
            <Sparkles className="h-3.5 w-3.5" />
            Gemini 1.5 Flash
          </span>
        }
      />

      <AiAssistantChat />
    </div>
  )
}
