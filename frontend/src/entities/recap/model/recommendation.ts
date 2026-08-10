import { z } from "zod"

interface RecommendationContent {
  title: string
  reason: string
}

export interface ContinueDraftRecommendation extends RecommendationContent {
  type: "CONTINUE_DRAFT"
  listingId: number
}

export interface OpenFavoritesRecommendation extends RecommendationContent {
  type: "OPEN_FAVORITES"
  listingId: number
}

export interface OpenSavedSearchRecommendation extends RecommendationContent {
  type: "OPEN_SAVED_SEARCH"
}

export interface OpenCategoryRecommendation extends RecommendationContent {
  type: "OPEN_CATEGORY"
  categoryId: number
  listingId?: number
}

export interface CreateListingRecommendation extends RecommendationContent {
  type: "CREATE_LISTING"
}

export type Recommendation =
  | ContinueDraftRecommendation
  | OpenFavoritesRecommendation
  | OpenSavedSearchRecommendation
  | OpenCategoryRecommendation
  | CreateListingRecommendation

export type RecommendationType = Recommendation["type"]

const recommendationContentShape = {
  title: z.string().trim().min(1),
  reason: z.string().trim().min(1),
}

const recommendationIdSchema = z.number().int().positive()

const recommendationApiSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CONTINUE_DRAFT"),
    ...recommendationContentShape,
    listing_id: recommendationIdSchema,
  }),

  z.object({
    type: z.literal("OPEN_FAVORITES"),
    ...recommendationContentShape,
    listing_id: recommendationIdSchema,
  }),

  z.object({
    type: z.literal("OPEN_SAVED_SEARCH"),
    ...recommendationContentShape,
  }),

  z.object({
    type: z.literal("OPEN_CATEGORY"),
    ...recommendationContentShape,
    category_id: recommendationIdSchema,
    listing_id: recommendationIdSchema.optional(),
  }),

  z.object({
    type: z.literal("CREATE_LISTING"),
    ...recommendationContentShape,
  }),
])

type RecommendationApi = z.infer<typeof recommendationApiSchema>

function normalizeRecommendation(recommendation: RecommendationApi): Recommendation {
  switch (recommendation.type) {
    case "CONTINUE_DRAFT":
      return {
        type: recommendation.type,
        title: recommendation.title,
        reason: recommendation.reason,
        listingId: recommendation.listing_id,
      }

    case "OPEN_FAVORITES":
      return {
        type: recommendation.type,
        title: recommendation.title,
        reason: recommendation.reason,
        listingId: recommendation.listing_id,
      }

    case "OPEN_SAVED_SEARCH":
      return {
        type: recommendation.type,
        title: recommendation.title,
        reason: recommendation.reason,
      }

    case "OPEN_CATEGORY":
      return {
        type: recommendation.type,
        title: recommendation.title,
        reason: recommendation.reason,
        categoryId: recommendation.category_id,

        ...(recommendation.listing_id === undefined
          ? {}
          : {
              listingId: recommendation.listing_id,
            }),
      }

    case "CREATE_LISTING":
      return {
        type: recommendation.type,
        title: recommendation.title,
        reason: recommendation.reason,
      }
  }

  const exhaustiveCheck: never = recommendation
  return exhaustiveCheck
}

export const recommendationSchema = recommendationApiSchema.transform(normalizeRecommendation)
