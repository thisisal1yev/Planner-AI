import type { ElementType } from 'react'
import { Link } from 'react-router'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@shared/ui/Button'

interface EmptyStateProps {
  icon?: ElementType
  title: string
  description?: string
  action?: { label: string; onClick?: () => void; href?: string }
  variant?: 'page' | 'section'
}

export function EmptyState({
  icon: Icon = SlidersHorizontal,
  title,
  description,
  action,
  variant = 'page',
}: EmptyStateProps) {
  if (variant === 'section') {
    return (
      <div className="border-border rounded-2xl border border-dashed py-12 text-center">
        <Icon className="text-muted-foreground/30 mx-auto mb-3 h-10 w-10" />
        <p className="text-muted-foreground mb-4 text-sm">{title}</p>
        {action && (
          action.href ? (
            <Link to={action.href}>
              <Button size="sm" variant="outline">{action.label}</Button>
            </Link>
          ) : (
            <Button size="sm" variant="outline" onClick={action.onClick}>{action.label}</Button>
          )
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center">
        <Icon className="size-5 text-primary/50" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground/50 mt-1">{description}</p>
        )}
      </div>
      {action && (
        action.href ? (
          <Link to={action.href}>
            <Button size="sm" variant="outline">{action.label}</Button>
          </Link>
        ) : (
          <Button size="sm" variant="outline" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}
