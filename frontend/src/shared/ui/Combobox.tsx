import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Tanlang...',
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const inputId = label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors',
          open && 'border-ring ring-3 ring-ring/50',
          error && 'border-destructive',
          error && open && 'ring-destructive/20',
        )}
      >
        <input
          id={inputId}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          placeholder={open ? 'Qidirish...' : placeholder}
          value={open ? query : selectedLabel}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          disabled={disabled}
          autoComplete="off"
        />
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </div>

      {open && (
        <div className="bg-card border-border absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border shadow-lg">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground px-3 py-2 text-sm">Topilmadi</p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                  value === opt.value && 'text-primary font-medium',
                )}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(opt.value)
                  setOpen(false)
                  setQuery('')
                }}
              >
                <Check
                  className={cn(
                    'text-primary h-3.5 w-3.5 shrink-0',
                    value === opt.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
