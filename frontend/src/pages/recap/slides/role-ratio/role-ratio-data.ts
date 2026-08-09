export interface RoleRatioItem {
  label: string
  percentage: number
}

export interface RoleAppearance {
  icon: string
  backgroundClass: string
}

const ROLE_APPEARANCES: Array<{
  pattern: RegExp
  appearance: RoleAppearance
}> = [
  {
    pattern: /покупател/i,
    appearance: {
      icon: "🛍️",
      backgroundClass: "bg-accent-blue",
    },
  },
  {
    pattern: /продав/i,
    appearance: {
      icon: "🏷️",
      backgroundClass: "bg-accent-green",
    },
  },
  {
    pattern: /исследовател/i,
    appearance: {
      icon: "🔎",
      backgroundClass: "bg-accent-purple",
    },
  },
  {
    pattern: /коллекционер/i,
    appearance: {
      icon: "💡",
      backgroundClass: "bg-accent-yellow",
    },
  },
]

const FALLBACK_APPEARANCE: RoleAppearance = {
  icon: "✨",
  backgroundClass: "bg-accent-purple",
}

function capitalize(value: string) {
  if (!value) {
    return value
  }

  return value.charAt(0).toLocaleUpperCase("ru-RU") + value.slice(1)
}

export function parseRoleRatios(explanation: string): RoleRatioItem[] {
  const ratiosText = explanation.match(/Соотношение ролей:\s*(.+?)(?:\.(?:\s|$)|$)/i)?.[1]

  if (!ratiosText) {
    return []
  }

  const rolePattern = /([^,]+?)\s*[—–-]\s*(\d+(?:[.,]\d+)?)%/g

  return Array.from(ratiosText.matchAll(rolePattern), match => {
    const percentage = Number(match[2].replace(",", "."))

    return {
      label: capitalize(match[1].trim()),
      percentage: Math.min(Math.max(percentage, 0), 100),
    }
  })
}

export function getPrimaryRole(roles: RoleRatioItem[]) {
  return roles.reduce<RoleRatioItem | undefined>((primaryRole, role) => {
    if (!primaryRole || role.percentage > primaryRole.percentage) {
      return role
    }

    return primaryRole
  }, undefined)
}

export function getRoleAppearance(label: string) {
  return ROLE_APPEARANCES.find(({ pattern }) => pattern.test(label))?.appearance ?? FALLBACK_APPEARANCE
}
