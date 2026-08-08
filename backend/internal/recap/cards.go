package recap

import (
	"fmt"
	"strconv"
	"time"
)

// Типы карточек recap в порядке их отображения.
const (
	CardIntro         = "intro"
	CardYearInNumbers = "year_in_numbers"
	CardRoleRatio     = "role_ratio"
	CardMainCategory  = "main_category"
	CardActivePeriod  = "active_period"
)

// Card — карточка recap для отдачи через API. Это DTO: только строки,
// без внутренних моделей базы данных. Explanation заполняется только у
// персональных карточек (построенных по данным пользователя).
type Card struct {
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Explanation string `json:"explanation,omitempty"`
}

// BuildCards собирает базовый набор карточек recap в фиксированном порядке:
// вступление, год в цифрах, соотношение ролей, главная категория, активный период.
// Первая карточка (intro) — общая, без explanation; остальные персональные.
func BuildCards(metrics Metrics, roles Roles, mainCategory MainCategoryResult) []Card {
	return []Card{
		introCard(),
		yearInNumbersCard(metrics),
		roleRatioCard(roles),
		mainCategoryCard(mainCategory),
		activePeriodCard(metrics.MostActiveMonth),
	}
}

func introCard() Card {
	return Card{
		Type:        CardIntro,
		Title:       "Ваш год на Авито",
		Description: "Мы собрали, каким был ваш год: сделки, находки и любимые категории.",
	}
}

func yearInNumbersCard(m Metrics) Card {
	description := fmt.Sprintf(
		"За год: %d активных дней, %d просмотров объявлений, %d в избранном, %d обращений к продавцам.",
		m.ActiveDays, m.ViewedAds, m.Favorites, m.ContactsStarted,
	)
	explanation := fmt.Sprintf(
		"Активность за год: дней с действиями — %d, активных месяцев — %d, просмотрено объявлений — %d, "+
			"просмотрено категорий — %d, добавлено в избранное — %d, обращений к продавцам — %d, "+
			"опубликовано объявлений — %d.",
		m.ActiveDays, m.ActiveMonths, m.ViewedAds, m.ViewedCategories,
		m.Favorites, m.ContactsStarted, m.CreatedAds,
	)
	return Card{
		Type:        CardYearInNumbers,
		Title:       "Год в цифрах",
		Description: description,
		Explanation: explanation,
	}
}

func roleRatioCard(r Roles) Card {
	name, percent := dominantRole(r)

	description := fmt.Sprintf("Ваша главная роль — %s (%d%%).", name, percent)
	explanation := fmt.Sprintf(
		"Соотношение ролей: покупатель — %d%%, продавец — %d%%, исследователь — %d%%, коллекционер идей — %d%%. "+
			"Роли считаются по долям действий и в сумме дают 100%%.",
		r.Buyer, r.Seller, r.Researcher, r.IdeaCollector,
	)
	return Card{
		Type:        CardRoleRatio,
		Title:       "Кто вы на Авито",
		Description: description,
		Explanation: explanation,
	}
}

// dominantRole возвращает роль с наибольшей долей. При равенстве действует
// фиксированный порядок: покупатель, продавец, исследователь, коллекционер идей.
func dominantRole(r Roles) (string, int) {
	roles := []struct {
		name    string
		percent int
	}{
		{"покупатель", r.Buyer},
		{"продавец", r.Seller},
		{"исследователь", r.Researcher},
		{"коллекционер идей", r.IdeaCollector},
	}

	best := roles[0]
	for _, role := range roles[1:] {
		if role.percent > best.percent {
			best = role
		}
	}
	return best.name, best.percent
}

func mainCategoryCard(main MainCategoryResult) Card {
	description := "Главная категория пока не определена."
	if main.Main.CategoryName != "" {
		description = fmt.Sprintf("Ваша главная категория — «%s».", main.Main.CategoryName)
	}

	// персональная карточка всегда содержит explanation, даже без данных
	explanation := main.Explanation
	if explanation == "" {
		explanation = "Недостаточно действий с объявлениями, чтобы определить главную категорию."
	}

	return Card{
		Type:        CardMainCategory,
		Title:       "Главная категория",
		Description: description,
		Explanation: explanation,
	}
}

func activePeriodCard(mostActiveMonth string) Card {
	description := "Активный период за год не определён."
	explanation := "За год не зафиксировано действий, по которым можно определить активный период."

	if label := monthLabel(mostActiveMonth); label != "" {
		description = fmt.Sprintf("Ваш самый активный период — %s.", label)
		explanation = fmt.Sprintf("Больше всего действий пришлось на %s.", label)
	}

	return Card{
		Type:        CardActivePeriod,
		Title:       "Самый активный период",
		Description: description,
		Explanation: explanation,
	}
}

// monthLabel переводит месяц формата "2006-01" в читаемую подпись "апрель 2025".
// Для пустой или некорректной строки возвращает "".
func monthLabel(month string) string {
	if month == "" {
		return ""
	}

	parsed, err := time.Parse("2006-01", month)
	if err != nil {
		return ""
	}

	months := []string{
		"январь", "февраль", "март", "апрель", "май", "июнь",
		"июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
	}

	return months[parsed.Month()-1] + " " + strconv.Itoa(parsed.Year())
}
