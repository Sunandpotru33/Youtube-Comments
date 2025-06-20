import { Request, Response } from 'express';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import { scyllaClient } from '../database/connection';
import { buildNestedComments } from '../utils/fetchNestedComments';
import { Comment } from '../types/comment';

export const addCommentOrReply = async (req: Request, res: Response) => {
  const { user_id, content, parent_id, thread_id } = req.body;
  const comment_id = uuidv4();
  const created_at = new Date();

  const root_thread_id = thread_id || comment_id;

  try {
    await scyllaClient.execute(
      `INSERT INTO comments (thread_id, comment_id, parent_id, user_id, content, upvotes, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
      [root_thread_id, comment_id, parent_id || null, user_id, content, created_at]
    );

    res.status(201).json({ message: 'Comment added', comment_id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const upvoteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await scyllaClient.execute(
      `SELECT thread_id, created_at, upvotes FROM comments WHERE comment_id = ? ALLOW FILTERING`,
      [id]
    );

    if (result.rowLength === 0) {
      res.status(404).json({ error: 'Comment not found' });
    }

    const { thread_id, created_at, upvotes } = result.rows[0];
    const newUpvotes = (upvotes ?? 0) + 1;

    await scyllaClient.execute(
      `UPDATE comments SET upvotes = ${newUpvotes} WHERE thread_id = ? AND created_at = ? AND comment_id = ?`,
      [thread_id, created_at, id]
    );

    res.json({ message: 'Upvoted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upvote' });
  }
};

export const getAllComments = async (_: Request, res: Response) => {
  try {
    const result = await scyllaClient.execute(`SELECT * FROM comments`);
    const comments: Comment[] = result.rows.map(row => ({
      comment_id: row['comment_id'].toString(),
      parent_id: row['parent_id'] ? row['parent_id'].toString() : null,
      thread_id: row['thread_id'].toString(),
      user_id: row['user_id'],
      content: row['content'],
      upvotes: Number(row['upvotes']),
      created_at: row['created_at'],
    }));
    const nested = buildNestedComments(comments);
    res.json(nested);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const getNewestComments = async (_: Request, res: Response) => {
  try {
    const result = await scyllaClient.execute(`SELECT * FROM comments`);
    const comments: Comment[] = result.rows.map(row => ({
      comment_id: row['comment_id'].toString(),
      parent_id: row['parent_id'] ? row['parent_id'].toString() : null,
      thread_id: row['thread_id'].toString(),
      user_id: row['user_id'],
      content: row['content'],
      upvotes: Number(row['upvotes']),
      created_at: row['created_at'],
    }));
    const nested = buildNestedComments(comments, 'newest');
    res.json(nested);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch newest comments' });
  }
};

export const getTopComments = async (_: Request, res: Response) => {
  try {
    const result = await scyllaClient.execute(`SELECT * FROM comments`);
    const comments: Comment[] = result.rows.map(row => ({
      comment_id: row['comment_id'].toString(),
      parent_id: row['parent_id'] ? row['parent_id'].toString() : null,
      thread_id: row['thread_id'].toString(),
      user_id: row['user_id'],
      content: row['content'],
      upvotes: Number(row['upvotes']),
      created_at: row['created_at'],
    }));
    const nested = buildNestedComments(comments, 'upvotes');
    res.json(nested);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top comments' });
  }
};

export const addSampleComments = async (req: Request, res: Response) => {
  const comments = req.body;

  if (!Array.isArray(comments)) {
    res.status(400).json({ error: 'Expected an array of comments' });
  }

  try {
    for (const comment of comments) {
      const commentId = validateUuid(comment.comment_id) ? comment.comment_id : uuidv4();
      const threadId = validateUuid(comment.thread_id) ? comment.thread_id : uuidv4();
      const parentId = comment.parent_id && validateUuid(comment.parent_id)
        ? comment.parent_id
        : null;

      const upvotes = comment.upvotes;
      const createdAt = new Date(comment.created_at);

      await scyllaClient.execute(
        `INSERT INTO comments (
          comment_id, thread_id, parent_id, user_id, content, upvotes, created_at
        ) VALUES (?, ?, ?, ?, ?, ${upvotes}, ?)`,
        [commentId, threadId, parentId, comment.user_id, comment.content, createdAt]
      );
    }

    res.status(201).json({ message: 'Sample comments added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert sample comments' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await scyllaClient.execute(
      `SELECT thread_id, created_at FROM comments WHERE comment_id = ? ALLOW FILTERING`,
      [id]
    );
    if (result.rowLength === 0) {
      res.status(404).json({ error: 'Comment not found' });
    }

    const { thread_id, created_at } = result.rows[0];

    await scyllaClient.execute(
      `DELETE FROM comments WHERE thread_id = ? AND created_at = ? AND comment_id = ?`,
      [thread_id, created_at, id]
    );
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}