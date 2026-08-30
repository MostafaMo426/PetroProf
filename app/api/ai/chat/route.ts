import { NextResponse, type NextRequest } from 'next/server'
import { genAI, GEMINI_MODEL, isGeminiConfigured, IRATA_SYSTEM_PROMPT } from '@/lib/ai/gemini'

export async function POST(request: NextRequest) {
  try {
    const { messages, query } = await request.json()

    const userQuery = query || messages?.[messages.length - 1]?.content

    if (!userQuery) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 })
    }

    // 1. If Gemini is configured, use Gemini 1.5 Flash Chat
    if (isGeminiConfigured && genAI) {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: IRATA_SYSTEM_PROMPT,
      })

      // Format conversation history for Gemini
      const chat = model.startChat({
        history: (messages || []).slice(0, -1).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      })

      const result = await chat.sendMessage(userQuery)
      const reply = result.response.text()

      return NextResponse.json({
        success: true,
        reply,
        source: 'gemini-1.5-flash',
      })
    }

    // 2. Intelligent Rule-Based Safety Knowledge Engine (Offline Fallback)
    const lower = userQuery.toLowerCase()
    let reply = ''

    if (lower.includes('anchor') || lower.includes('strength') || lower.includes('kn')) {
      reply = `### ⚓ IRATA ICOP Anchor Point Specifications:
1. **Minimum Static Strength**: Each anchor point must withstand a minimum load of **15 kN** for a single-person working system (per IRATA ICOP 2.11.2).
2. **Two-Person Rescue Anchor**: Must withstand at least **22 kN** if utilized for accompanied descent rescue.
3. **Redundancy Requirement**: Working lines and safety backup lines must be attached to **independent anchor points** (or an equalized Y-hang system with an angle under 90°).
4. **Structural Verification**: In Saudi industrial plants (e.g. Aramco / SABIC), anchor bolts must possess certified non-destructive test (NDT) pull-test logs within the last 12 months.`
    } else if (lower.includes('wind') || lower.includes('weather') || lower.includes('storm')) {
      reply = `### 🌪️ Saudi Industrial Wind & Weather Thresholds:
1. **Cease Work Limit**: General rope access rigging must cease when steady wind speeds exceed **25 knots (46 km/h / 28 mph)** or gusts exceed **30 knots**.
2. **Cladding & Large Panels**: Work with sails/cladding panels must stop at **15 knots** due to aerodynamic drag on suspended technicians.
3. **Extreme Heat Index**: In summer months (Eastern Province / Yanbu), when temperatures exceed **45°C**, technicians are restricted to a maximum of 45 minutes on-rope followed by 15 minutes of mandatory shade hydration.`
    } else if (lower.includes('supervis') || lower.includes('ratio') || lower.includes('l3')) {
      reply = `### 👷 IRATA Supervision & Crew Composition Rules:
1. **Mandatory Level 3 Lead**: Under IRATA ICOP section 2.5.2, **every rope access team must be directly supervised on-site by a currently certified IRATA Level 3 Safety Supervisor**.
2. **Supervision Ratio**: Maximum recommended ratio is **1 Level 3 Supervisor per 4 to 6 technicians**, depending on site complexity.
3. **Rescue Readiness**: The Level 3 supervisor must be capable of initiating and executing a full mechanical advantage or accompaniment rescue within **5 minutes** of any incident.`
    } else {
      reply = `### 📋 IRATA Safety Protocol Guidance:
Regarding your query on *"${userQuery}"*:

1. **Dual Protection Rule**: Never disconnect from a working system without first ensuring your secondary backup device (e.g. Petzl ASAP Lock) is locked onto an independent safety line.
2. **Pre-Use Inspection**: All hardware (descenders, chest ascenders, carabiners) and dynamic cowstails must be checked for distortion, chemical etching, and gate locking.
3. **Permit to Work (PTW)**: Ensure high-altitude work permits are signed by the Saudi Aramco/SABIC area authority prior to rigging.

Feel free to ask about specific knot efficiencies (Figure-8 vs Alpine Butterfly), rigging angles, or rescue procedures!`
    }

    return NextResponse.json({
      success: true,
      reply,
      source: 'petroprof-safety-kb',
    })
  } catch (err: any) {
    console.error('[AI Chat Error]', err)
    return NextResponse.json(
      { error: err.message || 'Error processing AI conversation' },
      { status: 500 }
    )
  }
}
