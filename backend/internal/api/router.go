package api

import (
	"net/http"
)

func NewRouter() *http.ServeMux {
	// создаем новый server mux для обработки HTTP запросов
	mux := http.NewServeMux()

	// регистрируем handler для каждого route
	mux.HandleFunc("GET /health", healthHandler)

	// возвращаем mux, чтобы использовать его в main 
	return mux
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	// возвращаем простой JSON, чтобы проверить, что backend работает
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}
