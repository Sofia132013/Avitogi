package tests

import (
	"testing"

	"avitogi/backend/internal/recap"
)

func TestAchievementsEarned(t *testing.T) {
	// проверяем, что достижения выдаются по нужным действиям
	listingID1 := 1
	listingID2 := 2
	listingID3 := 3
	events := []recap.Event{
		{UserID: 1, ListingID: &listingID1, Type: recap.EventAddToFavorites, Timestamp: testDate("2025-01-01"), EventID: "1"},
		{UserID: 1, ListingID: &listingID2, Type: recap.EventAddToFavorites, Timestamp: testDate("2025-01-02"), EventID: "2"},
		{UserID: 1, ListingID: &listingID1, Type: recap.EventStartContact, Timestamp: testDate("2025-01-03"), EventID: "3"},
		{UserID: 1, ListingID: &listingID2, Type: recap.EventStartContact, Timestamp: testDate("2025-01-04"), EventID: "4"},
		{UserID: 1, ListingID: &listingID1, Type: recap.EventCreateAd, Timestamp: testDate("2025-01-05"), EventID: "5"},
		{UserID: 1, ListingID: &listingID2, Type: recap.EventCreateAd, Timestamp: testDate("2025-01-06"), EventID: "6"},
		{UserID: 1, ListingID: &listingID3, Type: "deal_completed", Timestamp: testDate("2025-01-07"), EventID: "7"},
	}
	listingToCategory := map[int]int{
		1: 10,
		2: 20,
		3: 30,
	}

	// у пользователя есть действия для всех пяти ачивок
	achievements := recap.CalculateAchievements(events, 1, listingToCategory)

	assertAchievement(t, achievements, recap.AchievementPreciseChoice, true)
	assertAchievement(t, achievements, recap.AchievementInTouch, true)
	assertAchievement(t, achievements, recap.AchievementYearShowcase, true)
	assertAchievement(t, achievements, recap.AchievementDealClosed, true)
	assertAchievement(t, achievements, recap.AchievementWideRoute, true)
}

func TestAchievementsNotEarned(t *testing.T) {
	// проверяем, что достижение не выдается раньше условия
	listingID := 1
	events := []recap.Event{
		{UserID: 1, ListingID: &listingID, Type: recap.EventAddToFavorites, Timestamp: testDate("2025-01-01"), EventID: "1"},
	}

	achievements := recap.CalculateAchievements(events, 1, map[int]int{1: 10})

	assertAchievement(t, achievements, recap.AchievementPreciseChoice, false)
	assertAchievement(t, achievements, recap.AchievementWideRoute, false)
}

func assertAchievement(t *testing.T, achievements []recap.Achievement, code string, earned bool) {
	t.Helper()

	// ищем нужную ачивку 
	for _, achievement := range achievements {
		if achievement.Code == code {
			if achievement.Earned != earned {
				t.Fatalf("%s earned = %v, want %v", code, achievement.Earned, earned)
			}
			return
		}
	}

	t.Fatalf("achievement %q not found", code)
}
