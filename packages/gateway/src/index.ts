import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());
app.use(express.json());

const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  subject: process.env.SUBJECT_SERVICE_URL || 'http://localhost:3002',
  game: process.env.GAME_SERVICE_URL || 'http://localhost:3003',
  social: process.env.SOCIAL_SERVICE_URL || 'http://localhost:3004',
  content: process.env.CONTENT_SERVICE_URL || 'http://localhost:3005',
};

for (const [name, target] of Object.entries(services)) {
  app.use(`/api/${name}`, createProxyMiddleware({ target, changeOrigin: true, pathRewrite: { [`^/api/${name}`]: '' } }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
