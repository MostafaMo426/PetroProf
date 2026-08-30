'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  Loader2,
  HelpCircle,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: `👋 **Marhaban! I am Saeed AI**, your dedicated IRATA Level 3 Safety Advisor & Engineering Assistant.

Ask me about:
- **IRATA ICOP 2024 standards** & mandatory crew ratios
- **Minimum anchor loads (15kN / 22kN)** and Y-hang angle calculations
- **Saudi Aramco / SABIC high-risk permits** and flare stack safety
- **Emergency rescue plans** & suspension trauma prevention`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]

const QUICK_PROMPTS = [
  'What is the minimum anchor load for 2-person rescue?',
  'Saudi high-wind threshold for open rigging',
  'IRATA Level 3 mandatory supervision ratio',
  'Figure-8 loop vs Alpine Butterfly knot efficiency',
]

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate answer')

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      toast.error(err.message || 'Error communicating with AI Assistant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[700px] border-navy-100 shadow-2xl overflow-hidden bg-white">
      {/* Chat Header */}
      <CardHeader className="bg-navy-900 text-white p-4 sm:p-5 flex flex-row items-center justify-between border-b border-navy-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-gradient flex items-center justify-center shadow-orange-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-white">
                Saeed AI — IRATA Safety Advisor
              </CardTitle>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black border border-orange-500/30">
                Gemini 1.5 Flash
              </span>
            </div>
            <CardDescription className="text-xs text-navy-300">
              IRATA ICOP 2024 & Saudi Industrial Safety Standards
            </CardDescription>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="text-navy-300 hover:text-white hover:bg-navy-800 text-xs gap-1.5"
          title="Reset conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </CardHeader>

      {/* Messages Scroll Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-navy-50/30 text-xs">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start animate-fade-in ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="h-8 w-8 rounded-xl bg-orange-gradient flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-1 shadow-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white text-navy-950 border border-navy-100'
                    : 'bg-navy-900 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.content}
                </div>
                <div
                  className={`text-[10px] text-right font-mono ${
                    isAssistant ? 'text-navy-400' : 'text-navy-300'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
              {!isAssistant && (
                <div className="h-8 w-8 rounded-xl bg-navy-800 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          )
        })}

        {loading && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div className="h-8 w-8 rounded-xl bg-orange-gradient flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border border-navy-100 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-navy-600 text-xs font-semibold">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              Saeed AI is analyzing IRATA ICOP standards...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-white border-t border-navy-100 overflow-x-auto flex gap-2 shrink-0">
        <span className="text-[10px] font-bold uppercase text-navy-400 self-center px-1 shrink-0 flex items-center gap-1">
          <Zap className="h-3 w-3 text-orange-500" /> Quick:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-navy-50 hover:bg-orange-50 hover:text-orange-800 text-navy-700 text-xs font-semibold border border-navy-100 transition-colors whitespace-nowrap shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-navy-100 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Saeed AI about rigging loads, safety ratios, or Aramco permit standards..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={loading}
          className="flex-1 h-11 px-4 rounded-xl bg-navy-50/70 border border-navy-200 text-xs text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
        <Button
          variant="primary"
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className="h-11 px-5 shadow-orange-glow shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  )
}
