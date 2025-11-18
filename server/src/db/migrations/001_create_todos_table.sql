-- Create todos table with proper constraints and indexes

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering by completion status
CREATE INDEX idx_todos_completed ON todos(completed);

-- Index for ordering by creation date (descending for newest first)
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
