package internal

import (
	"database/sql"
	"errors"
)

// Чтение тестовых профилей, категорий и событий из базы.

var ErrProfileNotFound = errors.New("профиль не найден")

func GetProfiles(db *sql.DB) ([]User, error) {
	// читаем все тестовые профили из базы
	rows, err := db.Query(`
		SELECT id, name, avatar_url, registered_at, rating, created_at
		FROM users
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	profiles := []User{}
	for rows.Next() {
		var profile User
		var avatarURL sql.NullString

		err := rows.Scan(
			&profile.ID,
			&profile.Name,
			&avatarURL,
			&profile.RegisteredAt,
			&profile.Rating,
			&profile.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		profile.AvatarURL = stringPtrFromNull(avatarURL)
		profiles = append(profiles, profile)
	}

	return profiles, rows.Err()
}

func GetProfileByID(db *sql.DB, id int) (User, error) {
	// читаем один профиль по id
	var profile User
	var avatarURL sql.NullString

	err := db.QueryRow(`
		SELECT id, name, avatar_url, registered_at, rating, created_at
		FROM users
		WHERE id = $1
	`, id).Scan(
		&profile.ID,
		&profile.Name,
		&avatarURL,
		&profile.RegisteredAt,
		&profile.Rating,
		&profile.CreatedAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return User{}, ErrProfileNotFound
	}
	if err != nil {
		return User{}, err
	}

	profile.AvatarURL = stringPtrFromNull(avatarURL)
	return profile, nil
}

func GetCategories(db *sql.DB) ([]Category, error) {
	// читаем категории для тестовых объявлений
	rows, err := db.Query(`
		SELECT id, name, parent_id, created_at
		FROM categories
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := []Category{}
	for rows.Next() {
		var category Category
		var parentID sql.NullInt64

		err := rows.Scan(
			&category.ID,
			&category.Name,
			&parentID,
			&category.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		category.ParentID = intPtrFromNull(parentID)
		categories = append(categories, category)
	}

	return categories, rows.Err()
}

func GetEventsByUserAndYear(db *sql.DB, userID int, year int) ([]Event, error) {
	// читаем события выбранного пользователя за нужный год
	rows, err := db.Query(`
		SELECT id, user_id, listing_id, event_type, event_date, created_at
		FROM events
		WHERE user_id = $1
			AND event_date >= make_date($2, 1, 1)
			AND event_date < make_date($2 + 1, 1, 1)
		ORDER BY event_date, id
	`, userID, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []Event{}
	for rows.Next() {
		var event Event
		var listingID sql.NullInt64

		err := rows.Scan(
			&event.ID,
			&event.UserID,
			&listingID,
			&event.Type,
			&event.Timestamp,
			&event.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		event.ListingID = intPtrFromNull(listingID)
		events = append(events, event)
	}

	return events, rows.Err()
}

// GetListingCategoryMap возвращает соответствие listing_id -> category_id
// для расчета главной категории по событиям пользователя (TASK-09).
func GetListingCategoryMap(db *sql.DB) (map[int]int, error) {
	rows, err := db.Query(`
		SELECT id, category_id
		FROM listings
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[int]int)
	for rows.Next() {
		var listingID, categoryID int
		if err := rows.Scan(&listingID, &categoryID); err != nil {
			return nil, err
		}
		result[listingID] = categoryID
	}

	return result, rows.Err()
}

// CategoriesByID удобно оборачивает список категорий в map по id,
// как этого ожидает DetermineMainCategory.
func CategoriesByID(categories []Category) map[int]Category {
	result := make(map[int]Category, len(categories))
	for _, category := range categories {
		result[category.ID] = category
	}
	return result
}

func stringPtrFromNull(value sql.NullString) *string {
	if !value.Valid {
		return nil
	}

	return &value.String
}

func intPtrFromNull(value sql.NullInt64) *int {
	if !value.Valid {
		return nil
	}

	result := int(value.Int64)
	return &result
}
