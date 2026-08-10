import { z } from "zod"
import { recommendationSchema } from "./recommendation"

const cardContentShape = {
  title: z.string().min(1),
  description: z.string().min(1),
}

const personalCardContentShape = {
  ...cardContentShape,
  explanation: z.string().min(1),
}

export const achievementSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  earned: z.boolean(),
})

export const recapCardSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("intro"),
    ...cardContentShape,
  }),

  z.object({
    type: z.literal("year_in_numbers"),
    ...personalCardContentShape,
  }),

  z.object({
    type: z.literal("role_ratio"),
    ...personalCardContentShape,
  }),

  z.object({
    type: z.literal("main_category"),
    ...personalCardContentShape,
  }),

  z.object({
    type: z.literal("active_period"),
    ...personalCardContentShape,
  }),

  z.object({
    type: z.literal("achievements"),
    ...personalCardContentShape,
    achievements: z.array(achievementSchema),
  }),
])

export const recapResponseSchema = z.object({
  cards: z.array(recapCardSchema).min(1),
  recommendation: recommendationSchema,
})
export type Achievement = z.infer<typeof achievementSchema>
export type RecapCard = z.infer<typeof recapCardSchema>
export type RecapResponse = z.infer<typeof recapResponseSchema>

export type IntroRecapCard = Extract<RecapCard, { type: "intro" }>
export type YearInNumbersRecapCard = Extract<RecapCard, { type: "year_in_numbers" }>
export type RoleRatioRecapCard = Extract<RecapCard, { type: "role_ratio" }>
export type MainCategoryRecapCard = Extract<RecapCard, { type: "main_category" }>
export type ActivePeriodRecapCard = Extract<RecapCard, { type: "active_period" }>
export type AchievementsRecapCard = Extract<RecapCard, { type: "achievements" }>
