import type { ActivePeriodRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { RecapProgress } from "../../recap-progress"
import { ActiveMonthCard } from "./active-month-card"
import { parseActivePeriod } from "./active-period-data"
import { YearTimeline } from "./year-timeline"

interface ActivePeriodSlideProps {
  card: ActivePeriodRecapCard
  mostActiveMonth: string
  year: number
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onNext: () => void
}

export function ActivePeriodSlide({
  card,
  mostActiveMonth,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: ActivePeriodSlideProps) {
  const activePeriod = parseActivePeriod(mostActiveMonth)
  const timelineYear = activePeriod?.year ?? year

  return (
    <main className='recap-page-enter relative isolate min-h-dvh overflow-x-hidden'>
      <div
        className='pointer-events-none absolute -left-24 top-[20%] size-52 rounded-full bg-accent-purple opacity-60 sm:size-72 lg:-left-40 lg:size-96'
        aria-hidden='true'
      />

      <div
        className='pointer-events-none absolute -right-16 bottom-[8%] size-44 rounded-full bg-accent-yellow opacity-70 sm:size-64 lg:-right-28 lg:size-80'
        aria-hidden='true'
      />

      <div className='relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12'>
        <RecapProgress currentSlide={currentSlide} totalSlides={totalSlides} />

        <header className='mt-5 flex items-center justify-between'>
          <span className='text-xl font-black tracking-tight'>Avitogi</span>

          <span className='rounded-full bg-muted-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]'>
            Итоги {year}
          </span>
        </header>

        <section className='grid min-w-0 flex-1 items-center gap-8 py-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14 xl:py-10'>
          <div className='min-w-0'>
            <span className='inline-flex rounded-full bg-accent-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
              {currentSlide} из {totalSlides}
            </span>

            <h1 className='mt-4 max-w-full wrap-break-words text-3xl font-black leading-[0.92] tracking-[-0.04em] text-balance min-[375px]:text-4xl sm:text-6xl lg:mt-7 lg:text-7xl'>
              {card.title}
            </h1>

            <p className='mt-4 max-w-xl text-base font-medium leading-relaxed text-muted sm:text-lg'>
              {card.description}
            </p>

            <details className='mt-5 rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4'>
              <summary className='cursor-pointer text-sm font-bold'>Как определён этот период</summary>

              <p className='mt-3 text-sm leading-relaxed text-muted'>{card.explanation}</p>
            </details>
          </div>

          <div className='min-w-0'>
            <ActiveMonthCard activePeriod={activePeriod} />

            <div className='mt-5 rounded-3xl border border-line bg-background/70 p-3 backdrop-blur-sm sm:p-5'>
              <YearTimeline year={timelineYear} activeMonthNumber={activePeriod?.monthNumber} />
            </div>
          </div>
        </section>

        <div className='flex min-w-0 items-center justify-between gap-3 pb-1'>
          <Button
            type='button'
            variant='secondary'
            size='lg'
            className='min-w-0 flex-1 gap-1 px-3 text-sm sm:flex-none sm:gap-2 sm:px-8 sm:text-base'
            onClick={onPrevious}
          >
            <span aria-hidden='true'>←</span>
            Назад
          </Button>

          <Button
            type='button'
            variant='primary'
            size='lg'
            className='min-w-0 flex-1 gap-1 px-3 text-sm sm:flex-none sm:gap-2 sm:px-8 sm:text-base'
            onClick={onNext}
          >
            Дальше
            <span aria-hidden='true'>→</span>
          </Button>
        </div>
      </div>
    </main>
  )
}
