CREATE TABLE listings (
    id INTEGER PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    published_at TIMESTAMP,
    closed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    CHECK (status IN ('draft', 'published', 'closed'))
);
