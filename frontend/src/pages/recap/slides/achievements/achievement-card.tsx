import type { Achievement } from "@/entities/recap"
import { cn } from "@/shared/lib"
import { getAchievementAppearance } from "./achievement-data"

interface AchievementCardProps {
  achievement: Achievement
  className?: string
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  const appearance = getAchievementAppearance(achievement.code)

  return (
    <article
      className={cn(
        "relative min-w-0 overflow-hidden rounded-3xl border p-4 sm:p-5",
        achievement.earned ? "border-accent-green/40 bg-surface" : "border-line bg-muted-surface",
        className,
      )}
      aria-label={`${achievement.title}: ${achievement.earned ? "получено" : "не получено"}`}
    >
      <div className='flex min-w-0 items-start gap-3'>
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl text-2xl sm:size-14 sm:text-3xl",
            achievement.earned ? appearance.backgroundClass : "bg-background grayscale opacity-60",
          )}
          aria-hidden='true'
        >
          {appearance.icon}
        </span>

        <div className='min-w-0 flex-1'>
          <div className='flex min-w-0 flex-wrap items-center justify-between gap-2'>
            <h3 className='min-w-0 wrap-break-word text-base font-black leading-tight sm:text-lg'>
              {achievement.title}
            </h3>

            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide",
                achievement.earned ? "bg-accent-green text-recap" : "bg-background text-muted",
              )}
            >
              {achievement.earned ? "Получено" : "Закрыто"}
            </span>
          </div>

          <p className='mt-2 text-xs font-medium leading-relaxed text-muted sm:text-sm'>{achievement.description}</p>
        </div>
      </div>

      {!achievement.earned && (
        <span className='pointer-events-none absolute -bottom-5 -right-3 text-7xl opacity-[0.06]' aria-hidden='true'>
          🔒
        </span>
      )}
    </article>
  )
}
