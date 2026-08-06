package internal

import (
	"database/sql"
	"errors"
)

// Чтение тестовых профилей, категорий и событий из базы.

var ErrProfileNotFound = errors.New("профиль не найден")

func GetProfiles(db *sql.DB) ([]User, error) {
	// TODO: соединение с базой
	return nil, nil
}

func GetProfileByID(db *sql.DB, id int) (User, error) {
	// TODO: соединение с базой
	return User{}, nil
}

func GetCategories(db *sql.DB) ([]Category, error) {
	// TODO: соединение с базой
	return nil, nil
}

func GetEventsByUserAndYear(db *sql.DB, userID int, year int) ([]Event, error) {
	// TODO: соединение с базой
	return nil, nil
}
