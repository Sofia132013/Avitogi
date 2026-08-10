import { describe, expect, it } from "vitest"

import { profileSchema, profilesSchema } from "./profiles"

const validApiProfile = {
  id: 1,
  name: "Максим",
  avatar_url: "https://example.com/avatar.png",
  registered_at: "2023-05-10",
  rating: 5,
  created_at: "2023-05-10T10:00:00Z",
}

describe("profileSchema", () => {
  it("преобразует профиль из API-модели в frontend-модель", () => {
    const result = profileSchema.parse(validApiProfile)

    expect(result).toEqual({
      id: 1,
      name: "Максим",
      avatarUrl: "https://example.com/avatar.png",
      registeredAt: "2023-05-10",
      rating: 5,
      createdAt: "2023-05-10T10:00:00Z",
    })
  })

  it("принимает null вместо avatar_url", () => {
    const result = profileSchema.parse({
      ...validApiProfile,
      avatar_url: null,
    })

    expect(result.avatarUrl).toBeNull()
  })

  it("преобразует массив профилей", () => {
    const result = profilesSchema.parse([
      validApiProfile,
      {
        ...validApiProfile,
        id: 2,
        name: "Анна",
        avatar_url: null,
      },
    ])

    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe("Максим")
    expect(result[1]?.name).toBe("Анна")
    expect(result[1]?.avatarUrl).toBeNull()
  })

  it("отклоняет неположительный id", () => {
    const result = profileSchema.safeParse({
      ...validApiProfile,
      id: 0,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет дробный рейтинг", () => {
    const result = profileSchema.safeParse({
      ...validApiProfile,
      rating: 4.5,
    })

    expect(result.success).toBe(false)
  })
})
