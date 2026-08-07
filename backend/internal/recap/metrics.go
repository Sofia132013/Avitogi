package recap

import (
	"strconv"
	"time"

	appinternal "avitogi/backend/internal"
)

const (
	EventViewAd         = "listing_viewed"
	EventViewCategory   = "category_viewed"
	EventAddToFavorites = "favorite_added"
	EventStartContact   = "seller_contact_started"
	EventCreateAd       = "listing_published"
)

type Event struct {
	UserID    int       `json:"user_id"`
	Type      string    `json:"type"`
	Timestamp time.Time `json:"timestamp"`
	EventID   string    `json:"event_id,omitempty"`
}

type Metrics struct {
	ActiveDays       int    `json:"active_days"`
	ActiveMonths     int    `json:"active_months"`
	ViewedAds        int    `json:"viewed_ads"`
	ViewedCategories int    `json:"viewed_categories"`
	Favorites        int    `json:"favorites"`
	ContactsStarted  int    `json:"contacts_started"`
	CreatedAds       int    `json:"created_ads"`
	MostActiveMonth  string `json:"most_active_month"`
}

func EventsFromAggregates(events []appinternal.Event) []Event {
	// приводим агрегированные события к формату, который использует расчет метрик
	result := []Event{}

	for _, event := range events {
		for i := 0; i < event.Amount; i++ {
			result = append(result, Event{
				UserID:    event.UserID,
				Type:      event.Type,
				Timestamp: time.Date(event.Year, time.January, 1, 0, 0, 0, 0, time.UTC),
				EventID:   strconv.Itoa(event.ID) + "-" + strconv.Itoa(i),
			})
		}
	}

	return result
}

func CalculateMetrics(events []Event, userID int) Metrics {
	metrics := Metrics{}

	// используем map, чтобы хранить только уникальные значения
	seenEventIDs := make(map[string]struct{})
	activeDays := make(map[string]struct{})
	activeMonths := make(map[string]struct{})
	eventsByMonth := make(map[string]int)

	for _, event := range events {
		// считаем метрики только для выбранного пользователя
		if event.UserID != userID {
			continue
		}

		// если EventID есть, то одинаковые события считаем один раз
		if event.EventID != "" {
			if _, exists := seenEventIDs[event.EventID]; exists {
				continue
			}
			seenEventIDs[event.EventID] = struct{}{}
		}

		day := event.Timestamp.Format("2006-01-02")
		month := event.Timestamp.Format("2006-01")

		// запоминаем активные дни, месяцы и количество событий в месяце
		activeDays[day] = struct{}{}
		activeMonths[month] = struct{}{}
		eventsByMonth[month]++

		// увеличиваем счетчик нужной метрики по типу события
		switch event.Type {
		case EventViewAd:
			metrics.ViewedAds++
		case EventViewCategory:
			metrics.ViewedCategories++
		case EventAddToFavorites:
			metrics.Favorites++
		case EventStartContact:
			metrics.ContactsStarted++
		case EventCreateAd:
			metrics.CreatedAds++
		}
	}

	metrics.ActiveDays = len(activeDays)
	metrics.ActiveMonths = len(activeMonths)
	metrics.MostActiveMonth = mostActiveMonth(eventsByMonth)

	return metrics
}

func mostActiveMonth(eventsByMonth map[string]int) string {
	bestMonth := ""
	bestCount := 0

	for month, count := range eventsByMonth {
		// при равенстве берем более ранний месяц, чтобы результат был стабильным
		if count > bestCount || count == bestCount && (bestMonth == "" || month < bestMonth) {
			bestMonth = month
			bestCount = count
		}
	}

	return bestMonth
}
