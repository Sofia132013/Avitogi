import { cn, useCountUp } from "@/shared/lib"
import { getRoleAppearance, type RoleRatioItem } from "./role-ratio-data"

interface RoleMeterProps {
  role: RoleRatioItem
}

export function RoleMeter({ role }: RoleMeterProps) {
  const displayedPercentage = useCountUp(role.percentage, {
    startOffset: 10,
    durationMs: 900,
  })

  const appearance = getRoleAppearance(role.label)

  return (
    <article className='w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-surface p-3 sm:p-4'>
      <div className='flex min-w-0 items-center justify-between gap-2 sm:gap-4'>
        <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl text-lg",
              "sm:size-10 sm:text-xl",
              appearance.backgroundClass,
            )}
            aria-hidden='true'
          >
            {appearance.icon}
          </span>

          <span className='min-w-0 wrap-break-words text-xs font-bold leading-tight min-[360px]:text-sm sm:text-base'>
            {role.label}
          </span>
        </div>

        <strong className='shrink-0 text-lg font-black tabular-nums min-[360px]:text-xl sm:text-2xl' aria-hidden='true'>
          {displayedPercentage}%
        </strong>
      </div>

      <div
        className='mt-3 h-2 overflow-hidden rounded-full bg-muted-surface'
        role='progressbar'
        aria-label={`${role.label}: ${role.percentage}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={role.percentage}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-100", appearance.backgroundClass)}
          style={{ width: `${displayedPercentage}%` }}
        />
      </div>
    </article>
  )
}
