import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateUserDto } from '@entities/user'
import { userKeys } from '@shared/api/queryKeys'
import { uploadToImgbb } from '@shared/api/imgbbService'
import { Camera, LoaderCircle } from 'lucide-react'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: userKeys.me(),
    queryFn: usersApi.me,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    values: data ? { firstName: data.firstName, lastName: data.lastName, phone: data.phone } : undefined,
  })

  const mutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.me(), updated)
      if (user) setUser({ ...user, ...updated })
    },
  })

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setAvatarUploadError('Faqat rasm fayllari qabul qilinadi')
      return
    }
    if (file.size > 32 * 1024 * 1024) {
      setAvatarUploadError('Fayl hajmi 32 MB dan oshmasligi kerak')
      return
    }

    setAvatarUploadError(null)
    setIsUploadingAvatar(true)

    try {
      const { url } = await uploadToImgbb(file)
      const updated = await usersApi.updateMe({ avatarUrl: url })
      queryClient.setQueryData(userKeys.me(), updated)
      if (user) setUser({ ...user, ...updated })
    } catch {
      setAvatarUploadError("Rasm yuklashda xatolik yuz berdi")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profil</h1>

      {/* Avatar */}
      <div className="bg-card rounded-xl border border-border p-6 mb-4 flex flex-col items-center gap-3">
        <div
          className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-2xl border-2 border-border bg-primary/8 flex items-center justify-center shadow-sm"
          onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
          role="button"
          aria-label="Profil rasmini o'zgartirish"
          title="Profil rasmini o'zgartirish"
        >
          {data?.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.firstName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-primary text-3xl font-bold select-none">
              {`${data?.firstName?.[0] ?? ''}${data?.lastName?.[0] ?? ''}`.toUpperCase()}
            </span>
          )}
          {isUploadingAvatar ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <LoaderCircle className="h-7 w-7 animate-spin text-white" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-7 w-7 text-white" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />
        <p className="text-sm font-medium text-foreground">{data?.firstName} {data?.lastName}</p>
        {avatarUploadError && (
          <p className="text-xs text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2 w-full text-center">
            {avatarUploadError}
          </p>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-4">
        <p className="text-sm text-muted-foreground mb-1">Email</p>
        <p className="font-medium text-foreground">{data?.email}</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-foreground">Ma'lumotlarni tahrirlash</h2>
        <Input
          label="Ism"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'Majburiy maydon' })}
        />
        <Input
          label="Familiya"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Majburiy maydon' })}
        />
        <Input label="Telefon" {...register('phone')} />
        {mutation.isSuccess && <p className="text-sm text-green-600">Ma'lumotlar saqlandi</p>}
        {mutation.isError && <p className="text-sm text-destructive">Saqlashda xatolik</p>}
        <Button type="submit" loading={mutation.isPending}>Saqlash</Button>
      </form>
    </div>
  )
}
