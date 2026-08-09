import type { RecapMetrics, YearInNumbersRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { RecapProgress } from "../../recap-progress"

import { CompactMetric } from "./compact-metric"
import { MetricCard } from "./metric-card"

interface YearInNumbersSlideProps {
  card: YearInNumbersRecapCard
  metrics: RecapMetrics
  year: number
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onNext: () => void
}

export function YearInNumbersSlide({
  card,
  metrics,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: YearInNumbersSlideProps) {
  return (
    <main className='recap-page-enter relative isolate min-h-dvh overflow-hidden'>
      <div
        className='pointer-events-none absolute -left-20 bottom-[8%] size-48 rounded-full bg-accent-blue sm:size-64 lg:-left-32 lg:size-96'
        aria-hidden='true'
      />

      <div
        className='pointer-events-none absolute -right-16 top-[12%] size-32 rounded-full bg-accent-yellow sm:size-48 lg:-right-24 lg:size-72'
        aria-hidden='true'
      />

      <div className='relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12'>
        <RecapProgress currentSlide={currentSlide} totalSlides={totalSlides} />

        <header className='mt-5 flex items-center justify-between'>
          <span className='text-xl font-black tracking-tight'>Avitogi</span>

          <span className='rounded-full bg-muted-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]'>
            Итоги {year}
          </span>
        </header>

        <section className='grid flex-1 items-center gap-7 py-7 lg:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.25fr)] lg:gap-16 lg:py-10'>
          {/* Заголовок и пояснение */}
          <div>
            <span className='inline-flex rounded-full bg-accent-purple px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
              {currentSlide} из {totalSlides}
            </span>

            <h1 className='mt-5 text-5xl font-black leading-[0.9] tracking-[-0.04em] text-balance sm:text-6xl lg:mt-8 lg:text-8xl'>
              {card.title}
            </h1>

            <details className='mt-5 max-w-xl rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4'>
              <summary className='cursor-pointer text-sm font-bold'>Как мы это посчитали</summary>

              <p className='mt-3 text-sm leading-relaxed'>{card.explanation}</p>
            </details>
          </div>
          <div>
            <div className='grid grid-cols-2 gap-3 sm:gap-4' aria-label='Основные показатели за год'>
              <MetricCard value={metrics.activeDays} label='активных дней' className='bg-accent-blue' />

              <MetricCard value={metrics.viewedAds} label='просмотров объявлений' className='bg-accent-purple' />

              <MetricCard value={metrics.favorites} label='добавлено в избранное' className='bg-accent-green' />

              <MetricCard value={metrics.contactsStarted} label='обращений к продавцам' className='bg-accent-yellow' />
            </div>

            <div className='mt-3 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-surface sm:mt-4'>
              <CompactMetric value={metrics.activeMonths} label='активных месяцев' />

              <CompactMetric value={metrics.viewedCategories} label='категорий просмотрено' />

              <CompactMetric value={metrics.createdAds} label='объявлений опубликовано' />
            </div>
          </div>
        </section>

        <div className='flex items-center justify-between gap-3 pb-1'>
          <Button type='button' variant='secondary' size='lg' className='flex-1 sm:flex-none' onClick={onPrevious}>
            <span aria-hidden='true'>←</span>
            Назад
          </Button>

          <Button type='button' variant='primary' size='lg' className='flex-1 sm:flex-none' onClick={onNext}>
            Дальше
            <span aria-hidden='true'>→</span>
          </Button>
        </div>
      </div>
    </main>
  )
}
