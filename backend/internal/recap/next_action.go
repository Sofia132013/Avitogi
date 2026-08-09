package recap

// Типы следующего действия, которое recap предлагает пользователю.
const (
	ActionContinueDraft   = "CONTINUE_DRAFT"
	ActionOpenFavorites   = "OPEN_FAVORITES"
	ActionOpenSavedSearch = "OPEN_SAVED_SEARCH"
	ActionOpenCategory    = "OPEN_CATEGORY"
	ActionCreateListing   = "CREATE_LISTING"
)

// Пороги «сильного покупательского интереса» (tier 2). Значения подобраны так,
// чтобы отделить активного покупателя от случайного захода.
const (
	strongInterestViews     = 5
	strongInterestFavorites = 3
	strongInterestContacts  = 1
)

// Recommendation — следующее действие, предлагаемое пользователю в recap.
// Содержит тип (машинный), заголовок и причину (обязательно по критерию), а
// также опциональные цели навигации. Пустой рекомендации не бывает: при
// отсутствии истории и интереса возвращается безопасная общая рекомендация.
type Recommendation struct {
	Type       string `json:"type"`
	Title      string `json:"title"`
	Reason     string `json:"reason"`
	ListingID  *int   `json:"listing_id,omitempty"`
	CategoryID *int   `json:"category_id,omitempty"`
}

// BuildRecommendation выбирает следующее действие по каскаду приоритетов:
//  1. незавершённая история (TASK-15) → действие под её сценарий;
//  2. сильный покупательский интерес → продолжить поиск в главной категории;
//  3. безопасный фолбэк → создать объявление.
//
// listingToCategory нужен, чтобы по объявлению из истории найти его категорию,
// main — для главной категории пользователя. Всегда возвращает заполненную
// рекомендацию.
func BuildRecommendation(
	events []Event,
	userID int,
	metrics Metrics,
	main MainCategoryResult,
	listingToCategory map[int]int,
) Recommendation {
	// tier 1: незавершённая история
	if story, ok := FindUnfinishedStory(events, userID); ok {
		if rec, mapped := recommendationFromStory(story, listingToCategory); mapped {
			return rec
		}
	}

	// tier 2: сильный покупательский интерес → продолжить поиск в главной категории
	if hasStrongBuyerInterest(metrics) && main.Main.CategoryName != "" {
		categoryID := main.Main.CategoryID
		return Recommendation{
			Type:       ActionOpenCategory,
			Title:      "Продолжите поиск",
			Reason:     "Вы активно смотрели объявления — загляните в свою главную категорию.",
			CategoryID: &categoryID,
		}
	}

	// tier 3: безопасная общая рекомендация
	return Recommendation{
		Type:   ActionCreateListing,
		Title:  "Разместите объявление",
		Reason: "Начните с первого объявления — это займёт пару минут.",
	}
}

// recommendationFromStory превращает незавершённую историю в рекомендацию с
// собственным копирайтом на тип действия. Второй результат = false, если по
// сценарию revisited не удалось определить категорию (тогда каскад идёт дальше).
func recommendationFromStory(
	story UnfinishedStory,
	listingToCategory map[int]int,
) (Recommendation, bool) {
	switch story.Category {
	case StoryDraftUnpublished:
		return Recommendation{
			Type:      ActionContinueDraft,
			Title:     "Завершите публикацию",
			Reason:    "Вы начали объявление, но пока не опубликовали его.",
			ListingID: story.ListingID,
		}, true

	case StoryFavoriteNoContact:
		return Recommendation{
			Type:      ActionOpenFavorites,
			Title:     "Вернитесь к избранному",
			Reason:    "В избранном есть объявление, по которому можно написать продавцу.",
			ListingID: story.ListingID,
		}, true

	case StorySavedSearch:
		return Recommendation{
			Type:   ActionOpenSavedSearch,
			Title:  "Продолжите поиск",
			Reason: "У вас есть сохранённый поиск — свежие варианты уже ждут.",
		}, true

	case StoryRevisitedNoAction:
		// для перехода в категорию нужен id категории этого объявления
		categoryID, ok := categoryOfListing(story.ListingID, listingToCategory)
		if !ok {
			return Recommendation{}, false
		}
		return Recommendation{
			Type:       ActionOpenCategory,
			Title:      "Посмотрите похожие",
			Reason:     "Вы возвращались к объявлению — в этой категории есть ещё варианты.",
			ListingID:  story.ListingID,
			CategoryID: &categoryID,
		}, true

	default:
		return Recommendation{}, false
	}
}

// hasStrongBuyerInterest определяет активного покупателя по метрикам: достаточно
// одного сильного сигнала — много просмотров, заметное избранное или контакт.
func hasStrongBuyerInterest(m Metrics) bool {
	return m.ViewedAds >= strongInterestViews ||
		m.Favorites >= strongInterestFavorites ||
		m.ContactsStarted >= strongInterestContacts
}

// categoryOfListing возвращает id категории объявления по карте listing→category.
func categoryOfListing(listingID *int, listingToCategory map[int]int) (int, bool) {
	if listingID == nil {
		return 0, false
	}
	categoryID, ok := listingToCategory[*listingID]
	return categoryID, ok
}
