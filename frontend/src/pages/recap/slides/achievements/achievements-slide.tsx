import type { AchievementsRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { RecapProgress } from "../../recap-progress"
import { AchievementCard } from "./achievement-card"
import { AchievementSummary } from "./achievement-summary"

interface AchievementsSlideProps {
  card: AchievementsRecapCard
  year: number
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onFinish: () => void
}

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
    <main className='recap-page-enter relative isolate min-h-dvh overflow-x-hidden'>
      <div
        className='pointer-events-none absolute -left-24 top-[15%] size-52 rounded-full bg-accent-blue opacity-60 sm:size-72 lg:-left-40 lg:size-96'
        aria-hidden='true'
      />

      <div
        className='pointer-events-none absolute -right-20 bottom-[5%] size-48 rounded-full bg-accent-green opacity-60 sm:size-64 lg:-right-28 lg:size-80'
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

        <section className='grid min-w-0 flex-1 items-center gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14'>
          <div className='min-w-0'>
            <span className='inline-flex rounded-full bg-accent-purple px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
              Финал
            </span>

            <h1 className='mt-4 max-w-full wrap-break-words text-3xl font-black leading-[0.92] tracking-[-0.04em] text-balance min-[375px]:text-4xl sm:text-6xl lg:mt-7 lg:text-7xl'>
              {card.title}
            </h1>

            <div className='mt-5'>
              <AchievementSummary earnedCount={earnedCount} totalCount={totalCount} />
            </div>

            <details className='mt-4 rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4'>
              <summary className='cursor-pointer text-sm font-bold'>Как считаются достижения</summary>

              <p className='mt-3 text-sm leading-relaxed text-muted'>{card.explanation}</p>
            </details>
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
            onClick={onFinish}
          >
            Завершить
            <span aria-hidden='true'>✓</span>
          </Button>
        </div>
      </div>
    </main>
  )
}
