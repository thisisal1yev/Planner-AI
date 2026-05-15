interface OrnamentProps {
  size?: number
  op?: number
  className?: string
}

export function Ornament({ size = 380, op = 0.13, className = '' }: OrnamentProps) {
  return (
    <svg
      className={`text-primary ${className}`}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={{ opacity: op }}
    >
      <circle cx="120" cy="120" r="115" stroke="#4c8ca7" strokeWidth="0.6" strokeDasharray="5 5" />
      <polygon
        points="120,8 136,48 172,26 158,64 198,64 174,96 210,120 174,144 198,176 158,176 172,214 136,192 120,232 104,192 68,214 82,176 42,176 66,144 30,120 66,96 42,64 82,64 68,26 104,48"
        stroke="#4c8ca7"
        strokeWidth="0.9"
        fill="rgba(76,140,167,0.04)"
      />
      <polygon
        points="120,58 148,74 148,106 120,122 92,106 92,74"
        stroke="#4c8ca7"
        strokeWidth="0.7"
        fill="rgba(76,140,167,0.03)"
      />
      <polygon
        points="120,70 130,95 157,95 135,111 143,136 120,121 97,136 105,111 83,95 110,95"
        stroke="#4c8ca7"
        strokeWidth="0.6"
        fill="rgba(76,140,167,0.05)"
      />
      <circle cx="120" cy="120" r="5" fill="#4c8ca7" opacity="0.5" />
      <line x1="5" y1="120" x2="235" y2="120" stroke="#4c8ca7" strokeWidth="0.35" opacity="0.4" />
      <line x1="120" y1="5" x2="120" y2="235" stroke="#4c8ca7" strokeWidth="0.35" opacity="0.4" />
      <line x1="37" y1="37" x2="203" y2="203" stroke="#4c8ca7" strokeWidth="0.3" opacity="0.25" />
      <line x1="203" y1="37" x2="37" y2="203" stroke="#4c8ca7" strokeWidth="0.3" opacity="0.25" />
    </svg>
  )
}

export function Label({ text }: { text: string }) {
  return (
    <p className="text-primary mb-2.5 text-[11px] font-medium tracking-[0.18em] uppercase">
      {text}
    </p>
  )
}
