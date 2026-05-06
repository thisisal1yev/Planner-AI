import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import type { CreateEventDto } from '@entities/event'
import { eventKeys, categoryKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { ArrowLeft, CalendarDays, Info, Ticket, ImageIcon } from 'lucide-react'

type CreateEventFormValues = Omit<CreateEventDto, 'bannerUrls' | 'ticketTiers'>

interface TierInput {
  name: string
  price: number
  quantity: number
}

interface SectionCardProps {
  step: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  headerAction?: React.ReactNode
}
function SectionCard({ step, icon, title, children, headerAction }: SectionCardProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
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

export function CreateEventPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tiers, setTiers] = useState<TierInput[]>([{ name: 'Standard', price: 0, quantity: 100 }])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.eventCategories(),
    queryFn: categoriesApi.listEventCategories,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>()

  const mutation = useMutation({
    mutationFn: (values: CreateEventFormValues) =>
      eventsApi.create({ ...values, bannerUrls: imageUrls, ticketTiers: tiers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.myList() })
      navigate('/my-events')
    },
  })

  const addTier = () => setTiers([...tiers, { name: '', price: 0, quantity: 50 }])
  const removeTier = (i: number) => setTiers(tiers.filter((_, idx) => idx !== i))
  const updateTier = (i: number, field: keyof TierInput, value: string | number) =>
    setTiers(tiers.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/my-events"
          className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Mening tadbirlarim
        </Link>
        <h1 className="text-foreground text-3xl font-bold">Tadbir yaratish</h1>
        <p className="text-muted-foreground mt-1">Yangi tadbir ma'lumotlarini kiriting</p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-5"
      >
        <SectionCard
          step={1}
          icon={<Info className="h-4 w-4 text-sky-500" />}
          title="Asosiy ma'lumotlar"
        >
          <Input
            label="Nomi"
            placeholder="Yozgi festival"
            error={errors.title?.message}
            {...register('title', {
              required: 'Majburiy maydon',
              minLength: { value: 3, message: 'Min. 3 belgi' },
            })}
          />
          <Textarea
            label="Tavsif"
            rows={4}
            placeholder="Tadbir tavsifi..."
            {...register('description')}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Kategoriya"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              {...register('categoryId', { required: true })}
            />
            <Input
              label="Shahar"
              placeholder="Toshkent"
              error={errors.city?.message}
              {...register('city', { required: 'Majburiy maydon' })}
            />
            <Input
              label="Sig'imi"
              type="number"
              min={1}
              error={errors.capacity?.message}
              {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={2}
          icon={<CalendarDays className="h-4 w-4 text-emerald-500" />}
          title="Sanalar"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Boshlanish"
              type="datetime-local"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Majburiy maydon' })}
            />
            <Input
              label="Tugash"
              type="datetime-local"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'Majburiy maydon' })}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={3}
          icon={<Ticket className="h-4 w-4 text-violet-500" />}
          title="Chipta turlari"
          headerAction={
            <Button type="button" variant="secondary" size="sm" onClick={addTier}>
              + Qo'shish
            </Button>
          }
        >
          {tiers.map((tier, i) => (
            <div key={i} className="grid grid-cols-3 items-end gap-3">
              <Input
                label="Nomi"
                value={tier.name}
                onChange={(e) => updateTier(i, 'name', e.target.value)}
                placeholder="VIP / Standard"
              />
              <Input
                label="Narx (so'm)"
                type="number"
                min={0}
                value={tier.price}
                onChange={(e) => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
              />
              <div className="flex items-end gap-2">
                <Input
                  label="Miqdor"
                  type="number"
                  min={1}
                  value={tier.quantity}
                  onChange={(e) => updateTier(i, 'quantity', parseInt(e.target.value) || 1)}
                />
                {tiers.length > 1 && (
                  <Button type="button" variant="danger" size="sm" onClick={() => removeTier(i)}>
                    ✕
                  </Button>
                )}
              </div>
            </div>
          ))}
        </SectionCard>

        <SectionCard
          step={4}
          icon={<ImageIcon className="h-4 w-4 text-amber-500" />}
          title="Rasmlar"
        >
          <p className="text-muted-foreground text-sm">
            Tadbir banneri uchun rasm yuklang (ixtiyoriy)
          </p>

          <ImageDropZone
            onChange={setImageUrls}
            onUploadingChange={setIsUploadingImages}
            maxImages={3}
          />
        </SectionCard>

        <div className="bg-card border-border flex items-center justify-between rounded-2xl border px-6 py-4">
          <div className="text-muted-foreground text-sm">
            {isUploadingImages ? (
              'Rasmlar yuklanmoqda...'
            ) : mutation.isError ? (
              <span className="text-destructive">Xatolik yuz berdi</span>
            ) : (
              "Barcha maydonlarni to'ldiring"
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/my-events')}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={mutation.isPending} disabled={isUploadingImages}>
              Tadbir yaratish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
