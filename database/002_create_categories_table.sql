CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

INSERT INTO categories (id, name, parent_id) VALUES
    (1, 'Транспорт', NULL),
    (2, 'Недвижимость', NULL),
    (3, 'Работа', NULL),
    (4, 'Легковые автомобили', 1),
    (5, 'Квартиры', 2);
