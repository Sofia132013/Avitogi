CREATE TABLE events (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    listing_id INTEGER,
    event_type VARCHAR(50) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

