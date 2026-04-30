import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Wrench,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  ChefHat,
  Camera,
  Music,
  Palette,
  ShieldCheck,
  MapPin,
} from 'lucide-react'
import { eventsApi } from '@entities/event'
import { servicesApi } from '@entities/service'
import type { EventService } from '@entities/service'
import { Spinner } from '@shared/ui/Spinner'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { eventKeys, serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@shared/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; bar: string; badge: string }> = {
  PENDING: {
    label: 'Kutilmoqda',
    bar: 'bg-amber-400/50',
    badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  },
  CONFIRMED: {
    label: 'Tasdiqlangan',
    bar: 'bg-emerald-400/60',
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  },
  CANCELLED: {
    label: 'Bekor',
    bar: 'bg-muted-foreground/20',
    badge: 'text-muted-foreground/60 bg-muted/20 border-border',
  },
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  Katering: ChefHat,
  'Foto va video': Camera,
  'Ovoz va yoruglik': Music,
  Dekor: Palette,
  Xavfsizlik: ShieldCheck,
}

function AttachModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [serviceId, setServiceId] = useState('')
  const [price, setPrice] = useState('')

  const { data: allServices } = useQuery({
    queryKey: serviceKeys.allFlat(),
    queryFn: () => servicesApi.list({ limit: 100 }),
  })

  const attachMutation = useMutation({
    mutationFn: () =>
      eventsApi.attachService(eventId, { serviceId, agreedPrice: parseFloat(price) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.services(eventId) })
      onClose()
    },
  })

  const serviceOptions =
    allServices?.data.map((s) => ({
      value: s.id,
      label: `${s.name} — ${s.category?.name} • ${s.city}`,
    })) ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="bg-card border-border/60 w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl">
        <div className="border-border/40 border-b px-6 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border">
              <Plus className="text-primary size-4" />
            </div>
            <p className="text-foreground text-[15px] font-semibold">Xizmat qo'shish</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5">
          <Select
            label="Xizmat"
            options={[{ value: '', label: 'Xizmatni tanlang' }, ...serviceOptions]}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
          <Input
            label="Kelishilgan narx (so'm)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {attachMutation.isError && (
            <p className="text-destructive bg-destructive/8 border-destructive/20 rounded-lg border px-3 py-2 text-[12px]">
              Qo'shishda xatolik yuz berdi
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => attachMutation.mutate()}
              disabled={!serviceId || !price || attachMutation.isPending}
              className="bg-primary text-navy hover:bg-primary-light h-10 flex-1 rounded-xl text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 disabled:opacity-40"
            >
              {attachMutation.isPending ? 'Yuklanmoqda...' : 'Biriktirish'}
            </button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground border-border hover:border-border/80 h-10 rounded-xl border px-5 text-[13px] transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventServicesPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [attachOpen, setAttachOpen] = useState(false)
  const [category, setCategory] = useState('')

  const { data: attached, isLoading } = useQuery({
    queryKey: eventKeys.services(id!),
    queryFn: () => eventsApi.services(id!),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: ({ esId, status }: { esId: string; status: string }) =>
      eventsApi.updateEventService(id!, esId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.services(id!) }),
  })

  const removeMutation = useMutation({
    mutationFn: (esId: string) => eventsApi.removeEventService(id!, esId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.services(id!) }),
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )

  const all = attached ?? []
  const categoryTabs = [
    { value: '', label: 'Barchasi' },
    ...Array.from(
      new Set(all.map((es) => es.service?.category?.name).filter(Boolean) as string[])
    ).map((name) => ({ value: name, label: name })),
  ]
  const filtered = category ? all.filter((es) => es.service?.category?.name === category) : all
  const total = all.reduce((s, es) => s + (Number(es.agreedPrice) || 0), 0)
  const confirmedCount = all.filter((es) => es.status === 'CONFIRMED').length
  const pendingCount = all.filter((es) => es.status === 'PENDING').length

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                <Wrench className="text-primary/80 size-4" />
              </div>
              <h1 className="text-foreground text-[20px] font-bold tracking-tight">
                Xizmatlar boshqaruvi
              </h1>
              {all.length > 0 && (
                <span className="text-muted-foreground/50 border-border bg-muted/10 rounded-full border px-2.5 py-0.5 text-[11px]">
                  {all.length} ta
                </span>
              )}
            </div>

            {all.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {confirmedCount > 0 && (
                  <div className="flex h-7 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 text-[11px] font-medium text-emerald-400">
                    <CheckCircle className="size-3" />
                    {confirmedCount} tasdiqlangan
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex h-7 items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/8 px-3 text-[11px] font-medium text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                    {pendingCount} kutilmoqda
                  </div>
                )}
                {total > 0 && (
                  <div className="bg-primary/8 border-primary/20 text-primary flex h-7 items-center rounded-full border px-3 text-[11px] font-medium">
                    Jami: {formatUZS(total)}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setAttachOpen(true)}
            className="bg-primary text-navy hover:bg-primary-light inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-5 text-[13px] font-semibold shadow-[0_4px_16px_rgba(76,140,167,0.2)] transition-all duration-200"
          >
            <Plus className="size-3.5" />
            Xizmat qo'shish
          </button>
        </div>

        <div className="from-primary/30 via-primary/8 h-px bg-linear-to-r to-transparent" />
      </div>

      {/* ── Category chips ── */}
      <div className="flex flex-wrap items-center gap-2">
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={cn(
              'cursor-pointer rounded-full border px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200',
              category === tab.value
                ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-transparent'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Service list ── */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="border-border/60 bg-card/40 rounded-2xl border py-20 text-center">
            <div className="bg-muted/20 border-border/60 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border">
              <Wrench className="text-muted-foreground/30 size-5" />
            </div>
            <p className="text-muted-foreground/40 text-[13px] font-medium">
              Xizmatlar biriktirilmagan
            </p>
            <p className="text-muted-foreground/25 mt-1 text-[12px]">
              Xizmat qo'shish tugmasi orqali qo'shing
            </p>
          </div>
        ) : (
          filtered.map((es: EventService) => {
            const CategoryIcon = CATEGORY_ICON[es.service?.category?.name ?? ''] ?? Wrench
            const status = es.status ?? 'PENDING'
            const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING
            const isPending = status === 'PENDING'
            const isConfirmed = status === 'CONFIRMED'
            const isMutating = statusMutation.isPending || removeMutation.isPending

            return (
              <div
                key={es.id}
                className="group bg-card border-border/60 hover:border-border relative overflow-hidden rounded-2xl border transition-all duration-200"
              >
                {/* Left status accent bar */}
                <div className={cn('absolute top-0 bottom-0 left-0 w-[3px]', cfg.bar)} />

                <div className="flex items-center gap-4 px-5 py-4 pl-6">
                  {/* Category icon */}
                  <div className="bg-primary/8 border-primary/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                    <CategoryIcon className="text-primary/60 size-[18px]" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-[14px] leading-snug font-semibold">
                      {es.service?.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-muted-foreground/50 text-[11px]">
                        {es.service?.category?.name}
                      </span>
                      {(es.service as any)?.city && (
                        <>
                          <span className="text-muted-foreground/25 text-[10px]">•</span>
                          <span className="text-muted-foreground/40 flex items-center gap-0.5 text-[11px]">
                            <MapPin className="size-2.5" />
                            {(es.service as any).city}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-primary/90 text-[15px] leading-none font-bold">
                      {formatUZS(Number(es.agreedPrice))}
                    </p>
                    <p className="text-muted-foreground/30 mt-0.5 text-[10px]">kelishilgan</p>
                  </div>

                  {/* Status badge */}
                  <div
                    className={cn(
                      'hidden h-6 shrink-0 items-center rounded-full border px-2.5 text-[11px] font-medium md:flex',
                      cfg.badge
                    )}
                  >
                    {cfg.label}
                  </div>

                  {/* Actions — revealed on hover */}
                  <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {isPending && (
                      <button
                        onClick={() => statusMutation.mutate({ esId: es.id, status: 'CONFIRMED' })}
                        disabled={isMutating}
                        className="flex h-7 items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-400/8 px-2.5 text-[11px] font-medium text-emerald-400 transition-colors hover:bg-emerald-400/15 disabled:opacity-50"
                      >
                        <CheckCircle className="size-3" />
                        Tasdiqlash
                      </button>
                    )}
                    {(isPending || isConfirmed) && (
                      <button
                        onClick={() => statusMutation.mutate({ esId: es.id, status: 'CANCELLED' })}
                        disabled={isMutating}
                        className="flex h-7 items-center gap-1 rounded-lg border border-amber-400/20 bg-amber-400/8 px-2.5 text-[11px] font-medium text-amber-400 transition-colors hover:bg-amber-400/15 disabled:opacity-50"
                      >
                        <XCircle className="size-3" />
                        Bekor
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Xizmatni o'chirasizmi?")) removeMutation.mutate(es.id)
                      }}
                      disabled={isMutating}
                      className="text-destructive/80 bg-destructive/8 border-destructive/20 hover:bg-destructive/15 flex h-7 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-3" />
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {attachOpen && <AttachModal eventId={id!} onClose={() => setAttachOpen(false)} />}
    </div>
  )
}
