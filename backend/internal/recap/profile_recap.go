package recap

import (
	"database/sql"

	appinternal "avitogi/backend/internal"
)

type Explanation struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type NextAction struct {
	Type  string `json:"type"`
	Label string `json:"label"`
}

type ProfileRecap struct {
	ProfileID    int           `json:"profile_id"`
	Year         int           `json:"year"`
	Metrics      Metrics       `json:"metrics"`
	Roles        Roles         `json:"roles"`
	Cards        []Card        `json:"cards"`
	Explanations []Explanation `json:"explanations"`
	NextAction   NextAction    `json:"next_action"`
}

func BuildProfileRecap(db *sql.DB, userID int, year int) (ProfileRecap, error) {
	dbEvents, err := appinternal.GetEventsByUserAndYear(db, userID, year)
	if err != nil {
		return ProfileRecap{}, err
	}
	categories, err := appinternal.GetCategories(db)
	if err != nil {
		return ProfileRecap{}, err
	}
	listingToCategory, err := appinternal.GetListingCategoryMap(db)
	if err != nil {
		return ProfileRecap{}, err
	}
	events := EventsFromDB(dbEvents)
	metrics := CalculateMetrics(events, userID)
	roles := CalculateRoles(events, userID)
	mainCategory := DetermineMainCategory(events, listingToCategory, appinternal.CategoriesByID(categories), nil)
	cards := BuildCards(metrics, roles, mainCategory)
	explanations := []Explanation{}
	for _, card := range cards {
		if card.Explanation == "" {
			continue
		}
		explanations = append(explanations, Explanation{Type: card.Type, Text: card.Explanation})
	}
	return ProfileRecap{
		ProfileID:    userID,
		Year:         year,
		Metrics:      metrics,
		Roles:        roles,
		Cards:        cards,
		Explanations: explanations,
		NextAction:   NextAction{Type: "share_recap", Label: "Поделиться итогами года"},
	}, nil
}
