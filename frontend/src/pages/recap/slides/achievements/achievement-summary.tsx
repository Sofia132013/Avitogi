import { useCountUp } from "@/shared/lib"

interface AchievementSummaryProps {
  earnedCount: number
  totalCount: number
}

export function AchievementSummary({ earnedCount, totalCount }: AchievementSummaryProps) {
  const percentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0

  const displayedEarnedCount = useCountUp(earnedCount, {
    startOffset: 10,
    durationMs: 900,
  })

  const displayedPercentage = useCountUp(percentage, {
    startOffset: 100,
    durationMs: 1100,
  })

  const message =
    earnedCount === totalCount && totalCount > 0
      ? "Полная коллекция! Вы открыли все достижения."
      : earnedCount === 0
        ? "В следующем году здесь появятся ваши первые достижения."
        : "Отличное начало. Остальные достижения ещё впереди."

  return (
    <article
      className='relative overflow-hidden rounded-4xl bg-accent-yellow p-6 text-recap sm:p-8'
      aria-label={`Получено достижений: ${earnedCount} из ${totalCount}`}
    >
      <span className='pointer-events-none absolute -right-8 -top-12 text-[13rem] opacity-15' aria-hidden='true'>
        🏆
      </span>

      <div className='relative'>
        <span className='text-xs font-black uppercase tracking-[0.14em]'>Ваша коллекция</span>

        <div className='mt-8 flex items-end gap-2'>
          <strong
            className='text-7xl font-black leading-none tracking-[-0.08em] tabular-nums sm:text-8xl'
            aria-hidden='true'
          >
            {displayedEarnedCount}
          </strong>

          <span className='pb-1 text-2xl font-black opacity-60 sm:text-3xl'>/ {totalCount}</span>
        </div>

        <div
          className='mt-6 h-3 overflow-hidden rounded-full bg-recap/15'
          role='progressbar'
          aria-label='Прогресс достижений'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <div
            className='h-full rounded-full bg-recap transition-[width] duration-100'
            style={{ width: `${displayedPercentage}%` }}
          />
        </div>

        <div className='mt-3 flex items-start justify-between gap-4'>
          <p className='max-w-md text-sm font-bold leading-relaxed opacity-70'>{message}</p>

          <strong className='shrink-0 text-lg font-black tabular-nums' aria-hidden='true'>
            {displayedPercentage}%
          </strong>
        </div>
      </div>
    </article>
  )
}
