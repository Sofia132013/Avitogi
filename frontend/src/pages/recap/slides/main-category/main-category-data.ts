export interface RelatedCategory {
  name: string
  score: number
}

export interface CategoryAppearance {
  icon: string
  backgroundClass: string
}

const CATEGORY_APPEARANCES: Array<{
  pattern: RegExp
  appearance: CategoryAppearance
}> = [
  {
    pattern: /транспорт|автомобил/i,
    appearance: {
      icon: "🚗",
      backgroundClass: "bg-accent-blue",
    },
  },
  {
    pattern: /недвижимост|квартир|дом/i,
    appearance: {
      icon: "🏠",
      backgroundClass: "bg-accent-purple",
    },
  },
  {
    pattern: /работ|ваканси/i,
    appearance: {
      icon: "💼",
      backgroundClass: "bg-accent-green",
    },
  },
]

const FALLBACK_APPEARANCE: CategoryAppearance = {
  icon: "✨",
  backgroundClass: "bg-accent-yellow",
}

export function getMainCategoryName(description: string) {
  return description.match(/«([^»]+)»/)?.[1]?.trim()
}

export function parseRelatedCategories(explanation: string): RelatedCategory[] {
  const categoryPattern = /[—–-]\s*«([^»]+)»:\s*(\d+)\s*балл[а-яё]*/giu

  return Array.from(explanation.matchAll(categoryPattern), match => ({
    name: match[1].trim(),
    score: Number(match[2]),
  }))
}

export function getCategoryAppearance(categoryName: string) {
  return CATEGORY_APPEARANCES.find(({ pattern }) => pattern.test(categoryName))?.appearance ?? FALLBACK_APPEARANCE
}
