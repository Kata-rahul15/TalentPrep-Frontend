import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ExpandableCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
}

export default function ExpandableCard({
  title,
  subtitle,
  icon,
  badge,
  children,
  defaultOpen = false,
  className,
  headerClassName,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('bg-card border border-border rounded-2xl overflow-hidden shadow-sm', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary-bg/40 transition-colors focus:outline-none',
          headerClassName
        )}
        aria-expanded={open}
      >
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-sm text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge}
          <ChevronDown
            className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-divider pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
