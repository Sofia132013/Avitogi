package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"

	"avitogi/backend/internal"
	"avitogi/backend/internal/api"
)

func main() {
	// загружаем настройки приложения из переменных окружения
	config := internal.LoadConfig()

	if config.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	// открываем подключение к PostgreSQL
	db, err := sql.Open("postgres", config.DatabaseURL)
	if err != nil {
		log.Fatal("Error opening database:", err)
	}
	defer db.Close()

	// проверяем, что база данных доступна
	err = db.Ping()
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	log.Println("Database connection is OK")

	mux := api.NewRouter()

	log.Println("Server is running on http://localhost:" + config.Port)

	// запускаем HTTP-сервер и передаем в него роутер с CORS
	err = http.ListenAndServe(":"+config.Port, enableCORS(mux))
	if err != nil {
		log.Fatal("Error starting server:", err)
	}

}

// функция для включения CORS, чтобы frontend мог отправлять запросы к этому API
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// разрешаем запросы с любого origin
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// говорим браузеру, какие HTTP методы разрешены
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// говорим браузеру, какие Headers можно отправлять
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// если браузер отправил OPTIONS-запрос, сразу возвращаем успешный ответ
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// каждый запрос сначала проходит через CORS, а потом идет в роутер
		next.ServeHTTP(w, r)
	})
}
