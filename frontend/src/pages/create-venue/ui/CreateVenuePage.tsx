import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { venuesApi } from '@entities/venue'
import type { CreateVenueDto } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { Combobox } from '@shared/ui/Combobox'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { venueKeys, categoryKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { UZBEK_CITIES } from '@shared/lib/uzbekCities'
import { ArrowLeft, Building2, MapPin, LayoutGrid, Upload, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

function SectionCard({
  step,
  icon,
  title,
  children,
}: {
  step: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="border-border flex items-center gap-3 border-b px-6 py-4">
        <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {step}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-foreground font-semibold">{title}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6">{children}</div>
    </div>
  )
}

export function CreateVenuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [selectedCharacteristicIds, setSelectedCharacteristicIds] = useState<string[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVenueDto>()

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.venueCategories(),
    queryFn: categoriesApi.listVenueCategories,
  })

  const { data: characteristics = [] } = useQuery({
    queryKey: venueKeys.characteristics(),
    queryFn: venuesApi.listCharacteristics,
  })

  function toggleCharacteristic(id: string) {
    setSelectedCharacteristicIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const mutation = useMutation({
    mutationFn: venuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate('/my-venues')
    },
  })

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/my-venues"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mening maydonlarim
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Maydon qo'shish</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Yangi maydon yaratish uchun barcha kerakli ma'lumotlarni kiriting
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          mutation.mutate({ ...data, imageUrls, characteristicIds: selectedCharacteristicIds }),
        )}
        className="flex flex-col gap-5"
      >
        <SectionCard
          step={1}
          icon={<Building2 className="text-primary h-4 w-4" />}
          title="Asosiy ma'lumotlar"
        >
          <Input
            label="Maydon nomi"
            placeholder="Masalan: Grand Hall"
            error={errors.name?.message}
            {...register('name', { required: 'Majburiy maydon' })}
          />
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'Majburiy maydon' }}
            render={({ field }) => (
              <Combobox
                label="Turkum"
                options={categoryOptions}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.categoryId?.message}
                placeholder="Turkumni tanlang..."
              />
            )}
          />
          <Textarea
            label="Tavsif"
            placeholder="Maydon haqida qisqacha ma'lumot..."
            rows={3}
            {...register('description')}
          />
        </SectionCard>

        <SectionCard
          step={2}
          icon={<MapPin className="h-4 w-4 text-emerald-500" />}
          title="Joylashuv"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="city"
              control={control}
              rules={{ required: 'Majburiy maydon' }}
              render={({ field }) => (
                <Combobox
                  label="Shahar"
                  options={UZBEK_CITIES}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.city?.message}
                  placeholder="Shaharni tanlang..."
                />
              )}
            />
            <Input
              label="Manzil"
              placeholder="Ko'cha nomi, bino raqami"
              error={errors.address?.message}
              {...register('address', { required: 'Majburiy maydon' })}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Kenglik (ixtiyoriy)"
              placeholder="41.2995"
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
            />
            <Input
              label="Uzunlik (ixtiyoriy)"
              placeholder="69.2401"
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={3}
          icon={<LayoutGrid className="h-4 w-4 text-amber-500" />}
          title="Hajm va narx"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Sig'imi (kishi)"
              placeholder="100"
              type="number"
              min={1}
              error={errors.capacity?.message}
              {...register('capacity', {
                required: 'Majburiy maydon',
                valueAsNumber: true,
                min: { value: 1, message: "Kamida 1 kishi bo'lishi kerak" },
              })}
            />
            <Input
              label="Kunlik narx (so'm)"
              placeholder="500 000"
              type="number"
              min={0}
              error={errors.pricePerDay?.message}
              {...register('pricePerDay', {
                required: 'Majburiy maydon',
                valueAsNumber: true,
                min: { value: 0, message: "Narx manfiy bo'lishi mumkin emas" },
              })}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={4}
          icon={<SlidersHorizontal className="h-4 w-4 text-sky-500" />}
          title="Xususiyatlar"
        >
          {characteristics.length === 0 ? (
            <p className="text-muted-foreground text-sm">Xususiyatlar mavjud emas</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {characteristics.map((c) => {
                const checked = selectedCharacteristicIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCharacteristic(c.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                      checked
                        ? 'border-primary/30 bg-primary/8 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                        checked ? 'border-primary bg-primary' : 'border-input',
                      )}
                    >
                      {checked && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {c.name}
                  </button>
                )
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard step={5} icon={<Upload className="h-4 w-4 text-violet-500" />} title="Rasmlar">
          <p className="text-muted-foreground -mt-1 text-sm">
            Maydonning rasmlarini yuklang. Birinchi rasm asosiy rasm sifatida ko'rsatiladi.
          </p>
          <ImageDropZone
            onChange={setImageUrls}
            onUploadingChange={setIsUploadingImages}
            maxImages={3}
          />
        </SectionCard>

        <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-5">
          {mutation.isError ? (
            <p className="text-destructive text-sm">Maydon yaratishda xatolik yuz berdi</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isUploadingImages
                ? 'Rasmlar yuklanmoqda, iltimos kuting...'
                : "Barcha majburiy maydonlar to'ldirilganiga ishonch hosil qiling"}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/my-venues')}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={mutation.isPending} disabled={isUploadingImages}>
              Maydon yaratish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
