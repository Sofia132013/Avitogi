export interface AchievementAppearance {
  icon: string
  backgroundClass: string
}

const ACHIEVEMENT_APPEARANCES: Record<string, AchievementAppearance> = {
  precise_choice: {
    icon: "🎯",
    backgroundClass: "bg-accent-purple",
  },

  in_touch: {
    icon: "💬",
    backgroundClass: "bg-accent-blue",
  },

  year_showcase: {
    icon: "🖼️",
    backgroundClass: "bg-accent-yellow",
  },

  deal_closed: {
    icon: "🤝",
    backgroundClass: "bg-accent-green",
  },

  wide_route: {
    icon: "🗺️",
    backgroundClass: "bg-accent-purple",
  },
}

const FALLBACK_APPEARANCE: AchievementAppearance = {
  icon: "🏆",
  backgroundClass: "bg-accent-yellow",
}

export function getAchievementAppearance(code: string) {
  return ACHIEVEMENT_APPEARANCES[code] ?? FALLBACK_APPEARANCE
}
