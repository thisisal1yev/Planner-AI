import { useEffect, useRef, type ReactNode } from 'react'

interface AuroraBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function AuroraBackground({ intensity = 'medium', className = '' }: AuroraBackgroundProps) {
  const opacity = intensity === 'low' ? 0.5 : intensity === 'medium' ? 0.85 : 1.1
  return (
    <div
      className={`aurora-mesh ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}

interface SpotlightProps {
  children: ReactNode
  className?: string
  color?: string
}

export function Spotlight({ children, className = '', color = 'rgba(139, 92, 246, 0.18)' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mx', `${x}%`)
      el.style.setProperty('--my', `${y}%`)
    }
    el.addEventListener('mousemove', handleMove)
    return () => el.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ ['--mx' as never]: '50%', ['--my' as never]: '50%' }}>
      <div className="spotlight" style={{ background: `radial-gradient(600px circle at var(--mx) var(--my), ${color}, transparent 40%)` }} />
      {children}
    </div>
  )
}

interface OrbsProps {
  count?: number
}

export function FloatingOrbs({ count = 4 }: OrbsProps) {
  const colors = [
    'bg-aurora-cyan/30',
    'bg-aurora-violet/30',
    'bg-aurora-pink/30',
    'bg-aurora-orange/25',
    'bg-aurora-blue/30',
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${colors[i % colors.length]}`}
          style={{
            width: `${280 + i * 60}px`,
            height: `${280 + i * 60}px`,
            top: `${(i * 23 + 5) % 80}%`,
            left: `${(i * 31 + 10) % 80}%`,
            animation: `lp-float ${8 + i * 2}s ease-in-out ${-i * 0.7}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
