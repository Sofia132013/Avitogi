package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"avitogi/backend/internal/recap"
)

func metricsHandler(w http.ResponseWriter, r *http.Request) {
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

	// пока используем mock-события, а позже здесь можно будет подключить базу данных
	metrics := recap.CalculateMetrics(recap.MockEvents(), userID)
	writeJSON(w, http.StatusOK, metrics)
}

func profilesHandler(w http.ResponseWriter, r *http.Request) {
	// возвращаем все тестовые профили для выбора пользователя
	writeJSON(w, http.StatusOK, recap.MockProfiles())
}

func profileByIDHandler(w http.ResponseWriter, r *http.Request) {
	// берем id профиля из пути /profiles/{id}
	profileID, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "profile id must be an integer"})
		return
	}

	profile, ok := recap.FindProfile(profileID)
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "profile not found"})
		return
	}

	writeJSON(w, http.StatusOK, profile)
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	// общий helper для JSON ответов
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, `{"error":"failed to encode response"}`, http.StatusInternalServerError)
	}
}
