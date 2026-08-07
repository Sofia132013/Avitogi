-- добавляем события для всех тестовых профилей
-- используем один год, чтобы итоги считались одинаково
-- amount хранит количество действий по типу события
-- сейчас в event нет месяца и category_id, поэтому категории тут не привязаны
-- для on conflict нужен primary key или unique по events.id

INSERT INTO events (id, user_id, year, type, amount)
VALUES
	-- активный покупатель
	(1001, 1, 2025, 'active_day', 118),
	(1002, 1, 2025, 'category_viewed', 42),
	(1003, 1, 2025, 'listing_viewed', 430),
	(1004, 1, 2025, 'listing_revisited', 86),
	(1005, 1, 2025, 'favorite_added', 64),
	(1006, 1, 2025, 'search_saved', 11),
	(1007, 1, 2025, 'seller_contact_started', 37),
	(1008, 1, 2025, 'deal_completed', 9),
	(1009, 1, 2025, 'return_after_break', 2),

	-- активный продавец
	(2001, 2, 2025, 'active_day', 104),
	(2002, 2, 2025, 'category_viewed', 18),
	(2003, 2, 2025, 'listing_viewed', 95),
	(2004, 2, 2025, 'draft_created', 44),
	(2005, 2, 2025, 'listing_published', 36),
	(2006, 2, 2025, 'listing_closed', 29),
	(2007, 2, 2025, 'seller_contact_started', 58),
	(2008, 2, 2025, 'deal_completed', 24),
	(2009, 2, 2025, 'return_after_break', 1),

	-- исследователь
	(3001, 3, 2025, 'active_day', 142),
	(3002, 3, 2025, 'category_viewed', 96),
	(3003, 3, 2025, 'listing_viewed', 760),
	(3004, 3, 2025, 'listing_revisited', 210),
	(3005, 3, 2025, 'favorite_added', 23),
	(3006, 3, 2025, 'search_saved', 8),
	(3007, 3, 2025, 'seller_contact_started', 4),
	(3008, 3, 2025, 'deal_completed', 1),
	(3009, 3, 2025, 'return_after_break', 5),

	-- пользователь с незавершенным поиском
	(4001, 4, 2025, 'active_day', 61),
	(4002, 4, 2025, 'category_viewed', 34),
	(4003, 4, 2025, 'listing_viewed', 240),
	(4004, 4, 2025, 'listing_revisited', 128),
	(4005, 4, 2025, 'favorite_added', 41),
	(4006, 4, 2025, 'search_saved', 17),
	(4007, 4, 2025, 'seller_contact_started', 0),
	(4008, 4, 2025, 'deal_completed', 0),
	(4009, 4, 2025, 'return_after_break', 3),

	-- смешанный покупатель-продавец
	(5001, 5, 2025, 'active_day', 126),
	(5002, 5, 2025, 'category_viewed', 55),
	(5003, 5, 2025, 'listing_viewed', 310),
	(5004, 5, 2025, 'listing_revisited', 74),
	(5005, 5, 2025, 'favorite_added', 36),
	(5006, 5, 2025, 'search_saved', 9),
	(5007, 5, 2025, 'seller_contact_started', 33),
	(5008, 5, 2025, 'draft_created', 20),
	(5009, 5, 2025, 'listing_published', 15),
	(5010, 5, 2025, 'listing_closed', 12),
	(5011, 5, 2025, 'deal_completed', 11),
	(5012, 5, 2025, 'return_after_break', 2),

	-- малоактивный пользователь
	(6001, 6, 2025, 'active_day', 6),
	(6002, 6, 2025, 'category_viewed', 3),
	(6003, 6, 2025, 'listing_viewed', 14),
	(6004, 6, 2025, 'listing_revisited', 1),
	(6005, 6, 2025, 'favorite_added', 2),
	(6006, 6, 2025, 'seller_contact_started', 1),
	(6007, 6, 2025, 'deal_completed', 0)
ON CONFLICT (id) DO UPDATE SET
	user_id = EXCLUDED.user_id,
	year = EXCLUDED.year,
	type = EXCLUDED.type,
	amount = EXCLUDED.amount;

-- проверяем события одного пользователя за год
SELECT id, user_id, year, type, amount
FROM events
WHERE user_id = 1 AND year = 2025
ORDER BY id;

-- считаем сумму действий по каждому типу события
SELECT user_id, type, SUM(amount) AS total_amount
FROM events
WHERE year = 2025
GROUP BY user_id, type
ORDER BY user_id, type;

-- проверяем, что у каждого пользователя есть события
SELECT user_id, COUNT(*) AS events_count
FROM events
WHERE year = 2025
GROUP BY user_id
ORDER BY user_id;
