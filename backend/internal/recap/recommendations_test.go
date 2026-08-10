package recap

import (
	"strings"
	"testing"
	"time"
)

// storyEvent — короткий помощник для событий детектора незавершённой истории.
// day задаёт дату в январе 2025, чтобы удобно сравнивать «свежесть».
func storyEvent(userID int, listingID *int, eventType string, day int) Event {
	return Event{
		UserID:    userID,
		ListingID: listingID,
		Type:      eventType,
		Timestamp: time.Date(2025, time.January, day, 12, 0, 0, 0, time.UTC),
	}
}

// gotListing разворачивает *int в удобное для сравнения значение и признак nil.
func gotListing(story UnfinishedStory) (int, bool) {
	if story.ListingID == nil {
		return 0, false
	}
	return *story.ListingID, true
}

// TestFindUnfinishedStory_Scenarios проверяет срабатывание и несрабатывание
// каждого сценария по отдельности.
func TestFindUnfinishedStory_Scenarios(t *testing.T) {
	tests := []struct {
		name         string
		events       []Event
		wantOK       bool
		wantCategory string
		wantListing  int // -1 = ожидаем nil
	}{
		{
			name:         "черновик без публикации",
			events:       []Event{storyEvent(1, intPtr(1), EventDraftCreated, 5)},
			wantOK:       true,
			wantCategory: StoryDraftUnpublished,
			wantListing:  1,
		},
		{
			name: "черновик опубликован — не срабатывает",
			events: []Event{
				storyEvent(1, intPtr(1), EventDraftCreated, 5),
				storyEvent(1, intPtr(1), EventCreateAd, 6),
			},
			wantOK: false,
		},
		{
			name:         "избранное без контакта",
			events:       []Event{storyEvent(1, intPtr(2), EventAddToFavorites, 5)},
			wantOK:       true,
			wantCategory: StoryFavoriteNoContact,
			wantListing:  2,
		},
		{
			name: "избранное с контактом — не срабатывает",
			events: []Event{
				storyEvent(1, intPtr(2), EventAddToFavorites, 5),
				storyEvent(1, intPtr(2), EventStartContact, 6),
			},
			wantOK: false,
		},
		{
			name: "избранное со сделкой — не срабатывает",
			events: []Event{
				storyEvent(1, intPtr(2), EventAddToFavorites, 5),
				storyEvent(1, intPtr(2), EventDealCompleted, 6),
			},
			wantOK: false,
		},
		{
			name:         "сохранённый поиск",
			events:       []Event{storyEvent(1, nil, EventSavedSearch, 5)},
			wantOK:       true,
			wantCategory: StorySavedSearch,
			wantListing:  -1,
		},
		{
			name:         "повторные просмотры без действия",
			events:       []Event{storyEvent(1, intPtr(3), EventListingRevisited, 5)},
			wantOK:       true,
			wantCategory: StoryRevisitedNoAction,
			wantListing:  3,
		},
		{
			name: "повторные просмотры со сделкой — не срабатывает",
			events: []Event{
				storyEvent(1, intPtr(3), EventListingRevisited, 5),
				storyEvent(1, intPtr(3), EventDealCompleted, 6),
			},
			wantOK: false,
		},
		{
			name:   "нет подходящих сценариев — пустой результат",
			events: []Event{storyEvent(1, intPtr(4), EventViewAd, 5)},
			wantOK: false,
		},
		{
			name:   "совсем нет событий",
			events: nil,
			wantOK: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			story, ok := FindUnfinishedStory(tt.events, 1)

			if ok != tt.wantOK {
				t.Fatalf("ok = %v, ожидали %v (story=%+v)", ok, tt.wantOK, story)
			}
			if !tt.wantOK {
				// пустой результат должен быть zero value
				if story != (UnfinishedStory{}) {
					t.Fatalf("при пустом результате ожидали zero value, получили %+v", story)
				}
				return
			}

			if story.Category != tt.wantCategory {
				t.Errorf("category = %q, ожидали %q", story.Category, tt.wantCategory)
			}
			if story.Reason == "" {
				t.Error("основание не должно быть пустым")
			}
			if story.CTA == "" {
				t.Error("CTA не должен быть пустым")
			}

			listing, has := gotListing(story)
			if tt.wantListing == -1 {
				if has {
					t.Errorf("ожидали listing_id = nil, получили %d", listing)
				}
			} else {
				if !has || listing != tt.wantListing {
					t.Errorf("listing_id = %v (has=%v), ожидали %d", listing, has, tt.wantListing)
				}
			}
		})
	}
}

// TestFindUnfinishedStory_Priority: при нескольких подходящих сценариях
// выбирается старший по приоритету.
func TestFindUnfinishedStory_Priority(t *testing.T) {
	// все четыре сценария присутствуют одновременно
	base := []Event{
		storyEvent(1, intPtr(1), EventDraftCreated, 1),
		storyEvent(1, intPtr(2), EventAddToFavorites, 2),
		storyEvent(1, nil, EventSavedSearch, 3),
		storyEvent(1, intPtr(3), EventListingRevisited, 4),
	}

	steps := []struct {
		name         string
		drop         string // категория события, которую убираем, снижая приоритет
		wantCategory string
	}{
		{"все сценарии -> черновик", "", StoryDraftUnpublished},
		{"без черновика -> избранное", EventDraftCreated, StoryFavoriteNoContact},
		{"без избранного -> сохранённый поиск", EventAddToFavorites, StorySavedSearch},
		{"без поиска -> повторные просмотры", EventSavedSearch, StoryRevisitedNoAction},
	}

	events := base
	for _, step := range steps {
		if step.drop != "" {
			events = withoutType(events, step.drop)
		}
		t.Run(step.name, func(t *testing.T) {
			story, ok := FindUnfinishedStory(events, 1)
			if !ok {
				t.Fatalf("ожидали результат, получили пустой")
			}
			if story.Category != step.wantCategory {
				t.Errorf("category = %q, ожидали %q", story.Category, step.wantCategory)
			}
		})
	}
}

// TestFindUnfinishedStory_LatestWithinScenario: внутри сценария берётся самое
// свежее объявление, при равенстве времени — с меньшим listing_id.
func TestFindUnfinishedStory_LatestWithinScenario(t *testing.T) {
	t.Run("самое свежее по времени", func(t *testing.T) {
		events := []Event{
			storyEvent(1, intPtr(5), EventDraftCreated, 3),
			storyEvent(1, intPtr(8), EventDraftCreated, 7), // самый поздний
			storyEvent(1, intPtr(2), EventDraftCreated, 5),
		}
		story, ok := FindUnfinishedStory(events, 1)
		if !ok {
			t.Fatal("ожидали результат")
		}
		if listing, _ := gotListing(story); listing != 8 {
			t.Errorf("listing_id = %d, ожидали 8 (самый свежий)", listing)
		}
	})

	t.Run("равенство времени -> меньший listing_id", func(t *testing.T) {
		events := []Event{
			storyEvent(1, intPtr(8), EventDraftCreated, 7),
			storyEvent(1, intPtr(2), EventDraftCreated, 7), // то же время, id меньше
		}
		story, ok := FindUnfinishedStory(events, 1)
		if !ok {
			t.Fatal("ожидали результат")
		}
		if listing, _ := gotListing(story); listing != 2 {
			t.Errorf("listing_id = %d, ожидали 2 (tie-break по меньшему id)", listing)
		}
	})
}

// TestFindUnfinishedStory_FiltersUser: события других пользователей игнорируются.
func TestFindUnfinishedStory_FiltersUser(t *testing.T) {
	events := []Event{
		storyEvent(2, intPtr(1), EventDraftCreated, 5), // чужой пользователь
	}
	if story, ok := FindUnfinishedStory(events, 1); ok {
		t.Errorf("ожидали пустой результат для user 1, получили %+v", story)
	}
	if _, ok := FindUnfinishedStory(events, 2); !ok {
		t.Error("для user 2 ожидали найденный сценарий")
	}
}

// TestFindUnfinishedStory_DeduplicatesByEventID: дубли с одинаковым EventID
// не ломают выбор — учитываются один раз.
func TestFindUnfinishedStory_DeduplicatesByEventID(t *testing.T) {
	dup := storyEvent(1, intPtr(2), EventAddToFavorites, 5)
	dup.EventID = "same"
	dupLater := dup
	dupLater.Timestamp = time.Date(2025, time.January, 9, 12, 0, 0, 0, time.UTC)

	story, ok := FindUnfinishedStory([]Event{dup, dupLater}, 1)
	if !ok {
		t.Fatal("ожидали результат")
	}
	if story.Category != StoryFavoriteNoContact {
		t.Errorf("category = %q, ожидали %q", story.Category, StoryFavoriteNoContact)
	}
	if listing, _ := gotListing(story); listing != 2 {
		t.Errorf("listing_id = %d, ожидали 2", listing)
	}
}

// TestFindUnfinishedStory_ReasonNotAccusatory: основание ни в одном сценарии
// не должно обвинять пользователя. Проверяем по чёрному списку слов.
func TestFindUnfinishedStory_ReasonNotAccusatory(t *testing.T) {
	blocked := []string{
		"забыл", "забросил", "бросил", "не довёл", "не довел",
		"поленил", "проворонил", "зря", "виноват", "провалил",
	}

	// набор событий, покрывающий все четыре категории по очереди
	perCategory := [][]Event{
		{storyEvent(1, intPtr(1), EventDraftCreated, 5)},
		{storyEvent(1, intPtr(2), EventAddToFavorites, 5)},
		{storyEvent(1, nil, EventSavedSearch, 5)},
		{storyEvent(1, intPtr(3), EventListingRevisited, 5)},
	}

	for _, events := range perCategory {
		story, ok := FindUnfinishedStory(events, 1)
		if !ok {
			t.Fatalf("ожидали результат для событий %+v", events)
		}
		reason := strings.ToLower(story.Reason)
		for _, word := range blocked {
			if strings.Contains(reason, word) {
				t.Errorf("категория %q: основание содержит обвиняющее слово %q: %q",
					story.Category, word, story.Reason)
			}
		}
	}
}

// withoutType возвращает копию событий без событий указанного типа.
func withoutType(events []Event, eventType string) []Event {
	result := make([]Event, 0, len(events))
	for _, event := range events {
		if event.Type == eventType {
			continue
		}
		result = append(result, event)
	}
	return result
}
