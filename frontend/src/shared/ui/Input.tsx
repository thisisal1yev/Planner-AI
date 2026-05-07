import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input as ShadcnInput } from '@/shared/ui/primitives/input'
import { cn } from '@/shared/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-foreground text-sm font-medium">
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(className)}
          {...props}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
