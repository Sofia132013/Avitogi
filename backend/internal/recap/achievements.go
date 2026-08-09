package recap

const (
	AchievementPreciseChoice = "precise_choice"
	AchievementInTouch       = "in_touch"
	AchievementYearShowcase  = "year_showcase"
	AchievementDealClosed    = "deal_closed"
	AchievementWideRoute     = "wide_route"
)

// earned показывает, получена ли ачивка
type Achievement struct {
	Code        string `json:"code"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Earned      bool   `json:"earned"`
}

// возвращает все ачивки для пользователя
func CalculateAchievements(events []Event, userID int, listingToCategory map[int]int) []Achievement {
	// считаем действия пользователя за выбранный год
	stats := achievementStats(events, userID, listingToCategory)

	// здесь описаны правила для каждой ачивки
	return []Achievement{
		{
			Code:        AchievementPreciseChoice,
			Title:       "Точный выбор",
			Description: "Добавить в избранное минимум 2 объявления.",
			Earned:      stats.favorites >= 2,
		},
		{
			Code:        AchievementInTouch,
			Title:       "На связи",
			Description: "Начать минимум 2 контакта с продавцами.",
			Earned:      stats.contacts >= 2,
		},
		{
			Code:        AchievementYearShowcase,
			Title:       "Витрина года",
			Description: "Опубликовать минимум 2 объявления.",
			Earned:      stats.published >= 2,
		},
		{
			Code:        AchievementDealClosed,
			Title:       "Сделка закрыта",
			Description: "Завершить хотя бы одну сделку.",
			Earned:      stats.deals >= 1,
		},
		{
			Code:        AchievementWideRoute,
			Title:       "Широкий маршрут",
			Description: "Взаимодействовать с объявлениями минимум из 3 категорий.",
			Earned:      stats.categories >= 3,
		},
	}
}

// хранит счетчики, которые нужны для ачивок
type achievementCounters struct {
	favorites  int
	contacts   int
	published  int
	deals      int
	categories int
}

func achievementStats(events []Event, userID int, listingToCategory map[int]int) achievementCounters {
	// нужен, чтобы не считать одно событие два раза
	seenEventIDs := make(map[string]struct{})
	// нужен, чтобы посчитать разные категории
	categoryIDs := make(map[int]struct{})
	stats := achievementCounters{}

	for _, event := range events {
		// считаем только события выбранного пользователя
		if event.UserID != userID {
			continue
		}

		// одинаковые события учитываем только один раз
		if event.EventID != "" {
			if _, exists := seenEventIDs[event.EventID]; exists {
				continue
			}
			seenEventIDs[event.EventID] = struct{}{}
		}

		// увеличиваем нужный счетчик по типу события
		switch event.Type {
		case EventAddToFavorites:
			stats.favorites++
		case EventStartContact:
			stats.contacts++
		case EventCreateAd:
			stats.published++
		case "deal_completed":
			stats.deals++
		}

		// категорию события определяем через объявление
		if event.ListingID != nil {
			if categoryID, exists := listingToCategory[*event.ListingID]; exists {
				categoryIDs[categoryID] = struct{}{}
			}
		}
	}

	// записываем сколько разных категорий получилось
	stats.categories = len(categoryIDs)
	return stats
}
