import { useCountUp } from "@/shared/lib"

interface CompactMetricProps {
  value: number
  label: string
}

export function CompactMetric({ value, label }: CompactMetricProps) {
  const displayedValue = useCountUp(value, {
    startOffset: 10,
    durationMs: 700,
  })

  return (
    <div className='px-2 py-4 text-center sm:px-4 sm:py-5' aria-label={`${label}: ${value}`}>
      <strong className='block text-2xl font-black tabular-nums sm:text-3xl' aria-hidden='true'>
        {displayedValue}
      </strong>

      <span className='mt-1 block text-[0.7rem] font-medium leading-tight text-muted sm:text-xs'>{label}</span>
    </div>
  )
}
