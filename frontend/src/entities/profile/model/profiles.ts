export const PROFILES = [
  {
    id: "maksim",
    name: "Максим",
    avatarUrl: "/avatars/maksim.png",
  },
  {
    id: "anna",
    name: "Анна",
    avatarUrl: "/avatars/anna.png",
  },
  {
    id: "guest",
    name: "Гостевой профиль",
    avatarUrl: "/avatars/guest.png",
  },
] as const

export type ProfileId = (typeof PROFILES)[number]["id"]
