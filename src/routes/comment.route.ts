import { Router } from 'express';
import {
  addCommentOrReply,
  upvoteComment,
  addSampleComments,
  deleteComment,
  getAllComments,
  getTopComments,
  getNewestComments
} from '../controllers/comment.controller';
import { get } from 'http';

const router = Router();

router.post('/comments', addCommentOrReply);
router.patch('/upvote/:id', upvoteComment);
router.get('/comments', getAllComments)
router.get('/top-comments', getTopComments);
router.get('/newest', getNewestComments);
router.post('/add-bulk', addSampleComments)
router.delete('/comments/:id', deleteComment)

export default router;