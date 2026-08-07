package recap

import "time"

type Profile struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Rating      int    `json:"rating"`
	Description string `json:"description"`
}

func MockProfiles() []Profile {
	// временные mock-профили, позже их можно будет читать из базы данных
	return []Profile{
		{ID: 1, Name: "Активный покупатель", Rating: 96, Description: "много смотрит объявления, добавляет в избранное и начинает контакты"},
		{ID: 2, Name: "Активный продавец", Rating: 94, Description: "публикует объявления и часто общается с покупателями"},
		{ID: 3, Name: "Исследователь", Rating: 88, Description: "смотрит много категорий и возвращается к интересным объявлениям"},
		{ID: 4, Name: "Незавершенный поиск", Rating: 72, Description: "сохранил интересные варианты, но пока не дошел до контакта"},
		{ID: 5, Name: "Покупатель-продавец", Rating: 91, Description: "активен и как покупатель, и как продавец"},
		{ID: 6, Name: "Малоактивный пользователь", Rating: 45, Description: "редко заходил и совершил мало действий"},
	}
}

func FindProfile(profileID int) (Profile, bool) {
	// ищем профиль по id из списка тестовых профилей
	for _, profile := range MockProfiles() {
		if profile.ID == profileID {
			return profile, true
		}
	}

	return Profile{}, false
}

func MockEvents() []Event {
	// временные mock-события для проверки логики без базы данных
	return []Event{
		{UserID: 1, Type: EventViewAd, Timestamp: parseMockDate("2026-08-01"), EventID: "event-1"},
		{UserID: 1, Type: EventViewAd, Timestamp: parseMockDate("2026-08-01"), EventID: "event-2"},
		{UserID: 1, Type: EventAddToFavorites, Timestamp: parseMockDate("2026-08-02"), EventID: "event-3"},
		{UserID: 1, Type: EventCreateAd, Timestamp: parseMockDate("2026-07-15"), EventID: "event-4"},
		{UserID: 1, Type: EventViewCategory, Timestamp: parseMockDate("2026-07-16"), EventID: "event-5"},
		{UserID: 1, Type: EventStartContact, Timestamp: parseMockDate("2026-08-03"), EventID: "event-6"},
		// дубль нужен, чтобы проверить дедупликацию по EventID
		{UserID: 1, Type: EventViewAd, Timestamp: parseMockDate("2026-08-03"), EventID: "event-6"},
		// событие другого пользователя нужно, чтобы проверить фильтрацию по user_id
		{UserID: 2, Type: EventViewAd, Timestamp: parseMockDate("2026-08-01"), EventID: "event-7"},
	}
}

func parseMockDate(value string) time.Time {
	// переводим строку в дату, чтобы mock-события было проще читать
	t, err := time.Parse("2006-01-02", value)
	if err != nil {
		panic(err)
	}

	return t
}
