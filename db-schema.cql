CREATE KEYSPACE IF NOT EXISTS youtube_comments
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1} AND durable_writes = true;

USE youtube_comments;

CREATE TABLE IF NOT EXISTS youtube_comments (
  thread_id UUID,
  comment_id UUID,
  parent_id UUID,
  user_id TEXT,
  content TEXT,
  upvotes INT,
  created_at TIMESTAMP,
  PRIMARY KEY (thread_id, created_at, comment_id)
) WITH CLUSTERING ORDER BY (created_at ASC);
