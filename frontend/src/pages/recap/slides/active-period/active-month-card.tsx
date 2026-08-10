import type { ActivePeriod } from "./active-period-data"

interface ActiveMonthCardProps {
  activePeriod: ActivePeriod | null
}

export function ActiveMonthCard({ activePeriod }: ActiveMonthCardProps) {
  return (
    <article
      className='relative min-h-56 overflow-hidden rounded-4xl bg-accent-green p-6 text-recap sm:min-h-64 sm:p-8 lg:min-h-72'
      aria-label={
        activePeriod
          ? `Самый активный период: ${activePeriod.monthName} ${activePeriod.year}`
          : "Самый активный период не определён"
      }
    >
      <span
        className='pointer-events-none absolute -right-8 -top-10 text-[11rem] opacity-20 sm:text-[15rem]'
        aria-hidden='true'
      >
        📅
      </span>

      <div className='relative flex min-h-44 flex-col justify-between sm:min-h-48 lg:min-h-56'>
        <div className='flex items-start justify-between gap-4'>
          <span className='text-xs font-black uppercase tracking-[0.14em]'>Пик вашей активности</span>

          {activePeriod && (
            <span className='rounded-full bg-recap/10 px-3 py-1 text-xs font-black tabular-nums'>
              {String(activePeriod.monthNumber).padStart(2, "0")} / 12
            </span>
          )}
        </div>

        {activePeriod ? (
          <div>
            <span className='mb-4 block text-5xl sm:text-6xl' aria-hidden='true'>
              📅
            </span>

            <h2 className='text-5xl font-black leading-none tracking-[-0.06em] sm:text-6xl lg:text-7xl'>
              {activePeriod.monthName}
            </h2>

            <p className='mt-2 text-2xl font-black opacity-60 tabular-nums'>{activePeriod.year}</p>
          </div>
        ) : (
          <div>
            <span className='mb-4 block text-5xl' aria-hidden='true'>
              🧭
            </span>

            <h2 className='max-w-md text-3xl font-black leading-tight sm:text-4xl'>Пока не определён</h2>

            <p className='mt-3 max-w-md text-sm font-bold opacity-70 sm:text-base'>
              Недостаточно действий для определения активного месяца
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
