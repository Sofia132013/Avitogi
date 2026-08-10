import { cn } from "@/shared/lib"
import { MONTHS } from "./active-period-data"

interface YearTimelineProps {
  year: number
  activeMonthNumber?: number
}

export function YearTimeline({ year, activeMonthNumber }: YearTimelineProps) {
  return (
    <section aria-labelledby='year-timeline-title'>
      <div className='mb-3 flex items-center justify-between gap-4'>
        <h2 id='year-timeline-title' className='text-lg font-black sm:text-xl'>
          Активность по году
        </h2>

        <span className='text-sm font-bold text-muted tabular-nums'>{year}</span>
      </div>

      <ol className='grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3'>
        {MONTHS.map((month, index) => {
          const monthNumber = index + 1
          const isActive = monthNumber === activeMonthNumber

          return (
            <li key={month.name} className='min-w-0'>
              <div
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center rounded-2xl border px-1 py-2 transition",
                  isActive ? "border-accent-purple bg-accent-purple text-recap" : "border-line bg-surface text-muted",
                )}
                aria-label={isActive ? `${month.name} ${year} — самый активный месяц` : `${month.name} ${year}`}
                aria-current={isActive ? "date" : undefined}
              >
                <span className='text-xs font-black sm:text-sm'>{month.shortName}</span>

                <span
                  className={cn("mt-2 size-2 rounded-full", isActive ? "bg-recap" : "bg-line")}
                  aria-hidden='true'
                />
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
