-- добавляем тестовые объявления
-- owner_id показывает владельца объявления
-- category_id связывает объявление с категорией
-- status может быть draft, published или closed

INSERT INTO listings (id, owner_id, category_id, title, status, published_at, closed_at)
VALUES
	(1, 2, 4, 'Kia Rio 2020', 'closed', '2025-01-12 10:00:00', '2025-02-03 18:30:00'),
	(2, 2, 4, 'Hyundai Solaris 2019', 'published', '2025-03-05 11:20:00', NULL),
	(3, 2, 5, 'Студия у метро', 'closed', '2025-04-14 09:10:00', '2025-05-02 16:45:00'),
	(4, 2, 3, 'Курьер на вечер', 'published', '2025-06-01 12:00:00', NULL),
	(5, 5, 4, 'Volkswagen Polo', 'closed', '2025-02-11 10:40:00', '2025-03-03 17:00:00'),
	(6, 5, 5, 'Двухкомнатная квартира', 'published', '2025-07-08 13:30:00', NULL),
	(7, 5, 3, 'Подработка на выходные', 'draft', NULL, NULL),
	(8, 6, 1, 'Зимняя резина', 'published', '2025-10-01 08:30:00', NULL),
	(9, 1, 4, 'Toyota Camry', 'published', '2025-08-15 14:00:00', NULL),
	(10, 1, 5, 'Квартира на сутки', 'closed', '2025-09-02 12:15:00', '2025-09-20 19:00:00'),
	(11, 3, 3, 'Junior backend developer', 'published', '2025-05-22 15:10:00', NULL),
	(12, 4, 2, 'Апартаменты в центре', 'published', '2025-11-05 10:10:00', NULL)
ON CONFLICT (id) DO UPDATE SET
	owner_id = EXCLUDED.owner_id,
	category_id = EXCLUDED.category_id,
	title = EXCLUDED.title,
	status = EXCLUDED.status,
	published_at = EXCLUDED.published_at,
	closed_at = EXCLUDED.closed_at;

-- проверяем, что объявления добавились
SELECT id, owner_id, category_id, title, status
FROM listings
ORDER BY id;
