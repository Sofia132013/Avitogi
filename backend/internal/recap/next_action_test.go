package recap

import (
	"strings"
	"testing"
)

// mainCategory — короткий помощник для главной категории пользователя.
func mainCategory(id int, name string) MainCategoryResult {
	return MainCategoryResult{
		Main: CategoryScore{CategoryID: id, CategoryName: name},
	}
}

// TestBuildRecommendation_Tiers покрывает каскад: история → сильный интерес →
// безопасный фолбэк, а также маппинг каждого сценария истории в тип действия.
func TestBuildRecommendation_Tiers(t *testing.T) {
	catMap := map[int]int{3: 4} // объявление 3 -> категория 4

	tests := []struct {
		name         string
		events       []Event
		metrics      Metrics
		main         MainCategoryResult
		wantType     string
		wantListing  int // -1 = nil
		wantCategory int // -1 = nil
	}{
		{
			name:         "tier1 черновик -> CONTINUE_DRAFT",
			events:       []Event{storyEvent(1, intPtr(7), EventDraftCreated, 5)},
			wantType:     ActionContinueDraft,
			wantListing:  7,
			wantCategory: -1,
		},
		{
			name:         "tier1 избранное -> OPEN_FAVORITES",
			events:       []Event{storyEvent(1, intPtr(2), EventAddToFavorites, 5)},
			wantType:     ActionOpenFavorites,
			wantListing:  2,
			wantCategory: -1,
		},
		{
			name:         "tier1 сохранённый поиск -> OPEN_SAVED_SEARCH",
			events:       []Event{storyEvent(1, nil, EventSavedSearch, 5)},
			wantType:     ActionOpenSavedSearch,
			wantListing:  -1,
			wantCategory: -1,
		},
		{
			name:         "tier1 повторные просмотры -> OPEN_CATEGORY с категорией",
			events:       []Event{storyEvent(1, intPtr(3), EventListingRevisited, 5)},
			wantType:     ActionOpenCategory,
			wantListing:  3,
			wantCategory: 4,
		},
		{
			name:         "tier2 сильный интерес -> OPEN_CATEGORY главной категории",
			events:       nil,
			metrics:      Metrics{ViewedAds: 5},
			main:         mainCategory(1, "Транспорт"),
			wantType:     ActionOpenCategory,
			wantListing:  -1,
			wantCategory: 1,
		},
		{
			name:         "tier3 нет истории -> CREATE_LISTING",
			events:       nil,
			metrics:      Metrics{},
			wantType:     ActionCreateListing,
			wantListing:  -1,
			wantCategory: -1,
		},
		{
			name:         "сильный интерес без главной категории -> фолбэк CREATE_LISTING",
			events:       nil,
			metrics:      Metrics{ViewedAds: 10},
			main:         MainCategoryResult{},
			wantType:     ActionCreateListing,
			wantListing:  -1,
			wantCategory: -1,
		},
		{
			name:         "revisited без карты категорий -> фолбэк CREATE_LISTING",
			events:       []Event{storyEvent(1, intPtr(99), EventListingRevisited, 5)},
			metrics:      Metrics{},
			wantType:     ActionCreateListing,
			wantListing:  -1,
			wantCategory: -1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rec := BuildRecommendation(tt.events, 1, tt.metrics, tt.main, catMap)

			if rec.Type != tt.wantType {
				t.Errorf("type = %q, ожидали %q", rec.Type, tt.wantType)
			}
			if rec.Title == "" || rec.Reason == "" {
				t.Errorf("рекомендация должна содержать заголовок и причину: %+v", rec)
			}
			assertPtr(t, "listing_id", rec.ListingID, tt.wantListing)
			assertPtr(t, "category_id", rec.CategoryID, tt.wantCategory)
		})
	}
}

// TestBuildRecommendation_StoryBeatsInterest: незавершённая история важнее
// сильного покупательского интереса.
func TestBuildRecommendation_StoryBeatsInterest(t *testing.T) {
	events := []Event{storyEvent(1, intPtr(7), EventDraftCreated, 5)}
	metrics := Metrics{ViewedAds: 100, Favorites: 50} // сильный интерес

	rec := BuildRecommendation(events, 1, metrics, mainCategory(1, "Транспорт"), nil)

	if rec.Type != ActionContinueDraft {
		t.Errorf("type = %q, ожидали %q (история важнее интереса)", rec.Type, ActionContinueDraft)
	}
}

// TestBuildRecommendation_AlwaysNonEmpty: рекомендация всегда заполнена, даже
// без событий и метрик (безопасный фолбэк).
func TestBuildRecommendation_AlwaysNonEmpty(t *testing.T) {
	rec := BuildRecommendation(nil, 1, Metrics{}, MainCategoryResult{}, nil)

	if rec.Type == "" || rec.Title == "" || rec.Reason == "" {
		t.Errorf("ожидали заполненную безопасную рекомендацию, получили %+v", rec)
	}
	if rec.Type != ActionCreateListing {
		t.Errorf("безопасный фолбэк должен быть %q, получили %q", ActionCreateListing, rec.Type)
	}
}

// TestBuildRecommendation_ReasonNotAccusatory: причина ни в одной рекомендации
// не обвиняет пользователя (проверка по чёрному списку слов).
func TestBuildRecommendation_ReasonNotAccusatory(t *testing.T) {
	blocked := []string{
		"забыл", "забросил", "бросил", "не довёл", "не довел",
		"поленил", "проворонил", "зря", "виноват", "провалил",
	}

	catMap := map[int]int{3: 4}
	cases := [][]Event{
		{storyEvent(1, intPtr(7), EventDraftCreated, 5)},
		{storyEvent(1, intPtr(2), EventAddToFavorites, 5)},
		{storyEvent(1, nil, EventSavedSearch, 5)},
		{storyEvent(1, intPtr(3), EventListingRevisited, 5)},
	}

	collect := func(rec Recommendation) {
		reason := strings.ToLower(rec.Reason)
		for _, word := range blocked {
			if strings.Contains(reason, word) {
				t.Errorf("тип %q: причина содержит обвиняющее слово %q: %q", rec.Type, word, rec.Reason)
			}
		}
	}

	// все tier-1 сценарии
	for _, events := range cases {
		collect(BuildRecommendation(events, 1, Metrics{}, mainCategory(1, "Транспорт"), catMap))
	}
	// tier-2 и tier-3
	collect(BuildRecommendation(nil, 1, Metrics{ViewedAds: 5}, mainCategory(1, "Транспорт"), nil))
	collect(BuildRecommendation(nil, 1, Metrics{}, MainCategoryResult{}, nil))
}

// assertPtr сверяет *int с ожидаемым значением (-1 = ожидаем nil).
func assertPtr(t *testing.T, field string, got *int, want int) {
	t.Helper()
	if want == -1 {
		if got != nil {
			t.Errorf("%s = %d, ожидали nil", field, *got)
		}
		return
	}
	if got == nil || *got != want {
		t.Errorf("%s = %v, ожидали %d", field, got, want)
	}
}
