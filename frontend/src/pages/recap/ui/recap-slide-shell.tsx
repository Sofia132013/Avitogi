import type { ReactNode } from "react"
import { RecapProgress } from "../recap-progress"
import type { RecapSlideMetaProps } from "../recap-slide.types"

interface RecapSlideShellProps extends RecapSlideMetaProps {
  decorations?: ReactNode
  navigation?: ReactNode
  children: ReactNode
}

export function RecapSlideShell({
  year,
  currentSlide,
  totalSlides,
  decorations,
  navigation,
  children,
}: RecapSlideShellProps) {
  return (
    <main className='recap-page-enter relative isolate min-h-dvh overflow-x-hidden'>
      {decorations}

      <div className='relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12'>
        <RecapProgress currentSlide={currentSlide} totalSlides={totalSlides} />

        <header className='mt-5 flex items-center justify-between gap-4'>
          <span className='text-xl font-black tracking-tight'>Avitogi</span>

          <span className='shrink-0 rounded-full bg-muted-surface px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] sm:px-4'>
            Итоги {year}
          </span>
        </header>

        {children}

        {navigation}
      </div>
    </main>
  )
}
