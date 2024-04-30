CREATE DATABASE taskdb

CREATE TABLE task(
    task_id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE image(
    image_id SERIAL PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    task_id INTEGER REFERENCES task(task_id) ON DELETE CASCADE
);