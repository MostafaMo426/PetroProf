import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // ── PetroProf Brand Palette ──────────────────────────────────────────
        navy: {
          DEFAULT: '#0A192F',
          50:  '#E8EEF5',
          100: '#C5D4E5',
          200: '#9EB8D4',
          300: '#779BC2',
          400: '#5582B4',
          500: '#3469A6',
          600: '#1E5094',
          700: '#163D72',
          800: '#0E2B52',
          900: '#0A192F',
          950: '#060F1C',
        },
        orange: {
          DEFAULT: '#FF6B00',
          50:  '#FFF0E5',
          100: '#FFD9BC',
          200: '#FFB980',
          300: '#FF9944',
          400: '#FF7F1A',
          500: '#FF6B00',
          600: '#E56000',
          700: '#B34A00',
          800: '#803600',
          900: '#4D2000',
        },
        yellow: {
          DEFAULT: '#FFD700',
          50:  '#FFFDE5',
          100: '#FFFAB8',
          200: '#FFF480',
          300: '#FFED47',
          400: '#FFE71A',
          500: '#FFD700',
          600: '#E5C200',
          700: '#B39800',
          800: '#806D00',
          900: '#4D4200',
        },
        // ── Semantic / shadcn-compatible tokens ──────────────────────────────
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // ── Status Colors ────────────────────────────────────────────────────
        success: { DEFAULT: '#22C55E', foreground: '#FFFFFF' },
        warning: { DEFAULT: '#FFD700', foreground: '#0A192F' },
        danger:  { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 0, 0.4)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(255, 107, 0, 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0A192F 0%, #163D72 50%, #0E2B52 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF9944 100%)',
        'hero-mesh': `
          radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0A192F 0%, #163D72 60%, #0E2B52 100%)
        `,
        shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      boxShadow: {
        'card-hover': '0 8px 30px rgba(10,25,47,0.12)',
        'orange-glow': '0 4px 20px rgba(255,107,0,0.25)',
        'navy-glow':   '0 4px 20px rgba(10,25,47,0.4)',
      },
    },
  },
  plugins: [animate],
}

export default config
