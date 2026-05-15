const LOGOS = [
  'Beeline',
  'UzCard',
  'Click',
  'Payme',
  'Humans',
  'Korzinka',
  'Anhor',
  'Uztelecom',
  'Spot.uz',
  'Kun.uz',
]

export function TrustLogos() {
  const items = [...LOGOS, ...LOGOS, ...LOGOS]
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-navy py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-[10px] tracking-[0.4em] uppercase text-white/40">
          Ular bizga ishonadi
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'lp-marquee 42s linear infinite' }}
          >
            {items.map((name, i) => (
              <div
                key={i}
                className="mx-10 flex shrink-0 items-center justify-center opacity-30 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
              >
                <span className="font-serif text-3xl font-bold tracking-tight text-white/70">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-navy to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-navy to-transparent" />
        </div>
      </div>
    </section>
  )
}
