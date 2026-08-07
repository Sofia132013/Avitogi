-- добавляем тестовые профили пользователей
-- id фиксированные, чтобы при повторном запуске не создавались дубли
-- сценарий профиля указан в комментарии, а name хранит имя пользователя
-- для on conflict нужен primary key или unique по users.id

INSERT INTO users (id, name, avatar_url, registered_at, rating)
VALUES
	-- активный покупатель
	(1, 'Максим', NULL, '2024-01-12 10:00:00', 16),
	-- активный продавец
	(2, 'Анна', NULL, '2023-11-04 15:30:00', 4),
	-- исследователь
	(3, 'Мират', NULL, '2022-06-18 09:15:00', 88),
	-- пользователь с незавершенным поиском
	(4, 'Арина', NULL, '2024-03-22 12:45:00', 72),
	-- смешанный покупатель-продавец
	(5, 'Тимур', NULL, '2021-09-09 18:20:00', 21),
	-- малоактивный пользователь
	(6, 'Софья', NULL, '2025-01-30 08:10:00', 95)
ON CONFLICT (id) DO UPDATE SET
	name = EXCLUDED.name,
	avatar_url = EXCLUDED.avatar_url,
	registered_at = EXCLUDED.registered_at,
	rating = EXCLUDED.rating;

-- проверяем, что пользователи добавились
SELECT id, name, avatar_url, registered_at, rating
FROM users
ORDER BY id;
