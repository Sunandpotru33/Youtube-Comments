export type Comment = {
  comment_id: string;
  parent_id: string | null;
  thread_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  created_at: Date;
  replies?: Comment[];
};

export type SortType = 'newest' | 'upvotes' | null;