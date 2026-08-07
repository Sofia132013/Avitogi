package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"avitogi/backend/internal/api"
	"avitogi/backend/internal/recap"
)

func TestProfilesEndpoint(t *testing.T) {
	// проверяем, что endpoint возвращает список тестовых профилей
	request := httptest.NewRequest(http.MethodGet, "/profiles", nil)
	response := httptest.NewRecorder()

	api.NewRouter().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	var profiles []recap.Profile
	if err := json.NewDecoder(response.Body).Decode(&profiles); err != nil {
		t.Fatalf("decode profiles: %v", err)
	}

	if len(profiles) != 6 {
		t.Fatalf("len(profiles) = %d, want %d", len(profiles), 6)
	}
}

func TestProfileByIDEndpoint(t *testing.T) {
	// проверяем, что endpoint возвращает профиль по id
	request := httptest.NewRequest(http.MethodGet, "/profiles/1", nil)
	response := httptest.NewRecorder()

	api.NewRouter().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	var profile recap.Profile
	if err := json.NewDecoder(response.Body).Decode(&profile); err != nil {
		t.Fatalf("decode profile: %v", err)
	}

	if profile.ID != 1 {
		t.Fatalf("profile.ID = %d, want %d", profile.ID, 1)
	}
}

func TestProfileByIDNotFound(t *testing.T) {
	// проверяем, что для неизвестного id возвращается 404
	request := httptest.NewRequest(http.MethodGet, "/profiles/999", nil)
	response := httptest.NewRecorder()

	api.NewRouter().ServeHTTP(response, request)

	if response.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusNotFound)
	}
}
