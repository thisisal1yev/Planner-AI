import { Link } from 'react-router'
import { Button } from '@shared/ui/Button'
import { buttonVariants } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/utils'

interface FormActionsProps {
  cancelTo: string
  cancelLabel?: string
  submitLabel: string
  isPending: boolean
  isDisabled?: boolean
  isUploading?: boolean
  isError?: boolean
  errorMessage?: string
}

export function FormActions({
  cancelTo,
  cancelLabel = 'Bekor qilish',
  submitLabel,
  isPending,
  isDisabled,
  isUploading,
  isError,
  errorMessage,
}: FormActionsProps) {
  return (
    <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-5">
      <p className={cn('text-sm', isError ? 'text-destructive' : 'text-muted-foreground')}>
        {isError
          ? errorMessage
          : isUploading
            ? 'Rasmlar yuklanmoqda, iltimos kuting...'
            : "Barcha majburiy maydonlar to'ldirilganiga ishonch hosil qiling"}
      </p>
      <div className="flex gap-3">
        <Link to={cancelTo} className={cn(buttonVariants({ variant: 'outline' }))}>
          {cancelLabel}
        </Link>
        <Button type="submit" loading={isPending} disabled={isDisabled || isUploading}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
