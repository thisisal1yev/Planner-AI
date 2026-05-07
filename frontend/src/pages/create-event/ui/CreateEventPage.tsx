import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { eventsApi } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { ChipSelect } from '@shared/ui/ChipSelect'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { ImageDropZone } from '@shared/ui/ImageDropZone'
import { SectionCard } from '@shared/ui/SectionCard'
import { FormPageHeader } from '@shared/ui/FormPageHeader'
import { FormActions } from '@shared/ui/FormActions'
import { TierRow } from './TierRow'
import type { CreateEventDto } from '@entities/event'
import { eventKeys, categoryKeys, cityKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { citiesApi } from '@shared/api/citiesApi'
import { CalendarDays, Info, Ticket, ImageIcon } from 'lucide-react'

type CreateEventFormValues = Omit<CreateEventDto, 'bannerUrls' | 'ticketTiers'>

interface TierInput {
  name: string
  price: number
  quantity: number
}

interface Option {
  value: string
  label: string
}

export function CreateEventPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tiers, setTiers] = useState<TierInput[]>([{ name: 'Standard', price: 0, quantity: 100 }])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [pendingCategoryOption, setPendingCategoryOption] = useState<Option | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.eventCategories(),
    queryFn: categoriesApi.listEventCategories,
  })

  const { data: cities = [] } = useQuery({
    queryKey: cityKeys.list(),
    queryFn: citiesApi.listCities,
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  const categoryOptions: Option[] = [
    ...categories.map((c) => ({ value: c.id, label: c.name })),
    ...(pendingCategoryOption ? [pendingCategoryOption] : []),
  ]

  const addTier = () => setTiers([...tiers, { name: '', price: 0, quantity: 50 }])
  const removeTier = (i: number) => setTiers(tiers.filter((_, idx) => idx !== i))
  const updateTier = (i: number, field: keyof TierInput, value: string | number) =>
    setTiers(tiers.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div>
      <FormPageHeader
        backTo="/my-events"
        backLabel="Mening tadbirlarim"
        title="Tadbir yaratish"
        description="Yangi tadbir ma'lumotlarini kiriting"
      />

      <form
        onSubmit={handleSubmit(async (data) => {
          setIsResolving(true)
          try {
            let categoryId = data.categoryId
            if (categoryId?.startsWith('__new__:')) {
              const name = categoryId.slice(8)
              const cat = await categoriesApi.createEventCategory(name)
              queryClient.invalidateQueries({ queryKey: categoryKeys.eventCategories() })
              setValue('categoryId', cat.id)
              categoryId = cat.id
            }

            if (data.city && !cities.some((c) => c.value === data.city)) {
              await citiesApi.createCity(data.city)
              queryClient.invalidateQueries({ queryKey: cityKeys.list() })
            }

            mutation.mutate({ ...data, categoryId })
          } finally {
            setIsResolving(false)
          }
        })}
        className="flex flex-col gap-5"
      >
        <SectionCard step={1} icon={<Info className="h-4 w-4 text-sky-500" />} title="Asosiy ma'lumotlar">
          <Input
            label="Nomi"
            placeholder="Yozgi festival"
            error={errors.title?.message}
            {...register('title', {
              required: 'Majburiy maydon',
              minLength: { value: 3, message: 'Min. 3 belgi' },
            })}
          />
          <Textarea label="Tavsif" rows={4} placeholder="Tadbir tavsifi..." {...register('description')} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Majburiy maydon' }}
              render={({ field }) => (
                <ChipSelect
                  label="Kategoriya"
                  options={categoryOptions}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  error={errors.categoryId?.message}
                  placeholder="Kategoriyani tanlang..."
                  onCreateOption={async (name) => {
                    const opt = { value: `__new__:${name}`, label: name }
                    setPendingCategoryOption(opt)
                    return opt
                  }}
                />
              )}
            />
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
              label="Sig'imi"
              type="number"
              min={1}
              error={errors.capacity?.message}
              {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
            />
          </div>
        </SectionCard>

        <SectionCard step={2} icon={<CalendarDays className="h-4 w-4 text-emerald-500" />} title="Sanalar">
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
            <TierRow
              key={i}
              tier={tier}
              index={i}
              onUpdate={updateTier}
              onRemove={removeTier}
              showRemove={tiers.length > 1}
            />
          ))}
        </SectionCard>

        <SectionCard step={4} icon={<ImageIcon className="h-4 w-4 text-amber-500" />} title="Rasmlar">
          <p className="text-muted-foreground text-sm">
            Tadbir banneri uchun rasm yuklang (ixtiyoriy)
          </p>
          <ImageDropZone onChange={setImageUrls} onUploadingChange={setIsUploadingImages} maxImages={3} />
        </SectionCard>

        <FormActions
          cancelTo="/my-events"
          submitLabel="Tadbir yaratish"
          isPending={isResolving || mutation.isPending}
          isDisabled={isUploadingImages}
          isUploading={isUploadingImages}
          isError={mutation.isError}
          errorMessage="Xatolik yuz berdi"
        />
      </form>
    </div>
  )
}
