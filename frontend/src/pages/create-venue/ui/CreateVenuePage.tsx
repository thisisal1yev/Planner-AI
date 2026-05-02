import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { venuesApi } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { Select } from '@shared/ui/Select'
import type { CreateVenueDto } from '@entities/venue'
import { venueKeys, categoryKeys } from '@shared/api/queryKeys'
import { categoriesApi } from '@shared/api/categoriesApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/primitives/card'

export function CreateVenuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVenueDto>()

  const { data: categories = [] } = useQuery({
    queryKey: categoryKeys.venueCategories(),
    queryFn: categoriesApi.listVenueCategories,
  })

  const mutation = useMutation({
    mutationFn: venuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate('/my-venues')
    },
  })

  return (
    <div className="max-w-2xl">
      <h1 className="text-foreground mb-6 text-2xl font-bold">Maydon qo'shish</h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="flex flex-col gap-6"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Asosiy ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            <Input
              label="Nomi"
              error={errors.name?.message}
              {...register('name', { required: 'Majburiy maydon' })}
            />

            <Select
              label="Turkum"
              error={errors.categoryId?.message}
              options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
              {...register('categoryId', { required: 'Majburiy maydon' })}
            />
            <Textarea label="Tavsif" rows={3} {...register('description')} />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Shahar"
                error={errors.city?.message}
                {...register('city', { required: 'Majburiy maydon' })}
              />
              <Input
                label="Manzil"
                error={errors.address?.message}
                {...register('address', { required: 'Majburiy maydon' })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sig'imi"
                type="number"
                min={1}
                {...register('capacity', { required: true, valueAsNumber: true })}
              />
              <Input
                label="Kunlik narx (so'm)"
                type="number"
                min={0}
                {...register('pricePerDay', { required: true, valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {mutation.isError && <p className="text-destructive text-sm">Maydon yaratishda xatolik</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>
            Maydon yaratish
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-venues')}>
            Bekor qilish
          </Button>
        </div>
      </form>
    </div>
  )
}
