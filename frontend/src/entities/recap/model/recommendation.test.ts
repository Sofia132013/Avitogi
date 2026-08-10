import { describe, expect, it } from "vitest"

import { recommendationSchema } from "./recommendation"

const validRecommendations = [
  {
    name: "CONTINUE_DRAFT",
    input: {
      type: "CONTINUE_DRAFT",
      title: "  Продолжите объявление  ",
      reason: "  Черновик почти готов  ",
      listing_id: 12,
    },
    expected: {
      type: "CONTINUE_DRAFT",
      title: "Продолжите объявление",
      reason: "Черновик почти готов",
      listingId: 12,
    },
  },
  {
    name: "OPEN_FAVORITES",
    input: {
      type: "OPEN_FAVORITES",
      title: "Вернитесь в избранное",
      reason: "Там осталось интересное объявление",
      listing_id: 25,
    },
    expected: {
      type: "OPEN_FAVORITES",
      title: "Вернитесь в избранное",
      reason: "Там осталось интересное объявление",
      listingId: 25,
    },
  },
  {
    name: "OPEN_SAVED_SEARCH",
    input: {
      type: "OPEN_SAVED_SEARCH",
      title: "Посмотрите новые варианты",
      reason: "В сохранённом поиске появились объявления",
    },
    expected: {
      type: "OPEN_SAVED_SEARCH",
      title: "Посмотрите новые варианты",
      reason: "В сохранённом поиске появились объявления",
    },
  },
  {
    name: "OPEN_CATEGORY without listing",
    input: {
      type: "OPEN_CATEGORY",
      title: "Продолжите изучать категорию",
      reason: "Она соответствует вашим интересам",
      category_id: 4,
    },
    expected: {
      type: "OPEN_CATEGORY",
      title: "Продолжите изучать категорию",
      reason: "Она соответствует вашим интересам",
      categoryId: 4,
    },
  },
  {
    name: "OPEN_CATEGORY with listing",
    input: {
      type: "OPEN_CATEGORY",
      title: "Посмотрите подходящее объявление",
      reason: "Мы нашли вариант в интересующей категории",
      category_id: 4,
      listing_id: 36,
    },
    expected: {
      type: "OPEN_CATEGORY",
      title: "Посмотрите подходящее объявление",
      reason: "Мы нашли вариант в интересующей категории",
      categoryId: 4,
      listingId: 36,
    },
  },
  {
    name: "CREATE_LISTING",
    input: {
      type: "CREATE_LISTING",
      title: "Создайте первое объявление",
      reason: "Возможно, пришло время попробовать себя в роли продавца",
    },
    expected: {
      type: "CREATE_LISTING",
      title: "Создайте первое объявление",
      reason: "Возможно, пришло время попробовать себя в роли продавца",
    },
  },
] satisfies ReadonlyArray<{
  name: string
  input: unknown
  expected: unknown
}>

describe("recommendationSchema", () => {
  for (const testCase of validRecommendations) {
    it(`нормализует рекомендацию ${testCase.name}`, () => {
      const result = recommendationSchema.parse(testCase.input)

      expect(result).toEqual(testCase.expected)
    })
  }

  it("отклоняет неизвестный тип рекомендации", () => {
    const result = recommendationSchema.safeParse({
      type: "UNKNOWN_RECOMMENDATION",
      title: "Неизвестная рекомендация",
      reason: "Неизвестная причина",
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет пустой title", () => {
    const result = recommendationSchema.safeParse({
      type: "CREATE_LISTING",
      title: "   ",
      reason: "Причина рекомендации",
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет отсутствующий reason", () => {
    const result = recommendationSchema.safeParse({
      type: "CREATE_LISTING",
      title: "Создайте объявление",
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет неположительный listing_id", () => {
    const result = recommendationSchema.safeParse({
      type: "CONTINUE_DRAFT",
      title: "Продолжите черновик",
      reason: "Черновик почти готов",
      listing_id: 0,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет дробный category_id", () => {
    const result = recommendationSchema.safeParse({
      type: "OPEN_CATEGORY",
      title: "Откройте категорию",
      reason: "Категория соответствует вашим интересам",
      category_id: 2.5,
    })

    expect(result.success).toBe(false)
  })
})
