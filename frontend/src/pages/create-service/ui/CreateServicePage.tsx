import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { servicesApi } from '@entities/service'
import type { CreateServiceDto } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { ChipSelect } from '@shared/ui/ChipSelect'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { serviceKeys, categoryKeys, cityKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { citiesApi } from '@shared/api/citiesApi'
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

export function CreateServicePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateServiceDto>()

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.serviceCategories(),
    queryFn: categoriesApi.listServiceCategories,
  })

  const { data: cities = [] } = useQuery({
    queryKey: cityKeys.list(),
    queryFn: citiesApi.listCities,
  })

  const mutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myList() })
      navigate('/my-services')
    },
  })

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/my-services"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Mening xizmatlarim
        </Link>
        <h1 className="text-foreground text-2xl font-bold">Xizmat qo'shish</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Yangi xizmat yaratish uchun barcha kerakli ma'lumotlarni kiriting
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate({ ...data, imageUrls }))}
        className="flex flex-col gap-5"
      >
        <SectionCard
          step={1}
          icon={<Wrench className="text-primary h-4 w-4" />}
          title="Asosiy ma'lumotlar"
        >
          <Input
            label="Xizmat nomi"
            placeholder="Masalan: Professional fotograf"
            error={errors.name?.message}
            {...register('name', { required: 'Majburiy maydon' })}
          />
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'Majburiy maydon' }}
            render={({ field }) => (
              <ChipSelect
                label="Turkum"
                options={categoryOptions}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.categoryId?.message}
                placeholder="Turkumni tanlang..."
                onCreateOption={async (name) => {
                  const cat = await categoriesApi.createServiceCategory(name)
                  queryClient.invalidateQueries({ queryKey: categoryKeys.serviceCategories() })
                  return { value: cat.id, label: cat.name }
                }}
              />
            )}
          />
          <Textarea
            label="Tavsif"
            placeholder="Xizmat haqida qisqacha ma'lumot..."
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
              rules={{ required: 'Majburiy maydon' }}
              render={({ field }) => (
                <ChipSelect
                  label="Shahar"
                  options={cities}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.city?.message}
                  placeholder="Shaharni tanlang..."
                  popularCount={5}
                  onCreateOption={async (name) => {
                    const opt = await citiesApi.createCity(name)
                    queryClient.invalidateQueries({ queryKey: cityKeys.list() })
                    return opt
                  }}
                />
              )}
            />
            <Input
              label="Narx dan (so'm)"
              placeholder="50 000"
              type="number"
              min={0}
              error={errors.priceFrom?.message}
              {...register('priceFrom', {
                required: 'Majburiy maydon',
                valueAsNumber: true,
                min: { value: 0, message: "Narx manfiy bo'lishi mumkin emas" },
              })}
            />
          </div>
        </SectionCard>

        <SectionCard step={3} icon={<Upload className="h-4 w-4 text-violet-500" />} title="Rasmlar">
          <p className="text-muted-foreground -mt-1 text-sm">
            Xizmatni yaxshiroq ko'rsatish uchun rasmlar yuklang.
          </p>
          <ImageDropZone
            onChange={setImageUrls}
            onUploadingChange={setIsUploadingImages}
            maxImages={3}
          />
        </SectionCard>

        <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-5">
          {mutation.isError ? (
            <p className="text-destructive text-sm">Xizmat yaratishda xatolik yuz berdi</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isUploadingImages
                ? 'Rasmlar yuklanmoqda, iltimos kuting...'
                : "Barcha majburiy maydonlar to'ldirilganiga ishonch hosil qiling"}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/my-services')}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={mutation.isPending} disabled={isUploadingImages}>
              Xizmat yaratish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
