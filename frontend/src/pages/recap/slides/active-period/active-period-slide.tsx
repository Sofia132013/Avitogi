import type { ActivePeriodRecapCard } from "@/entities/recap"
import type { NavigableRecapSlideProps } from "../../recap-slide.types"
import { RecapExplanation, RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { ActiveMonthCard } from "./active-month-card"
import { parseActivePeriod } from "./active-period-data"
import { YearTimeline } from "./year-timeline"

type ActivePeriodSlideProps = NavigableRecapSlideProps<ActivePeriodRecapCard> & {
  mostActiveMonth: string
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
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-24 top-[20%] size-52 rounded-full bg-accent-purple opacity-60 sm:size-72 lg:-left-40 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-16 bottom-[8%] size-44 rounded-full bg-accent-yellow opacity-70 sm:size-64 lg:-right-28 lg:size-80'
            aria-hidden='true'
          />
        </>
      }
      navigation={<RecapSlideNavigation onPrevious={onPrevious} onPrimary={onNext} />}
    >
      <section className='grid min-w-0 flex-1 items-center gap-8 py-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14 xl:py-10'>
        <div className='min-w-0'>
          <RecapSlideHeading badge={`${currentSlide} из ${totalSlides}`} title={card.title} accent='yellow' />

          <RecapExplanation summary='Как определён этот период' text={card.explanation} />
        </div>

        <div className='min-w-0'>
          <ActiveMonthCard activePeriod={activePeriod} />

          <div className='mt-5 rounded-3xl border border-line bg-background/70 p-3 backdrop-blur-sm sm:p-5'>
            <YearTimeline year={timelineYear} activeMonthNumber={activePeriod?.monthNumber} />
          </div>
        </div>
      </section>
    </RecapSlideShell>
  )
}
