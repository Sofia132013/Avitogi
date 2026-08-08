package tests

import (
	"reflect"
	"testing"

	"avitogi/backend/internal/recap"
)

func TestRolesEmpty(t *testing.T) {
	got := recap.CalculateRoles(nil, 1)
	want := recap.Roles{}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateRoles() = %+v, want %+v", got, want)
	}
}

func TestRolesAllRoles(t *testing.T) {
	events := []recap.Event{
		{UserID: 1, Type: recap.EventStartContact, Timestamp: testDate("2026-08-01"), EventID: "1"},
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "3"},
		{UserID: 1, Type: recap.EventViewCategory, Timestamp: testDate("2026-08-01"), EventID: "4"},
		{UserID: 1, Type: recap.EventAddToFavorites, Timestamp: testDate("2026-08-01"), EventID: "5"},
	}
	got := recap.CalculateRoles(events, 1)
	want := recap.Roles{Buyer: 20, Seller: 20, Researcher: 40, IdeaCollector: 20}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateRoles() = %+v, want %+v", got, want)
	}
}

func TestRolesRoundingSum100(t *testing.T) {
	events := []recap.Event{
		{UserID: 1, Type: recap.EventStartContact, Timestamp: testDate("2026-08-01"), EventID: "1"},
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "3"},
	}
	got := recap.CalculateRoles(events, 1)
	want := recap.Roles{Buyer: 34, Seller: 33, Researcher: 33, IdeaCollector: 0}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateRoles() = %+v, want %+v", got, want)
	}
	sum := got.Buyer + got.Seller + got.Researcher + got.IdeaCollector
	if sum != 100 {
		t.Fatalf("сумма процентов = %d, ожидалось 100", sum)
	}
}

func TestRolesUserFilter(t *testing.T) {
	events := []recap.Event{
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-01"), EventID: "1"},
		{UserID: 2, Type: recap.EventViewAd, Timestamp: testDate("2026-08-01"), EventID: "2"},
	}
	got := recap.CalculateRoles(events, 1)
	want := recap.Roles{Seller: 100}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateRoles() = %+v, want %+v", got, want)
	}
}

func TestRolesDuplicates(t *testing.T) {
	events := []recap.Event{
		{UserID: 1, Type: recap.EventCreateAd, Timestamp: testDate("2026-08-01"), EventID: "dup"},
		{UserID: 1, Type: recap.EventViewAd, Timestamp: testDate("2026-08-02"), EventID: "dup"},
	}
	got := recap.CalculateRoles(events, 1)
	want := recap.Roles{Seller: 100}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("CalculateRoles() = %+v, want %+v", got, want)
	}
}
