import type { MainCategoryRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { RecapProgress } from "../../recap-progress"
import { CategorySpotlight } from "./category-spotlight"
import { getMainCategoryName, parseRelatedCategories } from "./main-category-data"
import { RelatedCategoryCard } from "./related-category-card"

interface MainCategorySlideProps {
  card: MainCategoryRecapCard
  year: number
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onNext: () => void
}

export function MainCategorySlide({
  card,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: MainCategorySlideProps) {
  const categoryName = getMainCategoryName(card.description)
  const relatedCategories = parseRelatedCategories(card.explanation)

  return (
    <main className='recap-page-enter relative isolate min-h-dvh overflow-x-hidden'>
      <div
        className='pointer-events-none absolute -left-24 bottom-[5%] size-56 rounded-full bg-accent-yellow opacity-70 sm:size-72 lg:-left-40 lg:size-96'
        aria-hidden='true'
      />

      <div
        className='pointer-events-none absolute -right-20 top-[12%] size-44 rounded-full bg-accent-blue opacity-60 sm:size-60 lg:-right-28 lg:size-80'
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

        <section className='grid flex-1 items-center gap-8 py-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-12 xl:py-10'>
          <div>
            <span className='inline-flex rounded-full bg-accent-green px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
              {currentSlide} из {totalSlides}
            </span>

            <h1 className='mt-4 wrap-break-word text-4xl font-black leading-[0.92] tracking-[-0.04em] text-balance sm:text-6xl lg:mt-7 lg:text-7xl xl:text-[5.5rem]'>
              {card.title}
            </h1>

            <p className='mt-4 max-w-xl text-base font-medium leading-relaxed sm:text-lg'>{card.description}</p>

            <details className='mt-5 rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4'>
              <summary className='cursor-pointer text-sm font-bold'>Подробнее о категориях</summary>

              <p className='mt-3 whitespace-pre-line text-sm leading-relaxed text-muted'>{card.explanation}</p>
            </details>
          </div>

          <div className='min-w-0'>
            <CategorySpotlight categoryName={categoryName} />

            {relatedCategories.length > 0 ? (
              <div className='mt-4'>
                <h2 className='mb-3 text-lg font-black sm:text-xl'>Другие ваши интересы</h2>

                <div className='grid gap-2 sm:grid-cols-2 sm:gap-3'>
                  {relatedCategories.map(category => (
                    <RelatedCategoryCard key={category.name} category={category} />
                  ))}
                </div>
              </div>
            ) : (
              <div className='mt-4 rounded-2xl border border-line bg-surface p-4'>
                <p className='text-sm font-medium leading-relaxed text-muted'>{card.explanation}</p>
              </div>
            )}
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
