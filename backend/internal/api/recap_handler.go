package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"

	appinternal "avitogi/backend/internal"
	"avitogi/backend/internal/recap"
)

func profileRecapHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		profileID, err := strconv.Atoi(r.PathValue("profileId"))
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "profile id must be an integer"})
			return
		}
		year, err := strconv.Atoi(r.URL.Query().Get("year"))
		if err != nil || year < 2000 || year > 2100 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "year must be a valid year"})
			return
		}
		_, err = appinternal.GetProfileByID(db, profileID)
		if errors.Is(err, appinternal.ErrProfileNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "profile not found"})
			return
		}
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get profile"})
			return
		}
		result, err := recap.BuildProfileRecap(db, profileID, year)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to build recap"})
			return
		}
		writeJSON(w, http.StatusOK, result)
	}
}
