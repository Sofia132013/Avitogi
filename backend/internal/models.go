package internal

type User struct {
	ID     int
	Name   string
	Rating int
}

type Category struct {
	ID       int
	Name     string
	ParentID int
}

type Event struct {
	ID     int
	UserID int
	Year   int
	Type   string
	Amount int
}
