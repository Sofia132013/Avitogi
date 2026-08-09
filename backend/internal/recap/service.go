package recap

import (
	"database/sql"

	appinternal "avitogi/backend/internal"
)

type RecapResponse struct {
	// cards — весь recap одним списком для фронта
	Cards []Card `json:"cards"`
}

// BuildUserRecap собирает карточки recap для пользователя за год: читает события,
// объявления и категории из базы, считает метрики (TASK-07), соотношение ролей
// (TASK-08) и главную категорию (TASK-09), затем формирует карточки (TASK-10).
// Возвращает только DTO-карточки, без внутренних моделей базы данных.
func BuildUserRecap(db *sql.DB, userID int, year int) (RecapResponse, error) {
	dbEvents, err := appinternal.GetEventsByUserAndYear(db, userID, year)
	if err != nil {
		return RecapResponse{}, err
	}

	categories, err := appinternal.GetCategories(db)
	if err != nil {
		return RecapResponse{}, err
	}

	listingToCategory, err := appinternal.GetListingCategoryMap(db)
	if err != nil {
		return RecapResponse{}, err
	}

	events := EventsFromDB(dbEvents)

	metrics := CalculateMetrics(events, userID)
	roles := CalculateRoles(events, userID)
	mainCategory := DetermineMainCategory(
		events,
		listingToCategory,
		appinternal.CategoriesByID(categories),
		nil, // веса по умолчанию
	)
	// считаем ачивки по тем же событиям, что и остальные карточки recap
	achievements := CalculateAchievements(events, userID, listingToCategory)

	cards := BuildCards(metrics, roles, mainCategory)
	// добавляем ачивки как обычную карточку recap
	cards = append(cards, achievementsCard(achievements))

	return RecapResponse{
		Cards: cards,
	}, nil
}
