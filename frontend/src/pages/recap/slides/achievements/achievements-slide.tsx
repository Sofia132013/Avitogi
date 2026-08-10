import type { AchievementsRecapCard } from "@/entities/recap"
import type { FinalRecapSlideProps } from "../../recap-slide.types"
import { RecapExplanation, RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { AchievementCard } from "./achievement-card"
import { AchievementSummary } from "./achievement-summary"

type AchievementsSlideProps = FinalRecapSlideProps<AchievementsRecapCard>

export function AchievementsSlide({
  card,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onFinish,
}: AchievementsSlideProps) {
  const earnedCount = card.achievements.filter(achievement => achievement.earned).length

  const totalCount = card.achievements.length
  const shouldStretchLastCard = totalCount % 2 !== 0

  return (
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-24 top-[15%] size-52 rounded-full bg-accent-blue opacity-60 sm:size-72 lg:-left-40 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-20 bottom-[5%] size-48 rounded-full bg-accent-green opacity-60 sm:size-64 lg:-right-28 lg:size-80'
            aria-hidden='true'
          />
        </>
      }
      navigation={
        <RecapSlideNavigation onPrevious={onPrevious} onPrimary={onFinish} primaryLabel='Завершить' primaryIcon='✓' />
      }
    >
      <section className='grid min-w-0 flex-1 items-center gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14'>
        <div className='min-w-0'>
          <RecapSlideHeading badge='Финал' title={card.title} accent='purple' />

          <div className='mt-5'>
            <AchievementSummary earnedCount={earnedCount} totalCount={totalCount} />
          </div>

          <RecapExplanation summary='Как считаются достижения' text={card.explanation} className='mt-4' />
        </div>

        <div className='min-w-0'>
          <div className='mb-4 flex flex-wrap items-end justify-between gap-2'>
            <h2 className='mt-1 text-xl font-black sm:text-2xl'>Коллекция года</h2>
          </div>

          {totalCount > 0 ? (
            <div className='grid min-w-0 gap-3 md:grid-cols-2'>
              {card.achievements.map((achievement, index) => {
                const isLastCard = index === card.achievements.length - 1

                return (
                  <AchievementCard
                    key={achievement.code}
                    achievement={achievement}
                    className={shouldStretchLastCard && isLastCard ? "md:col-span-2" : undefined}
                  />
                )
              })}
            </div>
          ) : (
            <div className='rounded-3xl border border-line bg-surface p-6 text-center'>
              <span className='text-5xl' aria-hidden='true'>
                🏆
              </span>

              <p className='mt-4 font-bold'>Достижения пока отсутствуют</p>
            </div>
          )}
        </div>
      </section>
    </RecapSlideShell>
  )
}
