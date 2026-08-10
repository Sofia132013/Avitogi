import type { RecommendationType } from "@/entities/recap"

export type RecommendationAccent = "blue" | "green" | "purple" | "yellow"

export interface RecommendationPresentation {
  badge: string
  eyebrow: string
  icon: string
  accent: RecommendationAccent
  backgroundClass: string
}

const presentationByType: Record<RecommendationType, RecommendationPresentation> = {
  CONTINUE_DRAFT: {
    badge: "Продолжить начатое",
    eyebrow: "Ваш черновик ждёт",
    icon: "📝",
    accent: "purple",
    backgroundClass: "bg-accent-purple",
  },

  OPEN_FAVORITES: {
    badge: "Вернуться к выбору",
    eyebrow: "Сохранено в избранном",
    icon: "❤️",
    accent: "green",
    backgroundClass: "bg-accent-green",
  },

  OPEN_SAVED_SEARCH: {
    badge: "Продолжить поиск",
    eyebrow: "Новые варианты уже ждут",
    icon: "🔎",
    accent: "blue",
    backgroundClass: "bg-accent-blue",
  },

  OPEN_CATEGORY: {
    badge: "Исследовать категорию",
    eyebrow: "Подобрано по вашим интересам",
    icon: "🧭",
    accent: "green",
    backgroundClass: "bg-accent-green",
  },

  CREATE_LISTING: {
    badge: "Попробовать новое",
    eyebrow: "Время рассказать о своём",
    icon: "➕",
    accent: "yellow",
    backgroundClass: "bg-accent-yellow",
  },
}

export function getRecommendationPresentation(type: RecommendationType): RecommendationPresentation {
  return presentationByType[type]
}
