-- добавляем события для всех тестовых профилей
-- используем 2025 год, чтобы итоги считались за один период
-- listing_id может быть NULL для событий без конкретного объявления

INSERT INTO events (id, user_id, listing_id, event_type, event_date)
VALUES
	-- активный покупатель
	(1001, 1, 1, 'listing_viewed', '2025-01-10 10:00:00'),
	(1002, 1, 1, 'favorite_added', '2025-01-10 10:05:00'),
	(1003, 1, 1, 'seller_contact_started', '2025-01-11 12:00:00'),
	(1004, 1, 1, 'deal_completed', '2025-02-03 18:30:00'),
	(1005, 1, 2, 'listing_viewed', '2025-03-04 09:20:00'),
	(1006, 1, 2, 'listing_revisited', '2025-03-06 20:10:00'),
	(1007, 1, 3, 'listing_viewed', '2025-04-16 13:40:00'),
	(1008, 1, 3, 'favorite_added', '2025-04-16 13:45:00'),
	(1009, 1, 3, 'seller_contact_started', '2025-04-17 11:00:00'),
	(1010, 1, NULL, 'search_saved', '2025-05-01 08:00:00'),
	(1011, 1, 6, 'listing_viewed', '2025-07-09 17:25:00'),
	(1012, 1, NULL, 'return_after_break', '2025-10-20 19:10:00'),
	(1013, 1, NULL, 'category_viewed', '2025-10-20 19:15:00'),

	-- активный продавец
	(2001, 2, 1, 'listing_published', '2025-01-12 10:00:00'),
	(2002, 2, 1, 'seller_contact_started', '2025-01-14 12:10:00'),
	(2003, 2, 1, 'listing_closed', '2025-02-03 18:30:00'),
	(2004, 2, 1, 'deal_completed', '2025-02-03 18:40:00'),
	(2005, 2, 2, 'listing_published', '2025-03-05 11:20:00'),
	(2006, 2, 2, 'seller_contact_started', '2025-03-07 15:00:00'),
	(2007, 2, 3, 'listing_published', '2025-04-14 09:10:00'),
	(2008, 2, 3, 'listing_closed', '2025-05-02 16:45:00'),
	(2009, 2, 3, 'deal_completed', '2025-05-02 16:55:00'),
	(2010, 2, 4, 'draft_created', '2025-05-26 09:00:00'),
	(2011, 2, 4, 'listing_published', '2025-06-01 12:00:00'),
	(2012, 2, NULL, 'return_after_break', '2025-09-12 10:00:00'),
	(2013, 2, NULL, 'category_viewed', '2025-09-12 10:05:00'),

	-- исследователь
	(3001, 3, 1, 'listing_viewed', '2025-01-20 08:15:00'),
	(3002, 3, 2, 'listing_viewed', '2025-02-18 19:10:00'),
	(3003, 3, 3, 'listing_viewed', '2025-03-21 13:25:00'),
	(3004, 3, 4, 'listing_viewed', '2025-04-11 11:40:00'),
	(3005, 3, 5, 'listing_viewed', '2025-05-06 09:50:00'),
	(3006, 3, 6, 'listing_viewed', '2025-06-30 21:10:00'),
	(3007, 3, 11, 'listing_viewed', '2025-07-12 10:05:00'),
	(3008, 3, 11, 'listing_revisited', '2025-07-14 18:00:00'),
	(3009, 3, 12, 'listing_viewed', '2025-08-22 16:30:00'),
	(3010, 3, NULL, 'search_saved', '2025-09-02 08:45:00'),
	(3011, 3, 8, 'favorite_added', '2025-10-10 14:10:00'),
	(3012, 3, NULL, 'return_after_break', '2025-12-01 20:00:00'),
	(3013, 3, NULL, 'category_viewed', '2025-12-01 20:05:00'),

	-- пользователь с незавершенным поиском
	(4001, 4, 12, 'listing_viewed', '2025-08-04 10:00:00'),
	(4002, 4, 12, 'favorite_added', '2025-08-04 10:10:00'),
	(4003, 4, 12, 'listing_revisited', '2025-08-08 19:20:00'),
	(4004, 4, 6, 'listing_viewed', '2025-09-01 11:15:00'),
	(4005, 4, 6, 'favorite_added', '2025-09-01 11:20:00'),
	(4006, 4, 6, 'listing_revisited', '2025-09-06 17:45:00'),
	(4007, 4, NULL, 'search_saved', '2025-09-10 08:30:00'),
	(4008, 4, 10, 'listing_viewed', '2025-10-03 12:10:00'),
	(4009, 4, NULL, 'return_after_break', '2025-11-15 18:00:00'),
	(4010, 4, NULL, 'category_viewed', '2025-11-15 18:05:00'),

	-- смешанный покупатель-продавец
	(5001, 5, 5, 'listing_published', '2025-02-11 10:40:00'),
	(5002, 5, 5, 'seller_contact_started', '2025-02-15 13:10:00'),
	(5003, 5, 5, 'listing_closed', '2025-03-03 17:00:00'),
	(5004, 5, 5, 'deal_completed', '2025-03-03 17:20:00'),
	(5005, 5, 2, 'listing_viewed', '2025-04-18 09:15:00'),
	(5006, 5, 2, 'favorite_added', '2025-04-18 09:30:00'),
	(5007, 5, 2, 'seller_contact_started', '2025-04-19 16:00:00'),
	(5008, 5, 7, 'draft_created', '2025-05-01 12:00:00'),
	(5009, 5, 6, 'listing_published', '2025-07-08 13:30:00'),
	(5010, 5, 6, 'seller_contact_started', '2025-07-09 14:10:00'),
	(5011, 5, 9, 'listing_viewed', '2025-08-18 19:20:00'),
	(5012, 5, NULL, 'search_saved', '2025-09-05 08:15:00'),
	(5013, 5, NULL, 'category_viewed', '2025-09-05 08:20:00'),

	-- малоактивный пользователь
	(6001, 6, 8, 'listing_published', '2025-10-01 08:30:00'),
	(6002, 6, 2, 'listing_viewed', '2025-10-03 20:00:00'),
	(6003, 6, 2, 'favorite_added', '2025-10-03 20:05:00'),
	(6004, 6, NULL, 'return_after_break', '2025-12-20 12:00:00'),
	(6005, 6, NULL, 'category_viewed', '2025-12-20 12:05:00')
ON CONFLICT (id) DO UPDATE SET
	user_id = EXCLUDED.user_id,
	listing_id = EXCLUDED.listing_id,
	event_type = EXCLUDED.event_type,
	event_date = EXCLUDED.event_date;

-- проверяем события одного пользователя за год
SELECT id, user_id, listing_id, event_type, event_date
FROM events
WHERE user_id = 1
	AND event_date >= '2025-01-01'
	AND event_date < '2026-01-01'
ORDER BY event_date, id;

-- считаем количество событий по каждому типу
SELECT user_id, event_type, COUNT(*) AS events_count
FROM events
WHERE event_date >= '2025-01-01'
	AND event_date < '2026-01-01'
GROUP BY user_id, event_type
ORDER BY user_id, event_type;

-- проверяем, что у каждого пользователя есть события
SELECT user_id, COUNT(*) AS events_count
FROM events
WHERE event_date >= '2025-01-01'
	AND event_date < '2026-01-01'
GROUP BY user_id
ORDER BY user_id;
