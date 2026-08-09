import { cn, useCountUp } from "@/shared/lib"
import { getCategoryAppearance, type RelatedCategory } from "./main-category-data"

interface RelatedCategoryCardProps {
  category: RelatedCategory
}

export function RelatedCategoryCard({ category }: RelatedCategoryCardProps) {
  const displayedScore = useCountUp(category.score, {
    startOffset: 10,
    durationMs: 800,
  })

  const appearance = getCategoryAppearance(category.name)

  return (
    <article
      className='flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4'
      aria-label={`${category.name}: ${category.score} баллов активности`}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <span
          className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-xl", appearance.backgroundClass)}
          aria-hidden='true'
        >
          {appearance.icon}
        </span>

        <span className='truncate text-sm font-bold sm:text-base'>{category.name}</span>
      </div>

      <div className='shrink-0 text-right' aria-hidden='true'>
        <strong className='block text-2xl font-black leading-none tabular-nums'>{displayedScore}</strong>

        <span className='mt-1 block text-[0.65rem] font-bold uppercase tracking-wide text-muted'>баллы активности</span>
      </div>
    </article>
  )
}
