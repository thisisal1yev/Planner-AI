import { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle, Plus, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ChipSelectOption {
  value: string
  label: string
}

interface ChipSelectProps {
  options: ChipSelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  popularCount?: number
  onCreateOption?: (input: string) => Promise<ChipSelectOption>
}

export function ChipSelect({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Tanlang...',
  disabled,
  popularCount = 0,
  onCreateOption,
}: ChipSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value) ?? null
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options
  const showCreateRow = !!onCreateOption && !!query.trim() && filtered.length === 0

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleOptionMouseDown(e: React.MouseEvent, val: string) {
    e.preventDefault()
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  function handleClearChip(e: React.MouseEvent) {
    e.preventDefault()
    onChange('')
    setOpen(true)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault()
    if (!onCreateOption || !query.trim()) return
    setCreating(true)
    try {
      const created = await onCreateOption(query.trim())
      onChange(created.value)
      setOpen(false)
      setQuery('')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div
        className={cn(
          'flex min-h-9 w-full items-center rounded-lg border border-input bg-transparent px-2.5 py-1 transition-colors',
          open && 'border-ring ring-3 ring-ring/50',
          error && 'border-destructive',
          error && open && 'ring-destructive/20',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {selectedOption ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {selectedOption.label}
            <button
              type="button"
              aria-label="Tanlovni olib tashlash"
              className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary/20"
              onMouseDown={handleClearChip}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ) : (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={open ? 'Qidirish...' : placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            autoComplete="off"
          />
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {!query && popularCount > 0 && options.length > 0 && (
            <>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tavsiya
              </p>
              {options.slice(0, popularCount).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                    value === opt.value && 'font-medium text-primary',
                  )}
                  onMouseDown={(e) => handleOptionMouseDown(e, opt.value)}
                >
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 text-primary',
                      value === opt.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {opt.label}
                </button>
              ))}
              {options.length > popularCount && (
                <div className="mx-2 my-1 border-t border-border" />
              )}
            </>
          )}

          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent',
                value === opt.value && 'font-medium text-primary',
              )}
              onMouseDown={(e) => handleOptionMouseDown(e, opt.value)}
            >
              <Check
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-primary',
                  value === opt.value ? 'opacity-100' : 'opacity-0',
                )}
              />
              {opt.label}
            </button>
          ))}

          {filtered.length === 0 && !showCreateRow && (
            <p className="px-3 py-2 text-sm text-muted-foreground">Topilmadi</p>
          )}

          {showCreateRow && (
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary transition-colors hover:bg-accent disabled:opacity-50"
              onMouseDown={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5 shrink-0" />
              )}
              Qo'shish: "{query.trim()}"
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
