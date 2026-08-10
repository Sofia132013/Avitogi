package recap

import "time"

// Категории незавершённых сценариев в порядке их приоритета: от самого
// «горячего» (начатая публикация) к самому мягкому (повторные просмотры).
const (
	StoryDraftUnpublished  = "draft_unpublished"
	StoryFavoriteNoContact = "favorite_no_contact"
	StorySavedSearch       = "saved_search"
	StoryRevisitedNoAction = "revisited_no_action"
)

// Типы событий, нужные детектору незавершённой истории и отсутствующие среди
// констант метрик. Значения совпадают с event_type в сид-данных.
const (
	EventDraftCreated     = "draft_created"
	EventSavedSearch      = "search_saved"
	EventListingRevisited = "listing_revisited"
	EventDealCompleted    = "deal_completed"
)

// UnfinishedStory — незакрытый пользовательский сценарий, к которому стоит
// вернуть пользователя. Card-ready DTO: только строки и id объявления, без
// внутренних моделей базы. Пустой результат отдаётся как zero value + ok=false.
type UnfinishedStory struct {
	Category  string `json:"category"`
	Reason    string `json:"reason"`
	ListingID *int   `json:"listing_id,omitempty"`
	CTA       string `json:"cta"`
}

// FindUnfinishedStory ищет одну незавершённую историю пользователя. Проверяет
// все сценарии и возвращает старший по приоритету: черновик без публикации →
// избранное без контакта → сохранённый поиск → повторные просмотры без действия.
// Внутри сценария берётся самое свежее по триггеру объявление (при равенстве
// времени — с меньшим listing_id). Если ни один сценарий не подходит, возвращает
// пустой результат и ok=false. События фильтруются по userID, дубли с одинаковым
// EventID учитываются один раз — как в CalculateMetrics.
func FindUnfinishedStory(events []Event, userID int) (UnfinishedStory, bool) {
	// latest[listingID][eventType] — самый поздний timestamp события такого типа
	// по объявлению. Хватает, чтобы и матчить сценарии, и выбирать свежайший.
	latest := make(map[int]map[string]time.Time)
	seenEventIDs := make(map[string]struct{})
	hasSavedSearch := false

	for _, event := range events {
		// считаем только события выбранного пользователя
		if event.UserID != userID {
			continue
		}

		// одинаковые события (по EventID) учитываем один раз
		if event.EventID != "" {
			if _, exists := seenEventIDs[event.EventID]; exists {
				continue
			}
			seenEventIDs[event.EventID] = struct{}{}
		}

		// сохранённый поиск не привязан к объявлению — достаточно факта наличия
		if event.Type == EventSavedSearch {
			hasSavedSearch = true
			continue
		}

		// остальные сценарии считаются по конкретному объявлению
		if event.ListingID == nil {
			continue
		}

		listingID := *event.ListingID
		byType, ok := latest[listingID]
		if !ok {
			byType = make(map[string]time.Time)
			latest[listingID] = byType
		}
		if prev, ok := byType[event.Type]; !ok || event.Timestamp.After(prev) {
			byType[event.Type] = event.Timestamp
		}
	}

	// приоритет 1: начатый, но неопубликованный черновик
	if story, ok := detectByListing(latest, EventDraftCreated,
		[]string{EventCreateAd},
		UnfinishedStory{
			Category: StoryDraftUnpublished,
			Reason:   "Вы начали объявление, но пока не опубликовали его.",
			CTA:      "Опубликовать черновик",
		}); ok {
		return story, true
	}

	// приоритет 2: объявление в избранном, но без обращения к продавцу
	if story, ok := detectByListing(latest, EventAddToFavorites,
		[]string{EventStartContact, EventDealCompleted},
		UnfinishedStory{
			Category: StoryFavoriteNoContact,
			Reason:   "Вы присмотрели объявление в избранном — можно написать продавцу.",
			CTA:      "Написать продавцу",
		}); ok {
		return story, true
	}

	// приоритет 3: сохранённый поиск (стоячий интерес, «завершения» нет)
	if hasSavedSearch {
		return UnfinishedStory{
			Category: StorySavedSearch,
			Reason:   "У вас есть сохранённый поиск — свежие варианты уже ждут.",
			CTA:      "Открыть сохранённый поиск",
		}, true
	}

	// приоритет 4: возвращался к объявлению, но не совершил следующего действия
	if story, ok := detectByListing(latest, EventListingRevisited,
		[]string{EventAddToFavorites, EventStartContact, EventDealCompleted},
		UnfinishedStory{
			Category: StoryRevisitedNoAction,
			Reason:   "Вы возвращались к этому объявлению — оно всё ещё доступно.",
			CTA:      "Вернуться к объявлению",
		}); ok {
		return story, true
	}

	return UnfinishedStory{}, false
}

// detectByListing собирает объявления с событием-триггером и без единого события
// из excludes, затем берёт самое свежее по триггеру. template задаёт неизменные
// поля истории (категорию, основание, CTA); ListingID проставляется здесь.
func detectByListing(
	latest map[int]map[string]time.Time,
	trigger string,
	excludes []string,
	template UnfinishedStory,
) (UnfinishedStory, bool) {
	bestListingID := 0
	var bestTrigger time.Time
	found := false

	for listingID, byType := range latest {
		triggeredAt, ok := byType[trigger]
		if !ok {
			continue
		}
		if hasAnyType(byType, excludes) {
			continue
		}

		// самое свежее по триггеру; при равенстве времени — меньший listing_id
		if !found ||
			triggeredAt.After(bestTrigger) ||
			(triggeredAt.Equal(bestTrigger) && listingID < bestListingID) {
			bestListingID = listingID
			bestTrigger = triggeredAt
			found = true
		}
	}

	if !found {
		return UnfinishedStory{}, false
	}

	listingID := bestListingID
	template.ListingID = &listingID
	return template, true
}

// hasAnyType сообщает, есть ли по объявлению хотя бы одно событие из types.
func hasAnyType(byType map[string]time.Time, types []string) bool {
	for _, t := range types {
		if _, ok := byType[t]; ok {
			return true
		}
	}
	return false
}
