import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLoadingProps {
  message?: string
  className?: string
}

export function PageLoading({ message = 'Loading...', className }: PageLoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4', className)}>
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  )
}

interface PageErrorProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function PageError({ message = 'Something went wrong.', onRetry, className }: PageErrorProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 gap-4 text-center', className)}>
      <div className="w-14 h-14 rounded-full bg-danger/10 text-danger flex items-center justify-center">
        <span className="text-2xl">!</span>
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">Failed to load</p>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-4 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-secondary-bg/50 text-muted-foreground flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <p className="font-heading font-semibold text-foreground mb-1">{title}</p>
        {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
  secondary: 'bg-card border border-border hover:bg-secondary-bg text-foreground',
  ghost: 'hover:bg-secondary-bg text-secondary-foreground',
  danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-sm rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5 flex items-center gap-4', className)}>
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
        <p className="font-heading font-bold text-xl text-foreground">{value}</p>
      </div>
    </div>
  )
}
