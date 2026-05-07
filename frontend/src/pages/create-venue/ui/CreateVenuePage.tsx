import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { venuesApi } from '@entities/venue'
import type { CreateVenueDto } from '@entities/venue'
import { useNavigate } from 'react-router'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { ChipSelect } from '@shared/ui/ChipSelect'
import { MultiChipSelect } from '@shared/ui/MultiChipSelect'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { SectionCard } from '@shared/ui/SectionCard'
import { FormPageHeader } from '@shared/ui/FormPageHeader'
import { FormActions } from '@shared/ui/FormActions'
import { venueKeys, categoryKeys, cityKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { citiesApi } from '@shared/api/citiesApi'
import { Building2, MapPin, LayoutGrid, Upload, SlidersHorizontal } from 'lucide-react'

interface Option {
  value: string
  label: string
}

export function CreateVenuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [selectedCharacteristicIds, setSelectedCharacteristicIds] = useState<string[]>([])
  const [isResolving, setIsResolving] = useState(false)
  const [pendingCategoryOption, setPendingCategoryOption] = useState<Option | null>(null)
  const [pendingCharacteristicOptions, setPendingCharacteristicOptions] = useState<Option[]>([])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateVenueDto>()

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.venueCategories(),
    queryFn: categoriesApi.listVenueCategories,
  })

  const { data: cities = [] } = useQuery({
    queryKey: cityKeys.list(),
    queryFn: citiesApi.listCities,
  })

  const { data: characteristics = [] } = useQuery({
    queryKey: venueKeys.characteristics(),
    queryFn: venuesApi.listCharacteristics,
  })

  const mutation = useMutation({
    mutationFn: venuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate('/my-venues')
    },
  })

  const categoryOptions: Option[] = [
    ...categories.map((c) => ({ value: c.id, label: c.name })),
    ...(pendingCategoryOption ? [pendingCategoryOption] : []),
  ]

  const characteristicOptions: Option[] = [
    ...characteristics.map((c) => ({ value: c.id, label: c.name })),
    ...pendingCharacteristicOptions,
  ]

  return (
    <div>
      <FormPageHeader
        backTo="/my-venues"
        backLabel="Mening maydonlarim"
        title="Maydon qo'shish"
        description="Yangi maydon yaratish uchun barcha kerakli ma'lumotlarni kiriting"
      />

      <form
        onSubmit={handleSubmit(async (data) => {
          setIsResolving(true)
          try {
            let categoryId = data.categoryId
            if (categoryId?.startsWith('__new__:')) {
              const name = categoryId.slice(8)
              const cat = await categoriesApi.createVenueCategory(name)
              queryClient.invalidateQueries({ queryKey: categoryKeys.venueCategories() })
              setValue('categoryId', cat.id)
              categoryId = cat.id
            }

            if (data.city && !cities.some((c) => c.value === data.city)) {
              await citiesApi.createCity(data.city)
              queryClient.invalidateQueries({ queryKey: cityKeys.list() })
            }

            const resolvedCharIds = await Promise.all(
              selectedCharacteristicIds.map(async (id) => {
                if (!id.startsWith('__new__:')) return id
                const name = id.slice(8)
                const c = await venuesApi.createCharacteristic(name)
                queryClient.invalidateQueries({ queryKey: venueKeys.characteristics() })
                return c.id
              }),
            )

            mutation.mutate({ ...data, categoryId, imageUrls, characteristicIds: resolvedCharIds })
          } finally {
            setIsResolving(false)
          }
        })}
        className="flex flex-col gap-5"
      >
        <SectionCard step={1} icon={<Building2 className="text-primary h-4 w-4" />} title="Asosiy ma'lumotlar">
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
            placeholder="Maydon haqida qisqacha ma'lumot..."
            rows={3}
            {...register('description')}
          />
        </SectionCard>

        <SectionCard step={2} icon={<MapPin className="h-4 w-4 text-emerald-500" />} title="Joylashuv">
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

        <SectionCard step={3} icon={<LayoutGrid className="h-4 w-4 text-amber-500" />} title="Hajm va narx">
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

        <SectionCard step={4} icon={<SlidersHorizontal className="h-4 w-4 text-sky-500" />} title="Xususiyatlar">
          <MultiChipSelect
            options={characteristicOptions}
            value={selectedCharacteristicIds}
            onChange={setSelectedCharacteristicIds}
            placeholder="Xususiyat qidiring yoki qo'shing..."
            popularCount={5}
            onCreateOption={async (name) => {
              const opt = { value: `__new__:${name}`, label: name }
              setPendingCharacteristicOptions((prev) => [...prev, opt])
              return opt
            }}
          />
        </SectionCard>

        <SectionCard step={5} icon={<Upload className="h-4 w-4 text-violet-500" />} title="Rasmlar">
          <p className="text-muted-foreground -mt-1 text-sm">
            Maydonning rasmlarini yuklang. Birinchi rasm asosiy rasm sifatida ko'rsatiladi.
          </p>
          <ImageDropZone onChange={setImageUrls} onUploadingChange={setIsUploadingImages} maxImages={3} />
        </SectionCard>

        <FormActions
          cancelTo="/my-venues"
          submitLabel="Maydon yaratish"
          isPending={isResolving || mutation.isPending}
          isDisabled={isUploadingImages}
          isUploading={isUploadingImages}
          isError={mutation.isError}
          errorMessage="Maydon yaratishda xatolik yuz berdi"
        />
      </form>
    </div>
  )
}
