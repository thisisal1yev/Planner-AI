import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AuroraBackground, ScrollChars } from '@shared/lib/animation'
import { cn } from '@shared/lib/utils'

const ITEMS = [
  {
    q: 'Bepul tarif qancha vaqt amal qiladi?',
    a: "Bepul tarif vaqtsiz. Tadbirlarni ko'rish, chipta sotib olish va sharhlar yozish — har doim bepul. Tashkilotchilik uchun Pro tarifga o'tasiz.",
  },
  {
    q: "To'lov qaysi tizimlar orqali amalga oshadi?",
    a: "Click va Payme to'liq integratsiya qilingan. UzCard, Humo kartalardan to'g'ridan-to'g'ri to'lov olishingiz mumkin. Komissiya — 2.5% (eng past tarif O'zbekistonda).",
  },
  {
    q: "Vendor sifatida qanday ro'yxatdan o'taman?",
    a: "Ro'yxatdan o'tib Vendor rolini tanlang. Profilingizni to'ldiring, xizmatlaringizni qo'shing va admin tasdig'idan keyin platformada paydo bo'lasiz. Tasdiqlash odatda 24 soatda yakunlanadi.",
  },
  {
    q: 'Chiptalarni qanday tekshiraman?',
    a: 'Har bir chiptada QR kod yaratiladi. Mobil ilovamiz orqali eshik oldida QR ni skanerlaysiz — 1 soniyada validatsiya. Internet kerak emas.',
  },
  {
    q: 'Pul qaytarish qanday ishlaydi?',
    a: "Tadbir bekor qilinsa — avto-refund 24 soat ichida. Ishtirokchi rad etsa — siz qoidalaringizni belgilaysiz. Platforma vositachi sifatida xavfsiz to'lov saqlaydi.",
  },
  {
    q: 'API integratsiyasi mavjudmi?',
    a: "Biznes tarifda to'liq REST API ochiladi. Swagger dokumentatsiyasi: /api/docs. Webhook'lar orqali har qanday CRM yoki ERP tizimingizga ulanasiz.",
  },
  {
    q: "Qo'llab-quvvatlash qaysi tillarda?",
    a: "O'zbek (lotin + kiril), rus va ingliz. Pro tarifda — 24/7 chat. Biznes — shaxsiy menejer + telefon.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "JWT autentifikatsiya, SSL/TLS shifrlash, kunlik backup. Google OAuth qo'llab-quvvatlanadi. Hech qachon parolingizni saqlamaymiz — faqat hash.",
  },
]

function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof ITEMS)[0]
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-500',
        open && 'border-aurora-violet/50 bg-aurora-violet/[0.05]'
      )}
    >
      <button
        onClick={onToggle}
        data-cursor-hover
        className="relative flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
      >
        <span
          className={cn(
            'font-serif text-xl font-semibold tracking-tight transition-colors',
            open ? 'text-aurora' : 'text-white'
          )}
        >
          {item.q}
        </span>
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
            open
              ? 'border-transparent bg-gradient-to-br from-aurora-violet to-aurora-pink rotate-45'
              : 'border-white/15 group-hover:border-white/35'
          )}
        >
          <Plus className="size-4 text-white" />
        </span>
      </button>
      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-7 pb-6 text-base leading-[1.8] text-white/60">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative overflow-hidden bg-navy px-[clamp(24px,5vw,80px)] py-32">
      <AuroraBackground intensity="low" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <div className="chip mx-auto mb-5">FAQ</div>
          <ScrollChars
            as="h2"
            className="font-serif text-[clamp(44px,8vw,140px)] font-bold leading-[0.9] tracking-[-0.035em]"
          >
            Tez-tez beriladigan savollar
          </ScrollChars>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
            Boshqa savollar bormi? Pastdagi forma orqali bizga yozing
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {ITEMS.map((it, i) => (
            <FaqItem
              key={it.q}
              item={it}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
