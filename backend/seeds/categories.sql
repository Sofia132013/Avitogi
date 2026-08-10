-- добавляем категории для тестовых данных
-- parent_id = NULL означает, что это основная категория
-- подкатегории ссылаются на id основной категории

INSERT INTO categories (id, name, parent_id)
VALUES
	(1, 'Транспорт', NULL),
	(2, 'Недвижимость', NULL),
	(3, 'Работа', NULL),
	(4, 'Легковые автомобили', 1),
	(5, 'Квартиры', 2)
ON CONFLICT (id) DO UPDATE SET
	name = EXCLUDED.name,
	parent_id = EXCLUDED.parent_id;

-- проверяем, что категории добавились
SELECT id, name, parent_id
FROM categories
ORDER BY id;
