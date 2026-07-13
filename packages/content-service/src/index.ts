import express from 'express';
import mongoose from 'mongoose';
import knowledgeRoutes from './routes/knowledge';
import examRoutes from './routes/exam';
import importRoutes from './routes/import';

const app = express();
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zhijing-content');

app.use('/knowledge', knowledgeRoutes);
app.use('/exam', examRoutes);
app.use('/import', importRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Content service running on port ${PORT}`));
