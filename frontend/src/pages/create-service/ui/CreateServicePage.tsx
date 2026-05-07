import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { servicesApi } from '@entities/service'
import type { CreateServiceDto } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { ChipSelect } from '@shared/ui/ChipSelect'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { SectionCard } from '@shared/ui/SectionCard'
import { FormPageHeader } from '@shared/ui/FormPageHeader'
import { FormActions } from '@shared/ui/FormActions'
import { serviceKeys, categoryKeys, cityKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { citiesApi } from '@shared/api/citiesApi'
import { Wrench, MapPin, Upload } from 'lucide-react'

interface Option {
  value: string
  label: string
}

export function CreateServicePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [pendingCategoryOption, setPendingCategoryOption] = useState<Option | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  const categoryOptions: Option[] = [
    ...categories.map((c) => ({ value: c.id, label: c.name })),
    ...(pendingCategoryOption ? [pendingCategoryOption] : []),
  ]

  return (
    <div>
      <FormPageHeader
        backTo="/my-services"
        backLabel="Mening xizmatlarim"
        title="Xizmat qo'shish"
        description="Yangi xizmat yaratish uchun barcha kerakli ma'lumotlarni kiriting"
      />

      <form
        onSubmit={handleSubmit(async (data) => {
          setIsResolving(true)
          try {
            let categoryId = data.categoryId
            if (categoryId?.startsWith('__new__:')) {
              const name = categoryId.slice(8)
              const cat = await categoriesApi.createServiceCategory(name)
              queryClient.invalidateQueries({ queryKey: categoryKeys.serviceCategories() })
              setValue('categoryId', cat.id)
              categoryId = cat.id
            }

            if (data.city && !cities.some((c) => c.value === data.city)) {
              await citiesApi.createCity(data.city)
              queryClient.invalidateQueries({ queryKey: cityKeys.list() })
            }

            mutation.mutate({ ...data, categoryId, imageUrls })
          } finally {
            setIsResolving(false)
          }
        })}
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
                  const opt = { value: `__new__:${name}`, label: name }
                  setPendingCategoryOption(opt)
                  return opt
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
                  onCreateOption={async (name) => ({ value: name, label: name })}
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

        <FormActions
          cancelTo="/my-services"
          submitLabel="Xizmat yaratish"
          isPending={isResolving || mutation.isPending}
          isDisabled={isUploadingImages}
          isUploading={isUploadingImages}
          isError={mutation.isError}
          errorMessage="Xizmat yaratishda xatolik yuz berdi"
        />
      </form>
    </div>
  )
}
