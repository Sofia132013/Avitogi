import { cn, useCountUp } from "@/shared/lib"
import { getRoleAppearance, type RoleRatioItem } from "./role-ratio-data"

interface PrimaryRoleProps {
  role: RoleRatioItem
}

export function PrimaryRole({ role }: PrimaryRoleProps) {
  const displayedPercentage = useCountUp(role.percentage, {
    startOffset: 10,
    durationMs: 1100,
  })

  const appearance = getRoleAppearance(role.label)

  return (
    <article
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-4xl p-5 text-recap",
        "sm:p-7 lg:p-8",
        appearance.backgroundClass,
      )}
      aria-label={`Ваша главная роль — ${role.label}, ${role.percentage}%`}
    >
      <span
        className='pointer-events-none absolute -right-5 -top-8 text-[9rem] opacity-20 sm:text-[12rem]'
        aria-hidden='true'
      >
        {appearance.icon}
      </span>

      <div className='relative'>
        <span className='text-xs font-black uppercase tracking-[0.14em]'>Ваша главная роль</span>

        <div className='mt-4 flex min-w-0 flex-col gap-4 min-[400px]:flex-row min-[400px]:items-end min-[400px]:justify-between'>
          <div className='min-w-0'>
            <strong className='block wrap-break-word text-xl font-black leading-none sm:text-2xl lg:text-3xl'>
              {role.label}
            </strong>

            <span className='mt-2 block text-sm font-bold leading-snug opacity-70'>
              действий соответствует этой роли
            </span>
          </div>

          <strong
            className='shrink-0 self-end text-5xl font-black leading-none tracking-[-0.07em] tabular-nums min-[400px]:self-auto sm:text-6xl lg:text-7xl'
            aria-hidden='true'
          >
            {displayedPercentage}%
          </strong>
        </div>
      </div>
    </article>
  )
}
