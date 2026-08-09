import { cn, useCountUp } from "@/shared/lib"

interface MetricCardProps {
  value: number
  label: string
  className?: string
}

export function MetricCard({ value, label, className }: MetricCardProps) {
  const displayedValue = useCountUp(value, {
    startOffset: 10,
    durationMs: 900,
  })

  return (
    <article
      className={cn(
        "flex min-h-32 flex-col justify-between rounded-3xl p-4 text-recap",
        "sm:min-h-40 sm:p-6",
        "lg:min-h-48",
        className,
      )}
      aria-label={`${label}: ${value}`}
    >
      <strong
        className='text-5xl font-black leading-none tracking-[-0.06em] tabular-nums sm:text-6xl lg:text-7xl'
        aria-hidden='true'
      >
        {displayedValue}
      </strong>

      <span className='mt-5 text-sm font-black leading-tight sm:text-base lg:text-lg'>{label}</span>
    </article>
  )
}
