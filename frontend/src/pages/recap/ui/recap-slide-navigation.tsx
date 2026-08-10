import { Button } from "@/shared/ui"
import type { ReactNode } from "react"

interface RecapSlideNavigationProps {
  onPrevious: () => void
  onPrimary: () => void
  primaryLabel?: string
  primaryIcon?: ReactNode
}

export function RecapSlideNavigation({
  onPrevious,
  onPrimary,
  primaryLabel = "Дальше",
  primaryIcon = "→",
}: RecapSlideNavigationProps) {
  return (
    <nav className='flex min-w-0 items-center justify-between gap-3 pb-1' aria-label='Навигация по итогам года'>
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
        onClick={onPrimary}
      >
        {primaryLabel}

        <span aria-hidden='true'>{primaryIcon}</span>
      </Button>
    </nav>
  )
}
