import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { AiAssistantChat } from '@/components/ai/AiAssistantChat'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'IRATA Safety Advisor | Client Portal',
  description: 'AI Safety Advisor for Industrial Scope Planning',
}

export default function ClientAiAssistantPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <PageHeader
        title="IRATA Safety Advisor"
        description="Verify site compliance, ask about required crew supervision ratios, and explore safe work-at-height guidelines before creating official manpower requests."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-800">
            <Sparkles className="h-3.5 w-3.5" />
            AI Engineering Advisor
          </span>
        }
      />

      <AiAssistantChat />
    </div>
  )
}
