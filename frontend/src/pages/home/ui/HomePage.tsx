import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { venuesApi } from '@entities/venue'
import { EventCard } from '@entities/event'
import { VenueCard } from '@entities/venue'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys, venueKeys } from '@shared/api/queryKeys'

// ─── Theme ────────────────────────────────────────────────────────────────────

const C = {
  bg:     '#0C1520',
  bg2:    '#101B28',
  bg3:    '#0F1925',
  gold:   '#C9963A',
  goldL:  '#E8C06A',
  cream:  '#F0E8D4',
  muted:  '#7A6D59',
  border: 'rgba(201,150,58,0.15)',
} as const

// ─── Styles ───────────────────────────────────────────────────────────────────

const LP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&display=swap');

.lp-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

@keyframes lp-up   { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
@keyframes lp-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
@keyframes lp-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-14px) } }
@keyframes lp-marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
@keyframes lp-shimmer {
  0%   { background-position: 200% center }
  100% { background-position: -200% center }
}

.lp-a  { animation: lp-up 0.75s ease-out forwards; opacity:0; }
.lp-d1 { animation-delay: 0.08s }
.lp-d2 { animation-delay: 0.22s }
.lp-d3 { animation-delay: 0.36s }
.lp-d4 { animation-delay: 0.50s }
.lp-d5 { animation-delay: 0.64s }

.lp-spin  { animation: lp-spin  48s linear infinite }
.lp-float { animation: lp-float  7s ease-in-out infinite }
.lp-mq    { animation: lp-marquee 28s linear infinite; display:flex; width:max-content; }

.lp-gold-text {
  background: linear-gradient(120deg, #E8C06A 0%, #C9963A 35%, #E8C06A 70%, #C9963A 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: lp-shimmer 5s linear infinite;
}

.lp-btn-gold {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #C9963A 0%, #9E7220 100%);
  color: #0C1520;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(201,150,58,0.28);
}
.lp-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(201,150,58,0.42);
}

.lp-btn-outline {
  display: inline-block;
  padding: 14px 32px;
  background: transparent;
  color: #F0E8D4;
  border: 1px solid rgba(201,150,58,0.22);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.lp-btn-outline:hover {
  border-color: #C9963A;
  color: #E8C06A;
}

.lp-card {
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}
.lp-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,150,58,0.25);
}

.lp-cat {
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.lp-cat:hover {
  background: rgba(201,150,58,0.1) !important;
  border-color: rgba(201,150,58,0.45) !important;
  transform: translateY(-3px);
}

.lp-noise::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.lp-input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(201,150,58,0.15);
  border-radius: 8px;
  color: #F0E8D4;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.lp-input:focus { border-color: rgba(201,150,58,0.5); }
.lp-input::placeholder { color: #5A4F3E; }
`

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

function Ornament({ size = 380, op = 0.13 }: { size?: number; op?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none" style={{ opacity: op }}>
      {/* Outer dashed ring */}
      <circle cx="120" cy="120" r="115" stroke="#C9963A" strokeWidth="0.6" strokeDasharray="5 5" />
      {/* 12-pointed star */}
      <polygon
        points="120,8 136,48 172,26 158,64 198,64 174,96 210,120 174,144 198,176 158,176 172,214 136,192 120,232 104,192 68,214 82,176 42,176 66,144 30,120 66,96 42,64 82,64 68,26 104,48"
        stroke="#C9963A" strokeWidth="0.9" fill="rgba(201,150,58,0.04)"
      />
      {/* Inner hexagon */}
      <polygon
        points="120,58 148,74 148,106 120,122 92,106 92,74"
        stroke="#C9963A" strokeWidth="0.7" fill="rgba(201,150,58,0.03)"
      />
      {/* 6-pointed star inside */}
      <polygon
        points="120,70 130,95 157,95 135,111 143,136 120,121 97,136 105,111 83,95 110,95"
        stroke="#C9963A" strokeWidth="0.6" fill="rgba(201,150,58,0.05)"
      />
      <circle cx="120" cy="120" r="5" fill="#C9963A" opacity="0.5" />
      {/* Diagonal lines */}
      <line x1="5" y1="120" x2="235" y2="120" stroke="#C9963A" strokeWidth="0.35" opacity="0.4" />
      <line x1="120" y1="5" x2="120" y2="235" stroke="#C9963A" strokeWidth="0.35" opacity="0.4" />
      <line x1="37" y1="37" x2="203" y2="203" stroke="#C9963A" strokeWidth="0.3" opacity="0.25" />
      <line x1="203" y1="37" x2="37" y2="203" stroke="#C9963A" strokeWidth="0.3" opacity="0.25" />
    </svg>
  )
}

// ─── Section label ─────────────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <p style={{ fontSize: '11px', color: C.gold, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 500 }}>
      {text}
    </p>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { v: '500+', l: 'Tadbirlar' },
  { v: '120+', l: 'Maydonlar' },
  { v: '80+',  l: "Ta'minotchilar" },
  { v: '10K+', l: 'Ishtirokchilar' },
]

const CATS = [
  { l: 'Konsertlar',     e: '🎵', to: '/events?type=Konsert' },
  { l: 'Konferensiyalar',e: '🎤', to: '/events?type=Konferensiya' },
  { l: "Ko'rgazmalar",   e: '🖼️', to: "/events?type=Ko'rgazma" },
  { l: 'Treninglar',     e: '📚', to: '/events?type=Trening' },
  { l: 'Festivallar',    e: '🎪', to: '/events?type=Festival' },
  { l: 'Ziyofatlar',     e: '🎉', to: '/events?type=Ziyofat' },
]

const STEPS = [
  { n: '01', t: 'Maydon tanlang',     d: "Butun O'zbekiston bo'ylab yuzlab tekshirilgan maydonlardan tadbiringiz uchun ideal joyni toping." },
  { n: '02', t: "Xizmatlar qo'shing", d: "Katering, bezak, ovoz, foto — tekshirilgan ta'minotchilardan hamma zarur narsalarni bir joyda buyurtma qiling." },
  { n: '03', t: 'Chiptalar soting',   d: "Chipta sotuvini ishga tushiring, ishtirokchilarni boshqaring va real vaqtda analitikani kuzating." },
]

const FEATS = [
  { e: '📅', t: 'Tadbirlarni boshqarish', d: 'Bir necha bosish bilan tadbirlarni yarating, tahrirlang va nashr eting.' },
  { e: '🏛️', t: 'Maydonlar bazasi',        d: "O'zbekistonning yirik shaharlarida 120 dan ortiq tekshirilgan maydonlar." },
  { e: '🎫', t: 'Chipta sotish',           d: "Click va Payme qo'llab-quvvatlaydigan o'rnatilgan sotuv tizimi." },
  { e: '⭐', t: 'Reytinglar va sharhlar',  d: "Ishtirokchilarning haqiqiy sharhlari eng yaxshi ta'minotchilarni tanlashga yordam beradi." },
]

const PLANS = [
  {
    n: 'Bepul', p: '0', per: '',            desc: "Boshlang'ichlar uchun",
    fs: ["Tadbirlarni ko'rish", 'Chipta sotib olish', 'Shaxsiy kabinet', 'Sharhlar'],
    cta: 'Bepul boshlash', hot: false,
  },
  {
    n: 'Pro',    p: '99 000', per: " so'm/oy", desc: 'Tashkilotchilar uchun',
    fs: ['Oyiga 10 tadbir', 'Chipta sotish', 'Analitika', 'Volontyorlar', "Ustuvor yordam"],
    cta: "14 kun sinab ko'ring", hot: true,
  },
  {
    n: 'Biznes', p: '299 000', per: " so'm/oy", desc: 'Kompaniyalar uchun',
    fs: ['Cheksiz tadbirlar', 'Multi-akkaunt', 'API kirish', 'Brending', 'Menejer'],
    cta: "Biz bilan bog'laning", hot: false,
  },
]

const MQ = ['Konsertlar', 'Konferensiyalar', "Ko'rgazmalar", 'Treninglar', 'Festivallar', 'Ziyofatlar', 'Mitaplar', 'Namoyishlar']

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.list({ status: 'PUBLISHED', limit: 3 }),
    queryFn: () => eventsApi.list({ status: 'PUBLISHED', limit: 3 }),
  })
  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: venueKeys.list({ limit: 3 }),
    queryFn: () => venuesApi.list({ limit: 3 }),
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LP_CSS }} />
      <div style={{ background: C.bg, color: C.cream }}>

        {/* ════════════════════════════════ HERO ════════════════════════════════ */}
        <section
          className="lp-noise relative overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 90% 55% at 50% -5%, rgba(201,150,58,0.09) 0%, transparent 68%), ${C.bg}`,
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* top line */}
          <div className="absolute top-0 left-0 right-0" style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.35 }} />

          {/* Spinning ornament — top right */}
          <div className="lp-spin absolute pointer-events-none" style={{ top: -90, right: -90, zIndex: 0 }}>
            <Ornament size={480} op={0.1} />
          </div>
          {/* Floating ornament — bottom left */}
          <div className="lp-float absolute pointer-events-none" style={{ bottom: -70, left: -110, zIndex: 0 }}>
            <Ornament size={300} op={0.06} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center w-full">

            {/* Badge */}
            <div
              className="lp-a lp-d1 inline-flex items-center gap-2 mb-8"
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: '100px',
                padding: '6px 18px',
                background: 'rgba(201,150,58,0.06)',
                fontSize: '12px',
                color: C.goldL,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, flexShrink: 0, display: 'inline-block' }} />
              O'zbekistondagi №1 tadbirlar marketi
            </div>

            {/* Headline */}
            <h1
              className="lp-serif lp-a lp-d2"
              style={{
                fontSize: 'clamp(52px, 9vw, 96px)',
                fontWeight: 700,
                lineHeight: 1.03,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
                color: C.cream,
              }}
            >
              Tadbirlarni{' '}
              <em className="lp-serif lp-gold-text">muammosiz</em>
              <br />
              tashkil eting
            </h1>

            {/* Sub */}
            <p
              className="lp-a lp-d3"
              style={{ fontSize: '18px', lineHeight: 1.75, color: C.muted, maxWidth: '520px', margin: '0 auto 44px' }}
            >
              Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI tashkilotchilarga tadbirlarni tez va samarali ishga tushirishga yordam beradi.
            </p>

            {/* CTAs */}
            <div className="lp-a lp-d4 flex flex-col sm:flex-row gap-3 justify-center" style={{ marginBottom: '68px' }}>
              <Link to="/events" className="lp-btn-gold">Tadbirlarni ko'rish →</Link>
              <Link to="/register" className="lp-btn-outline">Tadbir yaratish</Link>
            </div>

            {/* Stats */}
            <div
              className="lp-a lp-d5 grid grid-cols-2 sm:grid-cols-4 gap-3"
              style={{ maxWidth: '580px', margin: '0 auto' }}
            >
              {STATS.map((s) => (
                <div
                  key={s.l}
                  style={{
                    padding: '18px 12px',
                    border: `1px solid ${C.border}`,
                    borderRadius: '12px',
                    background: 'rgba(201,150,58,0.04)',
                  }}
                >
                  <div className="lp-serif" style={{ fontSize: '30px', fontWeight: 700, color: C.goldL, lineHeight: 1 }}>
                    {s.v}
                  </div>
                  <div style={{ fontSize: '12px', color: C.muted, marginTop: '5px', letterSpacing: '0.04em' }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '100px', background: `linear-gradient(to bottom, transparent, ${C.bg})` }} />
        </section>

        {/* ════════════════════════════════ MARQUEE ════════════════════════════ */}
        <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '13px 0', overflow: 'hidden', background: 'rgba(201,150,58,0.025)' }}>
          <div className="lp-mq">
            {[...MQ, ...MQ, ...MQ, ...MQ].map((item, i) => (
              <span
                key={i}
                style={{ fontSize: '12px', color: C.muted, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '44px', marginRight: '44px' }}
              >
                {item}
                <span style={{ color: C.gold, fontSize: '7px' }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════ CATEGORIES ════════════════════════ */}
        <section style={{ padding: '88px 24px', background: C.bg2 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: '48px' }}>
              <div>
                <Label text="Kategoriyalar" />
                <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, color: C.cream, lineHeight: 1.1 }}>
                  Tadbir turini tanlang
                </h2>
              </div>
              <Link to="/events" style={{ color: C.gold, fontSize: '14px', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                Barcha tadbirlar →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATS.map((c) => (
                <Link
                  key={c.l}
                  to={c.to}
                  className="lp-cat"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    padding: '22px 10px',
                    border: `1px solid ${C.border}`,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.018)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '26px' }}>{c.e}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: C.cream, textAlign: 'center', lineHeight: 1.3 }}>{c.l}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ EVENTS ════════════════════════════ */}
        <section style={{ padding: '88px 24px', background: C.bg }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: '48px' }}>
              <div>
                <Label text="Tadbirlar" />
                <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, color: C.cream, lineHeight: 1.1 }}>
                  Yaqinlashayotgan tadbirlar
                </h2>
                <p style={{ fontSize: '15px', color: C.muted, marginTop: '8px' }}>O'zbekistonning dolzarb tadbirlari</p>
              </div>
              <Link to="/events" style={{ color: C.gold, fontSize: '14px', textDecoration: 'none' }}>Barcha tadbirlar →</Link>
            </div>
            {eventsLoading
              ? <Spinner />
              : eventsData?.data.length === 0
                ? <p style={{ textAlign: 'center', color: C.muted, padding: '48px 0' }}>Mavjud tadbirlar yo'q</p>
                : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventsData?.data.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                )
            }
          </div>
        </section>

        {/* ════════════════════════════════ HOW IT WORKS ══════════════════════ */}
        <section id="how-it-works" style={{ padding: '88px 24px', background: C.bg3, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <Label text="Jarayon" />
              <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, color: C.cream }}>
                Bu qanday ishlaydi
              </h2>
              <p style={{ fontSize: '15px', color: C.muted, marginTop: '12px', maxWidth: '380px', margin: '12px auto 0' }}>
                Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {STEPS.map((s, i) => (
                <div key={s.n} style={{ position: 'relative' }}>
                  {/* Step number */}
                  <div
                    className="lp-serif"
                    style={{
                      fontSize: '88px', fontWeight: 700, lineHeight: 1,
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(201,150,58,0.18)',
                      marginBottom: '12px',
                      userSelect: 'none',
                    }}
                  >{s.n}</div>
                  {/* Arrow between steps (desktop) */}
                  {i < 2 && (
                    <div
                      className="hidden md:block absolute"
                      style={{ top: '32px', right: '-28px', color: C.border, fontSize: '22px', zIndex: 10 }}
                    >→</div>
                  )}
                  <div style={{ width: '36px', height: '2px', background: C.gold, opacity: 0.55, marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: C.cream, marginBottom: '10px' }}>{s.t}</h3>
                  <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.75 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ VENUES ════════════════════════════ */}
        <section style={{ padding: '88px 24px', background: C.bg2 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: '48px' }}>
              <div>
                <Label text="Maydonlar" />
                <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,46px)', fontWeight: 700, color: C.cream, lineHeight: 1.1 }}>
                  Mashhur maydonlar
                </h2>
                <p style={{ fontSize: '15px', color: C.muted, marginTop: '8px' }}>Tadbirlaringiz uchun eng yaxshi joylar</p>
              </div>
              <Link to="/venues" style={{ color: C.gold, fontSize: '14px', textDecoration: 'none' }}>Barcha maydonlar →</Link>
            </div>
            {venuesLoading
              ? <Spinner />
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venuesData?.data.map((v) => <VenueCard key={v.id} venue={v} />)}
                </div>
              )
            }
          </div>
        </section>

        {/* ════════════════════════════════ FEATURES ══════════════════════════ */}
        <section id="features" style={{ padding: '88px 24px', background: C.bg }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Label text="Imkoniyatlar" />
              <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, color: C.cream }}>
                Tashkilotchi uchun hamma narsa
              </h2>
              <p style={{ fontSize: '15px', color: C.muted, marginTop: '12px' }}>
                Professional tadbirlarni tashkil etish uchun to'liq vositalar to'plami
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATS.map((f) => (
                <div
                  key={f.t}
                  className="lp-card"
                  style={{
                    padding: '28px 22px',
                    border: `1px solid ${C.border}`,
                    borderRadius: '16px',
                    background: 'rgba(201,150,58,0.025)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '26px', marginBottom: '18px',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '52px', height: '52px',
                      border: `1px solid ${C.border}`,
                      borderRadius: '12px',
                      background: 'rgba(201,150,58,0.06)',
                    }}
                  >{f.e}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: C.cream, marginBottom: '8px' }}>{f.t}</h3>
                  <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.65 }}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ PRICING ═══════════════════════════ */}
        <section id="pricing" style={{ padding: '88px 24px', background: C.bg3, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <Label text="Narxlar" />
              <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, color: C.cream }}>
                Tariflar
              </h2>
              <p style={{ fontSize: '15px', color: C.muted, marginTop: '12px' }}>
                Bepul boshlang va o'sishingiz bilan kengaytiring
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((p) => (
                <div
                  key={p.n}
                  className="lp-card"
                  style={{
                    padding: '32px 24px',
                    border: p.hot ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
                    borderRadius: '16px',
                    background: p.hot
                      ? 'linear-gradient(160deg, rgba(201,150,58,0.12), rgba(201,150,58,0.04))'
                      : 'rgba(255,255,255,0.018)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {p.hot && (
                    <div style={{
                      position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                      background: `linear-gradient(135deg, ${C.gold}, #9E7220)`,
                      color: '#0C1520', fontSize: '11px', fontWeight: 700,
                      padding: '4px 16px', borderRadius: '100px',
                      letterSpacing: '0.09em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>
                      Eng mashhur
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>{p.n}</p>
                  <div className="flex items-baseline gap-1" style={{ marginBottom: '4px' }}>
                    <span className="lp-serif" style={{ fontSize: '38px', fontWeight: 700, color: p.hot ? C.goldL : C.cream, lineHeight: 1 }}>{p.p}</span>
                    {p.per && <span style={{ fontSize: '13px', color: C.muted }}>{p.per}</span>}
                  </div>
                  <p style={{ fontSize: '13px', color: C.muted, marginBottom: '24px' }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {p.fs.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: C.cream }}>
                        <span style={{ color: C.gold, fontWeight: 700, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '12px',
                      background: p.hot ? `linear-gradient(135deg, ${C.gold}, #9E7220)` : 'transparent',
                      border: p.hot ? 'none' : `1px solid ${C.border}`,
                      borderRadius: '8px',
                      color: p.hot ? '#0C1520' : C.cream,
                      fontSize: '14px', fontWeight: 600,
                      textDecoration: 'none',
                      letterSpacing: '0.02em',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ CONTACT ═══════════════════════════ */}
        <section id="contact" style={{ padding: '88px 24px', background: C.bg2 }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <Label text="Aloqa" />
              <h2 className="lp-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, color: C.cream }}>
                Biz bilan bog'laning
              </h2>
              <p style={{ fontSize: '15px', color: C.muted, marginTop: '12px' }}>
                Savollaringiz bormi? Ish kuni davomida javob beramiz
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { ic: '📍', t: 'Manzil',    v: "Toshkent, Amir Temur ko'chasi, 107B" },
                  { ic: '📞', t: 'Telefon',   v: '+998 71 200 00 00' },
                  { ic: '✉️', t: 'Email',     v: 'hello@plannerai.uz' },
                  { ic: '🕐', t: 'Ish vaqti', v: 'Du–Ju, 9:00–18:00' },
                ].map((x) => (
                  <div
                    key={x.t}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '16px',
                      padding: '16px 20px',
                      border: `1px solid ${C.border}`,
                      borderRadius: '12px',
                      background: 'rgba(201,150,58,0.025)',
                    }}
                  >
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{x.ic}</span>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: C.goldL, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>{x.t}</p>
                      <p style={{ fontSize: '14px', color: C.muted }}>{x.v}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Form */}
              <form
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                  background: 'rgba(201,150,58,0.025)',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>Ism</label>
                    <input className="lp-input" type="text" placeholder="Ismingiz" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>Email</label>
                    <input className="lp-input" type="email" placeholder="email@example.com" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>Mavzu</label>
                  <input className="lp-input" type="text" placeholder="Qanday yordam bera olamiz?" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>Xabar</label>
                  <textarea className="lp-input" rows={4} placeholder="Savolingizni tasvirlab bering..." style={{ resize: 'none' }} />
                </div>
                <button
                  type="submit"
                  className="lp-btn-gold"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Xabar yuborish
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════ CTA ═══════════════════════════════ */}
        <section style={{ padding: '80px 24px', background: C.bg }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div
              className="lp-noise relative overflow-hidden"
              style={{
                borderRadius: '24px',
                padding: 'clamp(48px, 8vw, 88px) clamp(24px, 5vw, 80px)',
                textAlign: 'center',
                border: `1px solid rgba(201,150,58,0.28)`,
                background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,150,58,0.07), transparent 70%)`,
              }}
            >
              {/* corner ornaments */}
              <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.06, pointerEvents: 'none' }}>
                <Ornament size={200} op={1} />
              </div>
              <div style={{ position: 'absolute', bottom: -30, left: -30, opacity: 0.05, pointerEvents: 'none' }}>
                <Ornament size={160} op={1} />
              </div>

              <div className="relative z-10">
                <Label text="Hoziroq boshlang" />
                <h2
                  className="lp-serif"
                  style={{ fontSize: 'clamp(34px, 6vw, 62px)', fontWeight: 700, color: C.cream, marginBottom: '16px', lineHeight: 1.08 }}
                >
                  Tadbir boshlashga{' '}
                  <em className="lp-serif lp-gold-text">tayyormisiz?</em>
                </h2>
                <p style={{ fontSize: '17px', color: C.muted, maxWidth: '480px', margin: '0 auto 44px', lineHeight: 1.75 }}>
                  Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon o'tkazayotgan yuzlab tashkilotchilarga qo'shiling
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/register" className="lp-btn-gold">Bepul boshlash →</Link>
                  <Link to="/events" className="lp-btn-outline">Tadbirlarni ko'rish</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
