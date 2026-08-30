'use client'

import * as React from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/context'

export function AnimatedTechnician() {
  const { scrollYProgress } = useScroll()
  const { isRTL } = useLanguage()

  // Physics-based spring smoothing for realistic descent inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  // Map scroll (0 -> 1) to vertical position (from 4% down to 88%)
  const y = useTransform(smoothProgress, [0, 1], ['4%', '88%'])

  // Subtle natural swing/sway as technician descends (mirrored in RTL)
  const rotate = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    isRTL ? [0, 3, -2, 2, 0] : [0, -3, 2, -2, 0]
  )

  // Dynamic simulated altitude/elevation reading (120m to 10m)
  const altitude = useTransform(smoothProgress, (val) => Math.round((1 - val) * 120 + 10))

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 bottom-0 w-12 pointer-events-none z-50 hidden md:flex flex-col items-center justify-between transition-all duration-300 ${
        isRTL ? 'left-3 lg:left-5' : 'right-3 lg:right-5'
      }`}
    >
      {/* Top Anchor Rigging Point */}
      <div className="pt-2 flex flex-col items-center">
        <div className="w-3 h-4 rounded-t-full border-2 border-orange-500 bg-navy-900 shadow-sm" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 -mt-0.5" />
      </div>

      {/* Vertical Dual Rope Line */}
      <div className="relative w-full h-full flex justify-center">
        {/* Working Line (Navy / Slate with hash pattern) */}
        <div className="w-[2px] h-full bg-navy-300/80 shadow-xs relative">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/40 via-transparent to-orange-500/20" />
        </div>
        {/* Backup Safety Line (Secondary parallel rope) */}
        <div className={`w-[1.5px] h-full bg-orange-400/40 ${isRTL ? 'mr-1' : 'ml-1'}`} />

        {/* Animated Rope Access Technician */}
        <motion.div
          style={{ top: y, rotate }}
          className={`absolute left-1/2 -translate-x-[55%] flex items-center gap-1.5 will-change-transform ${
            isRTL ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* SVG Silhouette & Detail of Rope Access Tech (Mirrored when RTL) */}
          <div className={`relative transition-transform duration-300 ${isRTL ? 'scale-x-[-1]' : ''}`}>
            <svg
              width="44"
              height="56"
              viewBox="0 0 44 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-md"
            >
              {/* Ascender / Carabiner attached to rope */}
              <rect x="21" y="2" width="3" height="7" rx="1.5" fill="#FF6B00" />
              <path d="M22.5 8L20 18" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />

              {/* Safety Helmet (Industrial Yellow / Orange) */}
              <ellipse cx="19" cy="13" rx="6" ry="4.5" fill="#FFB800" />
              <path
                d="M13 14C13 10.5 15.5 8 19 8C22.5 8 25 10.5 25 14H13Z"
                fill="#FF6B00"
              />
              {/* Head Lamp Beam */}
              <polygon points="24,12 36,9 36,15" fill="rgba(255, 215, 0, 0.35)" />

              {/* Head / Chin Strap */}
              <circle cx="19" cy="15" r="3.5" fill="#0A192F" />

              {/* Torso & High-Vis Harness */}
              <path
                d="M14 18C14 18 17 17 21 18C23 18.5 24 20 24 24L22 32H15L14 24V18Z"
                fill="#0A192F"
              />
              {/* Reflective Harness Straps (X-Pattern) */}
              <path d="M15 19L22 30M22 19L15 30" stroke="#FF6B00" strokeWidth="1.5" />
              <circle cx="18.5" cy="24" r="1.5" fill="#FFD700" />

              {/* Left Arm (Holding the working rope above descender) */}
              <path
                d="M15 20L19 12L22 10"
                stroke="#0A192F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Arm (Guiding backup brake rope) */}
              <path
                d="M23 21L27 27L23 34"
                stroke="#0A192F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Suspended Legs (Seated in Rope Access Work Seat / Pod) */}
              <path
                d="M16 32L11 38L12 47L16 48"
                stroke="#0A192F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="12" y="46" width="6" height="3.5" rx="1.5" fill="#FF6B00" />

              <path
                d="M20 32L17 40L18 49L23 50"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="18" y="48" width="6" height="3.5" rx="1.5" fill="#FF6B00" />

              {/* Workseat / Harness Bridge Rigging Line */}
              <path d="M14 33C17 36 21 36 24 33" stroke="#FFB800" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Real-time Altitude / Elevation Indicator Tooltip */}
          <div className="hidden xl:flex flex-col items-center bg-navy-950/90 text-white px-1.5 py-0.5 rounded-md border border-orange-500/40 shadow-lg text-[9px] font-mono leading-none backdrop-blur-xs">
            <span className="text-orange-400 font-bold tracking-tighter">
              <motion.span>{altitude}</motion.span>m
            </span>
            <span className="text-[7px] text-navy-400 uppercase">
              {isRTL ? 'الارتفاع' : 'Elevation'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Rope Terminator / Ground Weight */}
      <div className="pb-2 flex flex-col items-center">
        <div className="w-1.5 h-2 bg-orange-500 rounded-xs" />
        <div className="w-3.5 h-2 rounded-b-md bg-navy-900 border border-navy-700 shadow-sm" />
      </div>
    </div>
  )
}
