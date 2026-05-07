import { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle, Plus, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface MultiChipSelectOption {
  value: string
  label: string
}

interface MultiChipSelectProps {
  options: MultiChipSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  popularCount?: number
  onCreateOption?: (input: string) => Promise<MultiChipSelectOption>
}

export function MultiChipSelect({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Qidiring yoki qo\'shing...',
  disabled,
  popularCount = 0,
  onCreateOption,
}: MultiChipSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const availableOptions = options.filter((o) => !value.includes(o.value))
  const filtered = query
    ? availableOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : availableOptions
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
    onChange([...value, val])
    setQuery('')
  }

  function handleRemove(e: React.MouseEvent, val: string) {
    e.preventDefault()
    onChange(value.filter((v) => v !== val))
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault()
    if (!onCreateOption || !query.trim()) return
    setCreating(true)
    try {
      const created = await onCreateOption(query.trim())
      onChange([...value, created.value])
      setQuery('')
    } finally {
      setCreating(false)
    }
  }

  const popularOptions = availableOptions.slice(0, popularCount)

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 transition-colors',
          open && 'border-ring ring-3 ring-ring/50',
          error && 'border-destructive',
          error && open && 'ring-destructive/20',
          disabled && 'pointer-events-none opacity-50',
          'cursor-text',
        )}
        onClick={() => {
          inputRef.current?.focus()
          setOpen(true)
        }}
      >
        {value.map((v) => {
          const opt = options.find((o) => o.value === v)
          return (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {opt?.label ?? v}
              <button
                type="button"
                aria-label="Olib tashlash"
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary/20"
                onMouseDown={(e) => handleRemove(e, v)}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )
        })}
        <input
          ref={inputRef}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder={value.length === 0 ? placeholder : ''}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && query === '' && value.length > 0) {
              e.preventDefault()
              onChange(value.slice(0, -1))
            }
          }}
          disabled={disabled}
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {!query && popularCount > 0 && popularOptions.length > 0 && (
            <>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tavsiya
              </p>
              {popularOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
                  onMouseDown={(e) => handleOptionMouseDown(e, opt.value)}
                >
                  <Check className="h-3.5 w-3.5 shrink-0 opacity-0 text-primary" />
                  {opt.label}
                </button>
              ))}
              {availableOptions.length > popularCount && (
                <div className="mx-2 my-1 border-t border-border" />
              )}
            </>
          )}

          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent"
              onMouseDown={(e) => handleOptionMouseDown(e, opt.value)}
            >
              <Check className="h-3.5 w-3.5 shrink-0 opacity-0 text-primary" />
              {opt.label}
            </button>
          ))}

          {filtered.length === 0 && !showCreateRow && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              {query ? 'Topilmadi' : 'Barcha variantlar tanlangan'}
            </p>
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
