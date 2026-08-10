import { cn } from "@/shared/lib"

interface RecapExplanationProps {
  summary: string
  text: string
  className?: string
}

export function RecapExplanation({ summary, text, className }: RecapExplanationProps) {
  return (
    <details className={cn("mt-5 rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4", className)}>
      <summary className='cursor-pointer text-sm font-bold'>{summary}</summary>

      <p className='mt-3 whitespace-pre-line text-sm leading-relaxed text-muted'>{text}</p>
    </details>
  )
}
