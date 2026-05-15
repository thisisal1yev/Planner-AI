import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'

type ContactForm = { name: string; email: string; subject: string; message: string }

const TG_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN
const TG_CHAT = import.meta.env.VITE_TG_CHAT_ID

async function sendToTelegram(data: ContactForm) {
  const text =
    `📬 <b>Yangi xabar</b>\n\n` +
    `👤 <b>Ism:</b> ${data.name}\n` +
    `✉️ <b>Email:</b> ${data.email}\n` +
    `📌 <b>Mavzu:</b> ${data.subject}\n\n` +
    `💬 ${data.message}`
  const ids = String(TG_CHAT).split(',').map((s) => s.trim())
  const results = await Promise.all(
    ids.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
      })
    )
  )
  if (results.some((r) => !r.ok)) throw new Error('Telegram error')
}

const CONTACT_INFO = [
  {
    Icon: MapPin,
    t: 'Manzil',
    v: "Farg'ona viloyati, Farg'ona ko'chasi 86 uy, Startup Markaz",
    color: 'from-aurora-cyan to-aurora-blue',
  },
  {
    Icon: Phone,
    t: 'Telefon',
    v: '+998 94 991 96 69',
    color: 'from-aurora-violet to-aurora-pink',
  },
  {
    Icon: Mail,
    t: 'Email',
    v: 'naymanbayevjavohir400@gmail.com',
    color: 'from-aurora-pink to-aurora-orange',
  },
  {
    Icon: Clock,
    t: 'Ish vaqti',
    v: 'Du–Ju, 9:00–18:00',
    color: 'from-aurora-orange to-aurora-cyan',
  },
]

export function Contact() {
  const { register, handleSubmit, reset } = useForm<ContactForm>()
  const contact = useMutation({ mutationFn: sendToTelegram, onSuccess: () => reset() })

  return (
    <section id="contact" className="relative overflow-hidden bg-navy-2 px-[clamp(24px,5vw,80px)] py-32">
      <AuroraBackground intensity="medium" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="mb-16 text-center">
          <div className="chip mx-auto mb-5">Aloqa</div>
          <ScrollChars
            as="h2"
            className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
          >
            Biz bilan bog'laning
          </ScrollChars>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
            Savollaringiz bormi? Ish kuni davomida javob beramiz
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {CONTACT_INFO.map((x) => {
              const Icon = x.Icon
              return (
                <div
                  key={x.t}
                  data-cursor-hover
                  className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/30"
                >
                  <div className="grain pointer-events-none absolute inset-0" />
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${x.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="relative">
                    <p className="mb-1 text-[10px] font-semibold tracking-[0.3em] uppercase text-white/40">
                      {x.t}
                    </p>
                    <p className="text-sm text-white/85">{x.v}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <form
            onSubmit={handleSubmit((data) => contact.mutate(data))}
            className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
          >
            <div className="grain pointer-events-none absolute inset-0" />
            <div className="relative grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-aurora-violet">
                  Ism
                </label>
                <input
                  className="input-cls"
                  type="text"
                  placeholder="Ismingiz"
                  {...register('name', { required: true })}
                />
              </div>
              <div>
                <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-aurora-violet">
                  Email
                </label>
                <input
                  className="input-cls"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email', { required: true })}
                />
              </div>
            </div>
            <div className="relative">
              <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-aurora-violet">
                Mavzu
              </label>
              <input
                className="input-cls"
                type="text"
                placeholder="Qanday yordam bera olamiz?"
                {...register('subject', { required: true })}
              />
            </div>
            <div className="relative">
              <label className="mb-2 block text-[10px] tracking-[0.3em] uppercase text-aurora-violet">
                Xabar
              </label>
              <textarea
                className="input-cls resize-none"
                rows={5}
                placeholder="Savolingizni tasvirlab bering..."
                {...register('message', { required: true })}
              />
            </div>
            <button
              type="submit"
              data-cursor-hover
              disabled={contact.isPending}
              className="group btn-primary relative mt-2 disabled:opacity-60"
            >
              <span className="relative z-10">
                {contact.isPending ? 'Yuborilmoqda...' : 'Xabar yuborish'}
              </span>
              <Send className="relative z-10 ml-2 size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </button>
            {contact.isSuccess && (
              <p className="relative text-center text-sm text-aurora-cyan">
                ✓ Xabar yuborildi! Tez orada bog'lanamiz.
              </p>
            )}
            {contact.isError && (
              <p className="relative text-center text-sm text-destructive">
                Xatolik yuz berdi. Keyinroq urinib ko'ring.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
