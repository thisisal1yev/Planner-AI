import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

interface FormPageHeaderProps {
  backTo: string
  backLabel: string
  title: string
  description?: string
}

export function FormPageHeader({ backTo, backLabel, title, description }: FormPageHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        to={backTo}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </Link>
      <h1 className="text-foreground text-2xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
    </div>
  )
}
