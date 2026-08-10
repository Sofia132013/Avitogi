package tests

import (
	"encoding/json"
	"reflect"
	"strings"
	"testing"

	"avitogi/backend/internal/recap"
)

// sampleCards собирает карточки для непустого профиля.
func sampleCards() []recap.Card {
	metrics := recap.Metrics{
		ActiveDays:      12,
		ActiveMonths:    5,
		ViewedAds:       20,
		Favorites:       6,
		ContactsStarted: 3,
		CreatedAds:      1,
		MostActiveMonth: "2025-04",
	}
	roles := recap.Roles{Buyer: 60, Researcher: 25, IdeaCollector: 15}
	main := recap.MainCategoryResult{
		Main:        recap.CategoryScore{CategoryID: 1, CategoryName: "Транспорт", Score: 15},
		Explanation: "Главная категория: «Транспорт» (15 баллов).",
	}
	return recap.BuildCards(metrics, roles, main)
}

func TestBuildCards_OrderAndRequiredFields(t *testing.T) {
	cards := sampleCards()

	wantOrder := []string{
		recap.CardIntro,
		recap.CardYearInNumbers,
		recap.CardRoleRatio,
		recap.CardMainCategory,
		recap.CardActivePeriod,
	}

	if len(cards) != len(wantOrder) {
		t.Fatalf("ожидали %d карточек, получили %d", len(wantOrder), len(cards))
	}

	for i, card := range cards {
		// карточки возвращаются в заданном порядке
		if card.Type != wantOrder[i] {
			t.Fatalf("карточка #%d: тип %q, ожидали %q", i, card.Type, wantOrder[i])
		}
		// каждая карточка содержит тип, заголовок и описание
		if card.Type == "" || card.Title == "" || card.Description == "" {
			t.Fatalf("карточка #%d (%s) неполная: %+v", i, card.Type, card)
		}
	}
}

func TestBuildCards_PersonalCardsHaveExplanation(t *testing.T) {
	cards := sampleCards()

	for _, card := range cards {
		if card.Type == recap.CardIntro {
			// общая карточка не персональная — explanation не нужен
			if card.Explanation != "" {
				t.Fatalf("карточка intro не должна содержать explanation: %q", card.Explanation)
			}
			continue
		}
		// каждая персональная карточка содержит explanation
		if strings.TrimSpace(card.Explanation) == "" {
			t.Fatalf("персональная карточка %s должна содержать explanation", card.Type)
		}
	}
}

func TestBuildCards_PersonalExplanationEvenForEmptyProfile(t *testing.T) {
	// даже без данных персональные карточки обязаны содержать explanation
	cards := recap.BuildCards(recap.Metrics{}, recap.Roles{}, recap.MainCategoryResult{})

	for _, card := range cards {
		if card.Type == recap.CardIntro {
			continue
		}
		if strings.TrimSpace(card.Explanation) == "" {
			t.Fatalf("персональная карточка %s без данных должна содержать explanation", card.Type)
		}
	}
}

func TestBuildCards_NoInternalDBModels(t *testing.T) {
	cards := sampleCards()

	data, err := json.Marshal(cards)
	if err != nil {
		t.Fatalf("не удалось сериализовать карточки: %v", err)
	}
	payload := string(data)

	// API не возвращает внутренние модели базы данных
	forbidden := []string{
		"created_at", "registered_at", "avatar_url",
		"owner_id", "parent_id", "listing_id", "user_id", "event_date",
	}
	for _, field := range forbidden {
		if strings.Contains(payload, field) {
			t.Fatalf("в ответе не должно быть поля модели БД %q: %s", field, payload)
		}
	}
}

func TestBuildCards_DifferentProfilesDifferentCards(t *testing.T) {
	buyer := recap.BuildCards(
		recap.Metrics{ActiveDays: 10, ViewedAds: 20, Favorites: 5, ContactsStarted: 3, MostActiveMonth: "2025-04"},
		recap.Roles{Buyer: 70, Researcher: 30},
		recap.MainCategoryResult{Main: recap.CategoryScore{CategoryName: "Транспорт"}, Explanation: "по Транспорту"},
	)
	seller := recap.BuildCards(
		recap.Metrics{ActiveDays: 3, CreatedAds: 8, MostActiveMonth: "2025-10"},
		recap.Roles{Seller: 100},
		recap.MainCategoryResult{Main: recap.CategoryScore{CategoryName: "Недвижимость"}, Explanation: "по Недвижимости"},
	)

	// разные профили получают разные карточки
	if reflect.DeepEqual(buyer, seller) {
		t.Fatal("разные профили должны получать разные карточки")
	}
}
