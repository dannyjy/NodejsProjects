CREATE DATABASE taskmanagerdb;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    taskid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    title VARCHAR(150),
    description VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'general',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);