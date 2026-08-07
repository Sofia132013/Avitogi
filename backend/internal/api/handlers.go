package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	appinternal "avitogi/backend/internal"
	"avitogi/backend/internal/recap"
)

func metricsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// берем user_id из query параметра /metrics?user_id=1
		userIDParam := r.URL.Query().Get("user_id")
		if userIDParam == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "user_id is required"})
			return
		}

		userID, err := strconv.Atoi(userIDParam)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "user_id must be an integer"})
			return
		}

		events, err := appinternal.GetEventsByUserAndYear(db, userID, 2025)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get events"})
			return
		}

		metrics := recap.CalculateMetrics(recap.EventsFromAggregates(events), userID)
		writeJSON(w, http.StatusOK, metrics)
	}
}

func profilesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// возвращаем все тестовые профили для выбора пользователя
		profiles, err := appinternal.GetProfiles(db)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get profiles"})
			return
		}

		writeJSON(w, http.StatusOK, profiles)
	}
}

func profileByIDHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// берем id профиля из пути /profiles/{id}
		profileID, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "profile id must be an integer"})
			return
		}

		profile, err := appinternal.GetProfileByID(db, profileID)
		if errors.Is(err, appinternal.ErrProfileNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "profile not found"})
			return
		}
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get profile"})
			return
		}

		writeJSON(w, http.StatusOK, profile)
	}
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	// общий helper для JSON ответов
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, `{"error":"failed to encode response"}`, http.StatusInternalServerError)
	}
}
