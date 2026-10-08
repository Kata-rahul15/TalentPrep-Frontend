import { cn } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
  color?: string
}

const sizeMap = {
  sm: { outer: 52, stroke: 4.5, font: 'text-xs', labelFont: 'text-[9px]' },
  md: { outer: 72, stroke: 6, font: 'text-base font-extrabold', labelFont: 'text-[10px]' },
  lg: { outer: 96, stroke: 7.5, font: 'text-2xl font-black', labelFont: 'text-xs' },
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#16A34A'
  if (score >= 60) return '#F59E0B'
  return '#DC2626'
}

export default function ScoreRing({
  score,
  size = 'md',
  label,
  className,
  color,
}: ScoreRingProps) {
  const { outer, stroke, font, labelFont } = sizeMap[size]
  const radius = (outer - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score, 0), 100)
  const offset = circumference - (progress / 100) * circumference
  const ringColor = color ?? getScoreColor(score)
  const center = outer / 2

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <svg width={outer} height={outer} className="-rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      {/* Center text overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: outer, height: outer }}
      >
        <span className={cn('font-heading leading-none', font)} style={{ color: ringColor }}>
          {score}
        </span>
        {label && (
          <span className={cn('text-muted-foreground font-medium mt-0.5', labelFont)}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// Wrapper that handles the positioning
export function ScoreRingContainer({
  score,
  size = 'md',
  label,
  className,
  color,
}: ScoreRingProps) {
  const { outer } = sizeMap[size]
  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: outer, height: outer }}>
      <ScoreRing score={score} size={size} label={label} color={color} />
    </div>
  )
}
