package tests

import (
	"reflect"
	"testing"
	"time"

	"avitogi/backend/internal/recap"
)

func TestEmptyEvents(t *testing.T) {
	// проверяем, что пустой список возвращает пустые метрики
	got := recap.CalculateMetrics(nil, 1)
	want := recap.Metrics{}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateMetrics() = %+v, want %+v", got, want)
	}
}

func TestUserFilter(t *testing.T) {
	// проверяем, что события другого пользователя не попадают в расчет
	events := []recap.Event{
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "1"},
		{UserID: 2, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
		{UserID: 2, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-02"), EventID: "3"},
	}

	got := recap.CalculateMetrics(events, 1)
	want := recap.Metrics{
		ActiveDays:      1,
		ActiveMonths:    1,
		ViewedAds:       1,
		MostActiveMonth: "2026-08",
	}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateMetrics() = %+v, want %+v", got, want)
	}
}

func TestSeveralMonths(t *testing.T) {
	// проверяем активность пользователя в нескольких месяцах
	events := []recap.Event{
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-07-15"), EventID: "1"},
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
		{UserID: 1, Type: recap.EventStartContact, Timestamp: testDate("2026-08-02"), EventID: "3"},
		{UserID: 1, Type: recap.EventViewCategory, Timestamp: testDate("2026-09-01"), EventID: "4"},
	}

	got := recap.CalculateMetrics(events, 1)
	want := recap.Metrics{
		ActiveDays:       4,
		ActiveMonths:     3,
		ViewedAds:        1,
		ViewedCategories: 1,
		ContactsStarted:  1,
		CreatedAds:       1,
		MostActiveMonth:  "2026-08",
	}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateMetrics() = %+v, want %+v", got, want)
	}
}

func TestDuplicates(t *testing.T) {
	// проверяем, что одинаковый EventID учитывается только один раз
	events := []recap.Event{
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "duplicate"},
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-02"), EventID: "duplicate"},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-02")},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-02")},
	}

	got := recap.CalculateMetrics(events, 1)
	want := recap.Metrics{
		ActiveDays:      2,
		ActiveMonths:    1,
		ViewedAds:       3,
		MostActiveMonth: "2026-08",
	}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateMetrics() = %+v, want %+v", got, want)
	}
}

func TestMissingTypes(t *testing.T) {
	// проверяем, что отсутствующие типы событий остаются нулями
	events := []recap.Event{
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "1"},
	}

	got := recap.CalculateMetrics(events, 1)
	want := recap.Metrics{
		ActiveDays:      1,
		ActiveMonths:    1,
		ViewedAds:       1,
		MostActiveMonth: "2026-08",
	}

	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateMetrics() = %+v, want %+v", got, want)
	}
}

func TestEqualMonths(t *testing.T) {
	// проверяем, что при равенстве выбирается более ранний месяц
	events := []recap.Event{
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-09-01"), EventID: "1"},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
	}

	got := recap.CalculateMetrics(events, 1)

	if got.MostActiveMonth != "2026-08" {
		t.Fatalf("MostActiveMonth = %q, want %q", got.MostActiveMonth, "2026-08")
	}
}

func testDate(value string) time.Time {
	// переводим строку в дату, чтобы тестовые события было удобно читать
	t, err := time.Parse("2006-01-02", value)
	if err != nil {
		panic(err)
	}

	return t
}
