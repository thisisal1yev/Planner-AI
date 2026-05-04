import { useState } from 'react'
import { Bug, Lightbulb, X } from 'lucide-react'

const LINKS = {
  suggestion: 'https://t.me/NaymanbayevJavohir',
  bug: 'https://t.me/thisisaliyev',
}

const SUB_BUTTONS = [
  { label: 'Takliflar uchun', icon: Lightbulb, href: LINKS.suggestion, delay: '0.05s' },
  { label: 'Xatoliklar (Bug)', icon: Bug, href: LINKS.bug, delay: '0s' },
]

export function FeedbackButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}

      <div className="fixed right-10 bottom-10 z-30 flex flex-col items-end gap-3">
        <div className="flex flex-col items-end gap-2">
          {open &&
            SUB_BUTTONS.map(({ label, icon: Icon, href, delay }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: delay }}
                className="border-cream/50 bg-navy-2/80 text-cream/70 hover:border-primary hover:text-primary flex animate-[feedback-in_0.22s_ease-out_both] items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="border-cream/50 group hover:border-primary rounded-full border px-4 py-2.5 transition-colors duration-300"
        >
          {open ? (
            <X className="text-cream/50 group-hover:text-primary h-6 w-6 transition-colors duration-300" />
          ) : (
            <Bug className="text-cream/50 group-hover:text-primary h-6 w-6 transition-colors duration-300" />
          )}
        </button>
      </div>
    </>
  )
}
