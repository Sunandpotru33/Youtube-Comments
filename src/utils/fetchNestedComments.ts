import { Comment, SortType } from "../types/comment";

export function buildNestedComments(comments: Comment[], sortBy: SortType = null): Comment[] {
  const map = new Map<string, any>();
  const roots: any[] = [];

  comments.forEach(comment => {
    map.set(comment.comment_id, { ...comment, replies: [] });
  });
  map.forEach(comment => {
    if (comment.parent_id) {
      const parent = map.get(comment.parent_id);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  if (sortBy === 'newest') {
    roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === 'upvotes') {
    roots.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
  }

  return roots;
}
