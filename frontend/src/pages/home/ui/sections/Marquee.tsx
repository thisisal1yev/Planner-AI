const MQ_TOP = [
  'Konsertlar',
  'Konferensiyalar',
  "Ko'rgazmalar",
  'Treninglar',
  'Festivallar',
  'Ziyofatlar',
  'Mitaplar',
  'Namoyishlar',
]

const MQ_BOTTOM = [
  "To'ylar",
  "Tug'ilgan kunlar",
  'Korporativ',
  'Sport',
  'Xayriya',
  'Workshop',
  'Networking',
  'Premiyalar',
]

const COLORS = [
  'text-aurora-cyan',
  'text-aurora-violet',
  'text-aurora-pink',
  'text-aurora-orange',
  'text-aurora-blue',
]

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const items4 = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `lp-marquee 38s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {items4.map((item, i) => (
          <span key={i} className="mr-14 flex items-center gap-14">
            <span className="font-serif text-[clamp(38px,5vw,72px)] font-bold leading-none tracking-tight text-white/90">
              {item}
            </span>
            <span className={`text-[18px] ${COLORS[i % COLORS.length]}`}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-navy py-16">
      <div className="flex flex-col gap-4">
        <Row items={MQ_TOP} />
        <Row items={MQ_BOTTOM} reverse />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-navy to-transparent" />
    </section>
  )
}
