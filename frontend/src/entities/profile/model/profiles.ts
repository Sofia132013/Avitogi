import { z } from "zod"

export const profileSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    avatar_url: z.string().nullable(),
    registered_at: z.string(),
    rating: z.number().int(),
    created_at: z.string(),
  })
  .transform(profile => ({
    id: profile.id,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    registeredAt: profile.registered_at,
    rating: profile.rating,
    createdAt: profile.created_at,
  }))

export const profilesSchema = z.array(profileSchema)

export type Profile = z.infer<typeof profileSchema>
export type ProfileId = Profile["id"]
