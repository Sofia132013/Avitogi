package recap

import (
	"fmt"
	"sort"
	"strings"

	appinternal "avitogi/backend/internal"
)

// Дополнительные типы событий, которые участвуют в скоринге категории,
// но не заведены как константы в metrics.go.
const (
	EventRevisitAd    = "listing_revisited"
	EventDealComplete = "deal_completed"
	EventDraftCreate  = "draft_created"
	EventCloseAd      = "listing_closed"
)

// DefaultCategoryWeights задает вес каждого действия во взвешенной сумме.
// Учитываются и действия покупателя (просмотр, избранное, контакт), и действия
// продавца (черновик, публикация, закрытие) — в одной шкале. Простой просмотр
// весит меньше, чем избранное или контакт с продавцом. Типы событий без веса
// (например, category_viewed без объявления) в расчет не входят.
var DefaultCategoryWeights = map[string]int{
	EventViewAd:         1, // listing_viewed
	EventDraftCreate:    1, // draft_created (слабый интент продавца)
	EventRevisitAd:      2, // listing_revisited
	EventCloseAd:        2, // listing_closed (двусмысленно: продано или снято)
	EventAddToFavorites: 3, // favorite_added
	EventCreateAd:       3, // listing_published (явная привязка продавца к категории)
	EventStartContact:   5, // seller_contact_started
	EventDealComplete:   8, // deal_completed (общее для покупателя и продавца)
}

// CategoryScore — итоговый балл по одной корневой категории с разбивкой по действиям.
type CategoryScore struct {
	CategoryID   int            `json:"category_id"`
	CategoryName string         `json:"category_name"`
	Score        int            `json:"score"`
	Breakdown    map[string]int `json:"breakdown"` // тип события -> суммарный вклад в балл
}

// MainCategoryResult — результат TASK-09: главная категория, все баллы,
// самый активный месяц и человекочитаемое объяснение расчета.
type MainCategoryResult struct {
	Main            CategoryScore   `json:"main"`
	AllScores       []CategoryScore `json:"all_scores"`
	MostActiveMonth string          `json:"most_active_month"`
	Explanation     string          `json:"explanation"`
}

// DetermineMainCategory определяет главную категорию пользователя по взвешенной
// сумме действий и самый активный месяц.
//
//   - events            — события пользователя (уже отфильтрованные по пользователю и году);
//   - listingToCategory — соответствие listing_id -> category_id объявления;
//   - categories        — все категории по id (нужны имена и parent_id для сворачивания);
//   - weights           — веса действий; при nil берутся DefaultCategoryWeights.
//
// Категория объявления сворачивается до корневой (parent_id == nil), поэтому
// подкатегории суммируются в свою основную категорию. При равенстве баллов
// выигрывает категория с наименьшим id (фиксированное правило). Самый активный
// месяц считается по всем событиям пользователя за период.
func DetermineMainCategory(
	events []Event,
	listingToCategory map[int]int,
	categories map[int]appinternal.Category,
	weights map[string]int,
) MainCategoryResult {
	if weights == nil {
		weights = DefaultCategoryWeights
	}

	scores := make(map[int]*CategoryScore) // rootCategoryID -> накопленный балл
	seenEventIDs := make(map[string]struct{})

	for _, event := range events {
		// одинаковые события учитываем один раз, как в CalculateMetrics
		if event.EventID != "" {
			if _, exists := seenEventIDs[event.EventID]; exists {
				continue
			}
			seenEventIDs[event.EventID] = struct{}{}
		}

		// без объявления невозможно определить категорию — пропускаем
		if event.ListingID == nil {
			continue
		}

		weight := weights[event.Type]
		if weight == 0 {
			continue
		}

		categoryID, ok := listingToCategory[*event.ListingID]
		if !ok {
			continue
		}

		rootID := rootCategoryID(categoryID, categories)

		score := scores[rootID]
		if score == nil {
			score = &CategoryScore{
				CategoryID:   rootID,
				CategoryName: categories[rootID].Name,
				Breakdown:    make(map[string]int),
			}
			scores[rootID] = score
		}

		score.Score += weight
		score.Breakdown[event.Type] += weight
	}

	allScores := sortedScores(scores)

	result := MainCategoryResult{
		AllScores: allScores,
		// активный месяц считаем по всем событиям пользователя за период
		MostActiveMonth: MostActiveMonth(events),
	}
	if len(allScores) > 0 {
		result.Main = allScores[0]
	}
	result.Explanation = buildExplanation(result)

	return result
}

// rootCategoryID поднимается по цепочке parent_id до корневой категории.
// Если категория не найдена в справочнике, возвращаем исходный id как есть.
func rootCategoryID(categoryID int, categories map[int]appinternal.Category) int {
	visited := make(map[int]struct{})

	for {
		category, ok := categories[categoryID]
		if !ok {
			return categoryID
		}
		if category.ParentID == nil {
			return categoryID
		}
		// защита от циклов в данных
		if _, seen := visited[categoryID]; seen {
			return categoryID
		}
		visited[categoryID] = struct{}{}

		categoryID = *category.ParentID
	}
}

// sortedScores возвращает баллы, отсортированные по убыванию балла,
// а при равенстве — по возрастанию id категории (детерминированный порядок).
func sortedScores(scores map[int]*CategoryScore) []CategoryScore {
	result := make([]CategoryScore, 0, len(scores))
	for _, score := range scores {
		result = append(result, *score)
	}

	sort.Slice(result, func(i, j int) bool {
		if result[i].Score != result[j].Score {
			return result[i].Score > result[j].Score
		}
		return result[i].CategoryID < result[j].CategoryID
	})

	return result
}

// buildExplanation собирает человекочитаемое объяснение расчета на русском.
func buildExplanation(result MainCategoryResult) string {
	if len(result.AllScores) == 0 {
		return "Недостаточно действий с объявлениями, чтобы определить главную категорию."
	}

	var b strings.Builder
	if len(result.AllScores) == 1 {
		return "Других категорий в активности не найдено."
	}

	b.WriteString("Другие категории:\n")
	for _, score := range result.AllScores[1:] {
		fmt.Fprintf(&b, "  - «%s»: %d баллов\n", score.CategoryName, score.Score)
	}

	return b.String()
}
