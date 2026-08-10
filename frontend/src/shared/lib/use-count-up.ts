import { useEffect, useState } from "react"

interface UseCountUpOptions {
  startOffset?: number
  durationMs?: number
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

export function useCountUp(targetValue: number, { startOffset = 10, durationMs = 900 }: UseCountUpOptions = {}) {
  const startValue = Math.max(0, targetValue - startOffset)
  const [displayedValue, setDisplayedValue] = useState(startValue)

  useEffect(() => {
    let animationFrameId: number

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || durationMs <= 0 || startValue === targetValue) {
      animationFrameId = window.requestAnimationFrame(() => {
        setDisplayedValue(targetValue)
      })

      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }

    const animationStartedAt = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - animationStartedAt
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = easeOutCubic(progress)
      const nextValue = Math.round(startValue + (targetValue - startValue) * easedProgress)

      setDisplayedValue(nextValue)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate)
      }
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [durationMs, startValue, targetValue])

  return displayedValue
}
