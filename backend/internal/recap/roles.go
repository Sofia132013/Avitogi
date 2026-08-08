package recap

type Roles struct {
	Buyer         int `json:"buyer"`
	Seller        int `json:"seller"`
	Researcher    int `json:"researcher"`
	IdeaCollector int `json:"idea_collector"`
}

func CalculateRoles(events []Event, userID int) Roles {
	var buyer, seller, researcher, collector int
	seenEventIDs := make(map[string]struct{})
	for _, event := range events {
		if event.UserID != userID {
			continue
		}
		if event.EventID != "" {
			if _, exists := seenEventIDs[event.EventID]; exists {
				continue
			}
			seenEventIDs[event.EventID] = struct{}{}
		}
		switch event.Type {
		case EventStartContact:
			buyer++
		case EventCreateAd:
			seller++
		case EventViewAd, EventViewCategory:
			researcher++
		case EventAddToFavorites:
			collector++
		}
	}
	percents := toPercents([]int{buyer, seller, researcher, collector})
	return Roles{Buyer: percents[0], Seller: percents[1], Researcher: percents[2], IdeaCollector: percents[3]}
}

func toPercents(scores []int) []int {
	total := 0
	for _, score := range scores {
		total += score
	}
	percents := make([]int, len(scores))
	if total == 0 {
		return percents
	}
	remainders := make([]int, len(scores))
	assigned := 0
	for i, score := range scores {
		percents[i] = score * 100 / total
		remainders[i] = score * 100 % total
		assigned += percents[i]
	}
	for assigned < 100 {
		best := 0
		for i := range scores {
			if remainders[i] > remainders[best] {
				best = i
			}
		}
		percents[best]++
		remainders[best] = 0
		assigned++
	}
	return percents
}
