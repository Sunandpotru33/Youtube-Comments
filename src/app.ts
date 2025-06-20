import express from 'express';
import commentRoutes from './routes/comment.route';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/comment', commentRoutes);

export default app;