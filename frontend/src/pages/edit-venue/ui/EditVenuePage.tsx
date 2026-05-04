import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, Link } from 'react-router'
import { venuesApi } from '@entities/venue'
import type { UpdateVenueDto } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { Combobox } from '@shared/ui/Combobox'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { venueKeys } from '@shared/api/queryKeys'
import { UZBEK_CITIES } from '@shared/lib/uzbekCities'
import { DetailPageSkeleton } from '@shared/ui/DetailPageSkeleton'
import { ArrowLeft, Building2, MapPin, LayoutGrid, Upload } from 'lucide-react'

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

export function EditVenuePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const { data: venue, isLoading } = useQuery({
    queryKey: venueKeys.detail(id!),
    queryFn: () => venuesApi.get(id!),
    enabled: !!id,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateVenueDto>({
    values: venue
      ? {
          name: venue.name,
          description: venue.description,
          city: venue.city,
          address: venue.address,
          capacity: venue.capacity,
          pricePerDay: venue.pricePerDay,
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (dto: UpdateVenueDto) => venuesApi.update(id!, { ...dto, imageUrls }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate(`/my-venues/${id}`)
    },
  })

  if (isLoading) return <DetailPageSkeleton />

  return (
    <div>
      <div className="mb-8">
        <Link
          to={`/my-venues/${id}`}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {venue?.name ?? 'Maydon'}
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Maydonni tahrirlash</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          O'zgartirmoqchi bo'lgan maydonlarni yangilang
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-5"
      >
        <SectionCard
          step={1}
          icon={<Building2 className="text-primary h-4 w-4" />}
          title="Asosiy ma'lumotlar"
        >
          <Input
            label="Maydon nomi"
            error={errors.name?.message}
            {...register('name', { required: 'Majburiy maydon' })}
          />
          <Textarea
            label="Tavsif"
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
              error={errors.address?.message}
              {...register('address')}
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
              type="number"
              min={1}
              error={errors.capacity?.message}
              {...register('capacity', {
                valueAsNumber: true,
                min: { value: 1, message: "Kamida 1 kishi bo'lishi kerak" },
              })}
            />
            <Input
              label="Kunlik narx (so'm)"
              type="number"
              min={0}
              error={errors.pricePerDay?.message}
              {...register('pricePerDay', {
                valueAsNumber: true,
                min: { value: 0, message: "Narx manfiy bo'lishi mumkin emas" },
              })}
            />
          </div>
        </SectionCard>

        <SectionCard step={4} icon={<Upload className="h-4 w-4 text-violet-500" />} title="Rasmlar">
          <p className="text-muted-foreground -mt-1 text-sm">
            Mavjud rasmlarni olib tashlash yoki yangi rasmlar qo'shish mumkin.
          </p>
          {venue && (
            <ImageDropZone
              key={venue.id}
              initialUrls={venue.imageUrls ?? []}
              onChange={setImageUrls}
              onUploadingChange={setIsUploadingImages}
              maxImages={3}
            />
          )}
        </SectionCard>

        <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-5">
          {mutation.isError ? (
            <p className="text-destructive text-sm">Saqlashda xatolik yuz berdi</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isUploadingImages
                ? 'Rasmlar yuklanmoqda, iltimos kuting...'
                : "Faqat o'zgartirmoqchi bo'lgan maydonlarni tahrirlang"}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/my-venues/${id}`)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" loading={mutation.isPending} disabled={isUploadingImages}>
              Saqlash
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
