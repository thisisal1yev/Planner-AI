interface SectionCardProps {
  step: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  headerAction?: React.ReactNode
}

export function SectionCard({ step, icon, title, children, headerAction }: SectionCardProps) {
  return (
    <div className="bg-card border-border rounded-2xl border">
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {step}
          </span>
          <div className="text-foreground flex items-center gap-2 font-semibold">
            {icon}
            {title}
          </div>
        </div>
        {headerAction}
      </div>
      <div className="flex flex-col gap-4 p-6">{children}</div>
    </div>
  )
}
