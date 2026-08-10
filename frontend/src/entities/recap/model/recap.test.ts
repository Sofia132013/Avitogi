import { describe, expect, it } from "vitest"

import { recapResponseSchema } from "./recap"

const recommendation = {
  type: "OPEN_CATEGORY",
  title: "Продолжите изучать категорию",
  reason: "Она соответствует вашим интересам",
  category_id: 7,
  listing_id: 15,
}

const personalCardTypes = ["year_in_numbers", "role_ratio", "main_category", "active_period"] as const

describe("recapResponseSchema", () => {
  it("принимает корректный ответ и нормализует рекомендацию", () => {
    const result = recapResponseSchema.parse({
      cards: [
        {
          type: "intro",
          title: "Ваши итоги года",
          description: "Посмотрим, каким был ваш год",
        },
      ],
      recommendation,
    })

    expect(result.cards).toHaveLength(1)

    expect(result.recommendation).toEqual({
      type: "OPEN_CATEGORY",
      title: "Продолжите изучать категорию",
      reason: "Она соответствует вашим интересам",
      categoryId: 7,
      listingId: 15,
    })
  })

  for (const type of personalCardTypes) {
    it(`принимает слайд типа ${type}`, () => {
      const result = recapResponseSchema.safeParse({
        cards: [
          {
            type,
            title: "Заголовок",
            description: "Описание",
            explanation: "Подробное объяснение",
          },
        ],
        recommendation,
      })

      expect(result.success).toBe(true)
    })
  }

  it("принимает слайд достижений", () => {
    const result = recapResponseSchema.safeParse({
      cards: [
        {
          type: "achievements",
          title: "Ваши достижения",
          description: "Награды за активность",
          explanation: "Достижения рассчитаны по действиям",
          achievements: [
            {
              code: "active_user",
              title: "Активный пользователь",
              description: "Вы часто пользовались Авито",
              earned: true,
            },
          ],
        },
      ],
      recommendation,
    })

    expect(result.success).toBe(true)
  })

  it("принимает пустой массив достижений", () => {
    const result = recapResponseSchema.safeParse({
      cards: [
        {
          type: "achievements",
          title: "Ваши достижения",
          description: "Награды за активность",
          explanation: "Достижения рассчитаны по действиям",
          achievements: [],
        },
      ],
      recommendation,
    })

    expect(result.success).toBe(true)
  })

  it("отклоняет ответ без слайдов", () => {
    const result = recapResponseSchema.safeParse({
      cards: [],
      recommendation,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет неизвестный тип слайда", () => {
    const result = recapResponseSchema.safeParse({
      cards: [
        {
          type: "unknown_slide",
          title: "Неизвестный слайд",
          description: "Описание",
        },
      ],
      recommendation,
    })

    expect(result.success).toBe(false)
  })

  it("требует explanation у персонального слайда", () => {
    const result = recapResponseSchema.safeParse({
      cards: [
        {
          type: "role_ratio",
          title: "Кто вы на Авито",
          description: "Ваша главная роль",
        },
      ],
      recommendation,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет некорректное достижение", () => {
    const result = recapResponseSchema.safeParse({
      cards: [
        {
          type: "achievements",
          title: "Ваши достижения",
          description: "Награды за активность",
          explanation: "Достижения рассчитаны по действиям",
          achievements: [
            {
              code: "active_user",
              title: "Активный пользователь",
              description: "Описание",
              earned: "yes",
            },
          ],
        },
      ],
      recommendation,
    })

    expect(result.success).toBe(false)
  })
})
