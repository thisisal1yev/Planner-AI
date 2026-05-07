import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'

interface TierRowProps {
  tier: { name: string; price: number; quantity: number }
  index: number
  onUpdate: (i: number, field: 'name' | 'price' | 'quantity', value: string | number) => void
  onRemove: (i: number) => void
  showRemove: boolean
}

export function TierRow({ tier, index, onUpdate, onRemove, showRemove }: TierRowProps) {
  return (
    <div className="flex flex-col items-start gap-3 md:flex-row">
      <Input
        label="Nomi"
        value={tier.name}
        onChange={(e) => onUpdate(index, 'name', e.target.value)}
        placeholder="VIP / Standard"
      />
      <Input
        label="Narx (so'm)"
        type="number"
        min={0}
        value={tier.price}
        onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value) || 0)}
      />
      <div className="flex w-full items-end gap-2">
        <Input
          label="Miqdor"
          type="number"
          min={1}
          value={tier.quantity}
          onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 1)}
        />
        {showRemove && (
          <Button type="button" variant="danger" size="sm" onClick={() => onRemove(index)}>
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}
