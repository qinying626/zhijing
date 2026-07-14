import express from 'express';
import { createServer } from 'http';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { BattleRoom } from './rooms/BattleRoom';
import zoneRoutes from './routes/zone';

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const transport = new WebSocketTransport({
  server: httpServer,
});

const gameServer = new Server({
  transport,
});

gameServer.define('battle', BattleRoom);

app.use('/zones', zoneRoutes);

const PORT = process.env.PORT || 3003;

httpServer.listen(Number(PORT), () => {
  console.log(`Game service running on port ${PORT}`);
});

export { app, httpServer, gameServer };
