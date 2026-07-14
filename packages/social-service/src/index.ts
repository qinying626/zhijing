import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import friendRoutes from './routes/friend';
import leaderboardRoutes from './routes/leaderboard';
import { getRedisClient } from './models/Leaderboard';

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zhijing-social');

// Initialize Redis connection
getRedisClient().catch(console.error);

io.on('connection', (socket) => {
  socket.on('join', (userId: string) => socket.join(userId));
  socket.on('private_message', (data: { to: string; from: string; message: string }) => {
    io.to(data.to).emit('private_message', data);
  });
});

app.use('/friend', friendRoutes);
app.use('/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => console.log(`Social service running on port ${PORT}`));
