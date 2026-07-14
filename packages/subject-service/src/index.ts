import express from 'express';
import mongoose from 'mongoose';
import questionRoutes from './routes/question';
import answerRoutes from './routes/answer';

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zhijing-subject');

app.use('/questions', questionRoutes);
app.use('/answer', answerRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Subject service running on port ${PORT}`));
