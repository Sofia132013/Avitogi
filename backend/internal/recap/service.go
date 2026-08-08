package recap

import (
	"database/sql"

	appinternal "avitogi/backend/internal"
)

// BuildUserRecap собирает карточки recap для пользователя за год: читает события,
// объявления и категории из базы, считает метрики (TASK-07), соотношение ролей
// (TASK-08) и главную категорию (TASK-09), затем формирует карточки (TASK-10).
// Возвращает только DTO-карточки, без внутренних моделей базы данных.
func BuildUserRecap(db *sql.DB, userID int, year int) ([]Card, error) {
	dbEvents, err := appinternal.GetEventsByUserAndYear(db, userID, year)
	if err != nil {
		return nil, err
	}

	categories, err := appinternal.GetCategories(db)
	if err != nil {
		return nil, err
	}

	listingToCategory, err := appinternal.GetListingCategoryMap(db)
	if err != nil {
		return nil, err
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

	return BuildCards(metrics, roles, mainCategory), nil
}
