// @vitest-environment jsdom

import { env } from "@/app/env"
import { beforeEach, describe, expect, it } from "vitest"

import { exitProfile, getSelectedProfileId, selectProfile } from "./profile-session"

const profileStorageKey = env.VITE_PROFILE_STORAGE_KEY

describe("profile session", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("возвращает null, если профиль не выбран", () => {
    expect(getSelectedProfileId()).toBeNull()
  })

  it("сохраняет выбранный профиль в localStorage", () => {
    selectProfile(42)

    expect(localStorage.getItem(profileStorageKey)).toBe("42")

    expect(getSelectedProfileId()).toBe(42)
  })

  it("удаляет выбранный профиль при выходе", () => {
    selectProfile(42)

    exitProfile()

    expect(localStorage.getItem(profileStorageKey)).toBeNull()

    expect(getSelectedProfileId()).toBeNull()
  })

  it.each(["", " ", "profile-id", "0", "-1", "1.5", "NaN", "Infinity", "9007199254740992"])(
    "возвращает null для некорректного значения %j",
    storedValue => {
      localStorage.setItem(profileStorageKey, storedValue)

      expect(getSelectedProfileId()).toBeNull()
    },
  )

  it("преобразует корректное строковое значение в число", () => {
    localStorage.setItem(profileStorageKey, "15")

    expect(getSelectedProfileId()).toBe(15)
  })
})
