package internal

import "time"

type User struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	AvatarURL    *string   `json:"avatar_url"`
	RegisteredAt time.Time `json:"registered_at"`
	Rating       int       `json:"rating"`
	CreatedAt    time.Time `json:"created_at"`
}

type Category struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	ParentID  *int      `json:"parent_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Event struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	ListingID *int      `json:"listing_id"`
	Type      string    `json:"event_type"`
	Timestamp time.Time `json:"event_date"`
	CreatedAt time.Time `json:"created_at"`
}
