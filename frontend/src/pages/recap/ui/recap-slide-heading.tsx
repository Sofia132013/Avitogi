import { cn } from "@/shared/lib"
import type { ReactNode } from "react"

type HeadingAccent = "blue" | "green" | "purple" | "yellow"
type HeadingSize = "default" | "large"

interface RecapSlideHeadingProps {
  badge: ReactNode
  title: string
  description?: string
  accent?: HeadingAccent
  size?: HeadingSize
  className?: string
}

const accentClasses: Record<HeadingAccent, string> = {
  blue: "bg-accent-blue",
  green: "bg-accent-green",
  purple: "bg-accent-purple",
  yellow: "bg-accent-yellow",
}

const sizeClasses: Record<HeadingSize, string> = {
  default: "text-2xl min-[375px]:text-3xl sm:text-4xl lg:text-6xl",
  large: "text-3xl min-[375px]:text-4xl sm:text-6xl lg:text-8xl",
}

export function RecapSlideHeading({
  badge,
  title,
  description,
  accent = "blue",
  size = "default",
  className,
}: RecapSlideHeadingProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <span
        className={cn(
          "inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap",
          accentClasses[accent],
        )}
      >
        {badge}
      </span>

      <h1
        className={cn(
          "mt-4 max-w-full font-black leading-[0.92] tracking-[-0.04em] text-balance wrap-break-word lg:mt-7",
          sizeClasses[size],
        )}
      >
        {title}
      </h1>

      {description && (
        <p className='mt-4 max-w-xl text-base font-medium leading-relaxed text-muted sm:text-lg'>{description}</p>
      )}
    </div>
  )
}
