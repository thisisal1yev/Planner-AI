import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, Link } from 'react-router'
import { servicesApi } from '@entities/service'
import type { UpdateServiceDto } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { Combobox } from '@shared/ui/Combobox'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { serviceKeys, categoryKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { UZBEK_CITIES } from '@shared/lib/uzbekCities'
import { DetailPageSkeleton } from '@shared/ui/DetailPageSkeleton'
import { ArrowLeft, Wrench, MapPin, Upload } from 'lucide-react'

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

export function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const { data: service, isLoading } = useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: () => servicesApi.get(id!),
    enabled: !!id,
  })

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.serviceCategories(),
    queryFn: categoriesApi.listServiceCategories,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateServiceDto>({
    values: service
      ? {
          name: service.name,
          categoryId: service.categoryId,
          description: service.description,
          city: service.city,
          priceFrom: service.priceFrom,
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (dto: UpdateServiceDto) => servicesApi.update(id!, { ...dto, imageUrls }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: serviceKeys.myList() })
      navigate(`/my-services/${id}`)
    },
  })

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  if (isLoading) return <DetailPageSkeleton />

  return (
    <div>
      <div className="mb-8">
        <Link
          to={`/my-services/${id}`}
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {service?.name ?? 'Xizmat'}
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Xizmatni tahrirlash</h1>
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
          icon={<Wrench className="text-primary h-4 w-4" />}
          title="Asosiy ma'lumotlar"
        >
          <Input
            label="Xizmat nomi"
            error={errors.name?.message}
            {...register('name', { required: 'Majburiy maydon' })}
          />
          <Controller
            name="categoryId"
            control={control}
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
            rows={3}
            {...register('description')}
          />
        </SectionCard>

        <SectionCard
          step={2}
          icon={<MapPin className="h-4 w-4 text-emerald-500" />}
          title="Joylashuv va narx"
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
              label="Narx dan (so'm)"
              type="number"
              min={0}
              error={errors.priceFrom?.message}
              {...register('priceFrom', {
                valueAsNumber: true,
                min: { value: 0, message: "Narx manfiy bo'lishi mumkin emas" },
              })}
            />
          </div>
        </SectionCard>

        <SectionCard step={3} icon={<Upload className="h-4 w-4 text-violet-500" />} title="Rasmlar">
          <p className="text-muted-foreground -mt-1 text-sm">
            Mavjud rasmlarni olib tashlash yoki yangi rasmlar qo'shish mumkin.
          </p>
          {service && (
            <ImageDropZone
              key={service.id}
              initialUrls={service.imageUrls ?? []}
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
              onClick={() => navigate(`/my-services/${id}`)}
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
