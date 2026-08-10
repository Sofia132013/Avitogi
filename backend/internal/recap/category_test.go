package recap

import (
	"strconv"
	"strings"
	"testing"
	"time"

	appinternal "avitogi/backend/internal"
)

// intPtr — короткий помощник для *int в тестовых данных.
func intPtr(v int) *int { return &v }

// testCategories повторяет иерархию из сидов: подкатегории 4 и 5
// сворачиваются к корневым 1 (Транспорт) и 2 (Недвижимость).
func testCategories() map[int]appinternal.Category {
	return map[int]appinternal.Category{
		1: {ID: 1, Name: "Транспорт", ParentID: nil},
		2: {ID: 2, Name: "Недвижимость", ParentID: nil},
		4: {ID: 4, Name: "Легковые автомобили", ParentID: intPtr(1)},
		5: {ID: 5, Name: "Квартиры", ParentID: intPtr(2)},
	}
}

// eventBuilder выдает события с уникальными EventID, чтобы их не схлопывала дедупликация.
type eventBuilder struct{ n int }

func (b *eventBuilder) make(listingID *int, eventType string, month int) Event {
	b.n++
	return Event{
		UserID:    1,
		ListingID: listingID,
		Type:      eventType,
		Timestamp: time.Date(2025, time.Month(month), 10, 12, 0, 0, 0, time.UTC),
		EventID:   strconv.Itoa(b.n),
	}
}

func TestDetermineMainCategory_ViewWeighsLessThanFavoriteAndContact(t *testing.T) {
	b := &eventBuilder{}
	listingTransport := intPtr(1) // категория 4 -> корень 1 (Транспорт)
	listingRealty := intPtr(2)    // категория 5 -> корень 2 (Недвижимость)

	events := []Event{
		// Транспорт: одно избранное = 3 балла
		b.make(listingTransport, EventAddToFavorites, 1),
		// Недвижимость: два простых просмотра = 2 балла
		b.make(listingRealty, EventViewAd, 1),
		b.make(listingRealty, EventViewAd, 1),
	}
	listingToCategory := map[int]int{1: 4, 2: 5}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	if got.Main.CategoryID != 1 {
		t.Fatalf("ожидали главную категорию Транспорт (id=1), получили id=%d (%s)",
			got.Main.CategoryID, got.Main.CategoryName)
	}
	if got.Main.Score != 3 {
		t.Fatalf("ожидали 3 балла у Транспорта, получили %d", got.Main.Score)
	}
}

func TestDetermineMainCategory_MaxScoreAndRollupToRoot(t *testing.T) {
	b := &eventBuilder{}
	listingSubcat := intPtr(1) // категория 4 (Легковые) -> корень 1 (Транспорт)
	listingRoot := intPtr(3)   // категория 1 (Транспорт напрямую)
	listingRealty := intPtr(2) // категория 5 -> корень 2 (Недвижимость)

	events := []Event{
		b.make(listingSubcat, EventViewAd, 4),         // +1 Транспорт
		b.make(listingSubcat, EventAddToFavorites, 4), // +3 Транспорт
		b.make(listingRoot, EventStartContact, 4),     // +5 Транспорт
		b.make(listingRealty, EventAddToFavorites, 4), // +3 Недвижимость
	}
	listingToCategory := map[int]int{1: 4, 3: 1, 2: 5}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	if got.Main.CategoryID != 1 || got.Main.Score != 9 {
		t.Fatalf("ожидали Транспорт с 9 баллами, получили id=%d score=%d",
			got.Main.CategoryID, got.Main.Score)
	}
	// подкатегория 4 должна свернуться в корень 1, а не остаться отдельной
	for _, s := range got.AllScores {
		if s.CategoryID == 4 {
			t.Fatalf("подкатегория 4 не свернута до корневой категории")
		}
	}
	if got.Main.Breakdown[EventViewAd] != 1 || got.Main.Breakdown[EventAddToFavorites] != 3 ||
		got.Main.Breakdown[EventStartContact] != 5 {
		t.Fatalf("неверная разбивка по действиям: %+v", got.Main.Breakdown)
	}
}

func TestDetermineMainCategory_TieBreakSmallestCategoryID(t *testing.T) {
	b := &eventBuilder{}
	listingTransport := intPtr(1)
	listingRealty := intPtr(2)

	// одинаковые баллы у Транспорта (id=1) и Недвижимости (id=2)
	events := []Event{
		b.make(listingTransport, EventAddToFavorites, 1),
		b.make(listingRealty, EventAddToFavorites, 1),
	}
	listingToCategory := map[int]int{1: 4, 2: 5}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	if got.Main.CategoryID != 1 {
		t.Fatalf("при равенстве баллов ожидали наименьший id=1, получили id=%d", got.Main.CategoryID)
	}
}

func TestDetermineMainCategory_MostActiveMonth(t *testing.T) {
	b := &eventBuilder{}
	listing := intPtr(1)

	events := []Event{
		b.make(listing, EventViewAd, 1), // 2025-01
		b.make(listing, EventViewAd, 4), // 2025-04
		b.make(listing, EventViewAd, 4), // 2025-04
		b.make(listing, EventViewAd, 4), // 2025-04
	}
	listingToCategory := map[int]int{1: 4}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	if got.MostActiveMonth != "2025-04" {
		t.Fatalf("ожидали самый активный месяц 2025-04, получили %q", got.MostActiveMonth)
	}
}

func TestDetermineMainCategory_ExplanationNotEmpty(t *testing.T) {
	b := &eventBuilder{}
	listing := intPtr(1)

	events := []Event{b.make(listing, EventAddToFavorites, 1)}
	got := DetermineMainCategory(events, map[int]int{1: 4}, testCategories(), nil)

	if strings.TrimSpace(got.Explanation) == "" {
		t.Fatal("объяснение расчета не должно быть пустым")
	}
	if strings.Contains(got.Explanation, "Главная категория") {
		t.Fatalf("объяснение не должно дублировать description карточки, получили: %q", got.Explanation)
	}
}

func TestDetermineMainCategory_ExplanationOnlyAboutCategory(t *testing.T) {
	b := &eventBuilder{}
	listingTransport := intPtr(1)
	listingRealty := intPtr(2)

	events := []Event{
		b.make(listingTransport, EventDealComplete, 1),
		b.make(listingTransport, EventAddToFavorites, 1),
		b.make(listingRealty, EventAddToFavorites, 1),
	}
	got := DetermineMainCategory(events, map[int]int{1: 4, 2: 5}, testCategories(), nil)

	if strings.Contains(got.Explanation, "Самый активный месяц") {
		t.Fatalf("объяснение главной категории не должно содержать активный месяц: %q", got.Explanation)
	}
	if strings.Contains(got.Explanation, "deal_completed") || strings.Contains(got.Explanation, "favorite_added") {
		t.Fatalf("объяснение главной категории не должно содержать разбивку по событиям: %q", got.Explanation)
	}
	if strings.Contains(got.Explanation, "Главная категория") || strings.Contains(got.Explanation, "  - «Транспорт»") {
		t.Fatalf("объяснение не должно дублировать главную категорию: %q", got.Explanation)
	}
	if !strings.Contains(got.Explanation, "  - «Недвижимость»: 3 балла") {
		t.Fatalf("другие категории должны оставаться в explanation: %q", got.Explanation)
	}
}

func TestScoreWord(t *testing.T) {
	tests := []struct {
		score int
		want  string
	}{
		{1, "балл"},
		{2, "балла"},
		{4, "балла"},
		{5, "баллов"},
		{11, "баллов"},
		{14, "баллов"},
		{21, "балл"},
		{22, "балла"},
		{25, "баллов"},
	}

	for _, tt := range tests {
		if got := scoreWord(tt.score); got != tt.want {
			t.Fatalf("scoreWord(%d) = %q, want %q", tt.score, got, tt.want)
		}
	}
}

func TestDetermineMainCategory_SellerActionsCount(t *testing.T) {
	b := &eventBuilder{}
	listingRealty := intPtr(5)    // категория 5 -> корень 2 (Недвижимость)
	listingTransport := intPtr(1) // категория 4 -> корень 1 (Транспорт)

	// пользователь-продавец: полный цикл в Недвижимости и одна публикация в Транспорте
	events := []Event{
		b.make(listingRealty, EventCreateAd, 2),       // +3 Недвижимость (listing_published)
		b.make(listingRealty, EventCloseAd, 5),        // +2 Недвижимость (listing_closed)
		b.make(listingRealty, EventDealComplete, 5),   // +8 Недвижимость (deal_completed)
		b.make(listingTransport, EventCreateAd, 1),    // +3 Транспорт
		b.make(listingTransport, EventDraftCreate, 1), // +1 Транспорт (draft_created)
	}
	listingToCategory := map[int]int{5: 5, 1: 4}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	if got.Main.CategoryID != 2 || got.Main.Score != 13 {
		t.Fatalf("ожидали Недвижимость (id=2) с 13 баллами, получили id=%d score=%d",
			got.Main.CategoryID, got.Main.Score)
	}
	if got.Main.Breakdown[EventCreateAd] != 3 || got.Main.Breakdown[EventCloseAd] != 2 ||
		got.Main.Breakdown[EventDealComplete] != 8 {
		t.Fatalf("неверная разбивка продавца: %+v", got.Main.Breakdown)
	}
}

func TestDetermineMainCategory_MostActiveMonthCountsAllEvents(t *testing.T) {
	b := &eventBuilder{}
	listing := intPtr(1)

	// в январе много событий без listing_id, в апреле — одно с категорией
	events := []Event{
		b.make(nil, "search_saved", 1),          // 2025-01, не влияет на категорию
		b.make(nil, "return_after_break", 1),    // 2025-01, не влияет на категорию
		b.make(nil, "category_viewed", 1),       // 2025-01, не влияет на категорию
		b.make(listing, EventAddToFavorites, 4), // 2025-04, влияет на категорию
	}
	listingToCategory := map[int]int{1: 4}

	got := DetermineMainCategory(events, listingToCategory, testCategories(), nil)

	// активный месяц считается по всем событиям, поэтому побеждает 2025-01 (3 события)
	if got.MostActiveMonth != "2025-01" {
		t.Fatalf("активный месяц должен считаться по всем событиям (ожидали 2025-01), получили %q",
			got.MostActiveMonth)
	}
}

func TestDetermineMainCategory_IgnoresEventsWithoutListing(t *testing.T) {
	b := &eventBuilder{}

	// события без объявления нельзя отнести к категории
	events := []Event{
		b.make(nil, EventAddToFavorites, 1),
		b.make(nil, EventStartContact, 2),
	}

	got := DetermineMainCategory(events, map[int]int{}, testCategories(), nil)

	if len(got.AllScores) != 0 {
		t.Fatalf("события без listing_id не должны давать баллов, получили %d категорий", len(got.AllScores))
	}
	if got.Main.CategoryID != 0 || got.Main.Score != 0 {
		t.Fatalf("ожидали пустую главную категорию, получили id=%d score=%d",
			got.Main.CategoryID, got.Main.Score)
	}
}
