-- добавляем категории для тестовых данных
-- parent_id = 0 означает, что это основная категория
-- подкатегории ссылаются на id основной категории
-- для on conflict нужен primary key или unique по categories.id

INSERT INTO categories (id, name, parent_id)
VALUES
	(1, 'Электроника', 0),
	(2, 'Транспорт', 0),
	(3, 'Мебель', 0),
	(4, 'Спорт', 0),
	(5, 'Одежда', 0),
	(6, 'Товары для дома', 0),
	(7, 'Хобби', 0),
	(8, 'Телефоны', 1),
	(9, 'Ноутбуки', 1),
	(10, 'Велосипеды', 4),
	(11, 'Диваны', 3),
	(12, 'Автозапчасти', 2)
ON CONFLICT (id) DO UPDATE SET
	name = EXCLUDED.name,
	parent_id = EXCLUDED.parent_id;

-- проверяем, что категории добавились
SELECT id, name, parent_id
FROM categories
ORDER BY id;
