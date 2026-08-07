import { z } from "zod"

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default("/api"),
  VITE_PROFILE_STORAGE_KEY: z.string().min(1).default("avitogi:selected-profile"),
})

export const env = envSchema.parse(import.meta.env)
