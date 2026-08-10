import type { RecapMetrics, YearInNumbersRecapCard } from "@/entities/recap"
import type { NavigableRecapSlideProps } from "../../recap-slide.types"
import { RecapExplanation, RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { CompactMetric } from "./compact-metric"
import { MetricCard } from "./metric-card"

type YearInNumbersSlideProps = NavigableRecapSlideProps<YearInNumbersRecapCard> & {
  metrics: RecapMetrics
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
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-20 bottom-[8%] size-48 rounded-full bg-accent-blue sm:size-64 lg:-left-32 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-16 top-[12%] size-32 rounded-full bg-accent-yellow sm:size-48 lg:-right-24 lg:size-72'
            aria-hidden='true'
          />
        </>
      }
      navigation={<RecapSlideNavigation onPrevious={onPrevious} onPrimary={onNext} />}
    >
      <section className='grid flex-1 items-center gap-7 py-7 lg:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.25fr)] lg:gap-16 lg:py-10'>
        <div>
          <RecapSlideHeading
            badge={`${currentSlide} из ${totalSlides}`}
            title={card.title}
            accent='purple'
            size='large'
          />

          <RecapExplanation summary='Как мы это посчитали' text={card.explanation} />
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
    </RecapSlideShell>
  )
}
