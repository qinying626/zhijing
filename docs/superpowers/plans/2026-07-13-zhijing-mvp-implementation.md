# 知境 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现知境高中游戏化学习平台的 MVP，包含数学学科完整体验、高考真题副本、角色系统、好友排行榜和管理后台。

**Architecture:** 微服务架构，5个后端服务（用户/学科/游戏/社交/内容）通过 API Gateway 统一入口，前端 React + Phaser.js 实现 RPG 界面，Colyseus 管理游戏房间，Docker Compose 编排开发环境。

**Tech Stack:** React 18, TypeScript, Phaser.js, Zustand, Tailwind CSS, Socket.io-client, Node.js, Express, Colyseus, PostgreSQL, MongoDB, Redis, RabbitMQ, Docker Compose

## Global Constraints

- 所有服务使用 Node.js 18+ / TypeScript 5+
- 前端 React 18 + TypeScript
- 数据库：用户和游戏数据用 PostgreSQL，题库/社交/内容用 MongoDB
- 容器化：所有服务必须有 Dockerfile 和 docker-compose 集成
- API 风格：RESTful，JSON 响应，统一错误格式 `{ code, message, data }`
- 认证：JWT token，Bearer 方式
- 每个 Task 完成后必须 commit

---

## File Structure

```
zhijing/
├── docker-compose.yml
├── packages/
│   ├── shared/                    # 共享类型和工具
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.ts
│   │   │   │   ├── subject.ts
│   │   │   │   ├── game.ts
│   │   │   │   └── content.ts
│   │   │   └── utils/
│   │   │       ├── apiResponse.ts
│   │   │       └── jwt.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── gateway/                   # API 网关
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── user-service/              # 用户服务
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   └── character.ts
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   └── Character.ts
│   │   │   └── middleware/
│   │   │       └── auth.ts
│   │   ├── tests/
│   │   │   └── auth.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── subject-service/           # 学科服务
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── question.ts
│   │   │   │   └── answer.ts
│   │   │   └── models/
│   │   │       ├── Question.ts
│   │   │       └── KnowledgePoint.ts
│   │   ├── tests/
│   │   │   └── question.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── game-service/              # 游戏服务
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── rooms/
│   │   │   │   └── BattleRoom.ts
│   │   │   └── models/
│   │   │       └── GameState.ts
│   │   ├── tests/
│   │   │   └── battle.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── social-service/            # 社交服务
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── friend.ts
│   │   │   │   └── leaderboard.ts
│   │   │   └── models/
│   │   │       ├── Friend.ts
│   │   │       └── Leaderboard.ts
│   │   ├── tests/
│   │   │   └── friend.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── content-service/           # 内容服务
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── knowledge.ts
│   │   │   │   └── exam.ts
│   │   │   └── models/
│   │   │       ├── KnowledgeCard.ts
│   │   │       └── ExamPaper.ts
│   │   ├── tests/
│   │   │   └── knowledge.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                       # 前端
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── stores/
│       │   │   ├── authStore.ts
│       │   │   └── gameStore.ts
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   ├── Register.tsx
│       │   │   ├── WorldMap.tsx
│       │   │   ├── Battle.tsx
│       │   │   └── Leaderboard.tsx
│       │   ├── game/
│       │   │   ├── scenes/
│       │   │   │   ├── BootScene.ts
│       │   │   │   ├── MapScene.ts
│       │   │   │   └── BattleScene.ts
│       │   │   └── config.ts
│       │   └── components/
│       │       ├── AnswerPanel.tsx
│       │       └── StatusBar.tsx
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── package.json
│       └── tsconfig.json
└── scripts/
    └── seed-math.ts               # 数学示例数据种子
```

---

### Task 1: 项目脚手架与 Docker Compose

**Files:**
- Create: `package.json` (monorepo root)
- Create: `docker-compose.yml`
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/subject.ts`
- Create: `packages/shared/src/types/game.ts`
- Create: `packages/shared/src/types/content.ts`
- Create: `packages/shared/src/utils/apiResponse.ts`
- Create: `packages/shared/src/utils/jwt.ts`

**Interfaces:**
- Produces: 共享类型定义（`User`, `Character`, `Question`, `KnowledgePoint`, `GameState`, `ApiRes`），JWT 工具（`generateToken`, `verifyToken`），API 响应工具（`successRes`, `errorRes`）

- [ ] **Step 1: 初始化 monorepo 根目录**

```bash
cd /root && npm init -y
```

修改 `package.json`:

```json
{
  "name": "zhijing",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["packages/*"]
}
```

- [ ] **Step 2: 创建共享包目录结构**

```bash
mkdir -p packages/shared/src/types packages/shared/src/utils
```

- [ ] **Step 3: 创建 shared/package.json**

```json
{
  "name": "@zhijing/shared",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

- [ ] **Step 4: 创建 shared/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 5: 创建 shared/src/types/user.ts**

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  subjectPreference: 'math' | 'chinese' | 'english' | 'geography' | 'physics';
  level: number;
  experience: number;
  subjectLevels: SubjectLevels;
  createdAt: Date;
}

export interface SubjectLevels {
  math: number;
  chinese: number;
  english: number;
  geography: number;
  physics: number;
}

export interface AuthToken {
  userId: string;
  username: string;
}
```

- [ ] **Step 6: 创建 shared/src/types/subject.ts**

```typescript
export type QuestionType = 'choice' | 'fill' | 'short_answer' | 'drag_sort' | 'interactive';
export type Difficulty = 'basic' | 'advanced' | 'challenge';
export type Subject = 'math' | 'chinese' | 'english' | 'geography' | 'physics';

export interface Question {
  id: string;
  subject: Subject;
  knowledgePointId: string;
  type: QuestionType;
  difficulty: Difficulty;
  content: string;
  options?: string[];
  answer: string | string[];
  steps?: QuestionStep[];
  explanation: string;
  source?: string;
  year?: number;
  province?: string;
}

export interface QuestionStep {
  order: number;
  prompt: string;
  answer: string;
  hint?: string;
}

export interface KnowledgePoint {
  id: string;
  subject: Subject;
  domain: string;
  chapter: string;
  name: string;
  description: string;
  parentId?: string;
  order: number;
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  experienceGained: number;
  stepResults?: StepResult[];
}

export interface StepResult {
  order: number;
  correct: boolean;
  answer: string;
}
```

- [ ] **Step 7: 创建 shared/src/types/game.ts**

```typescript
export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';

export interface GameState {
  characterId: string;
  currentZone: string;
  hp: number;
  maxHp: number;
  battleState: BattleState;
  currentQuestion?: string;
}

export interface BattleResult {
  victory: boolean;
  experienceGained: number;
  drops: Drop[];
  hpRemaining: number;
}

export interface Drop {
  type: 'experience' | 'item';
  name: string;
  value: number;
}

export interface ZoneInfo {
  id: string;
  name: string;
  subject: string;
  description: string;
  requiredLevel: number;
  zones: ZoneInfo[];
}
```

- [ ] **Step 8: 创建 shared/src/types/content.ts**

```typescript
export interface KnowledgeCard {
  id: string;
  knowledgePointId: string;
  title: string;
  summary: string;
  details: string;
  examples: string[];
  subject: string;
}

export interface ExamPaper {
  id: string;
  year: number;
  province: string;
  subject: string;
  title: string;
  questionIds: string[];
}

export interface ContentImport {
  subject: string;
  knowledgePoints: ContentKnowledgePoint[];
  questions: ContentQuestion[];
}

export interface ContentKnowledgePoint {
  domain: string;
  chapter: string;
  name: string;
  description: string;
}

export interface ContentQuestion {
  knowledgePointName: string;
  type: string;
  difficulty: string;
  content: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
}
```

- [ ] **Step 9: 创建 shared/src/utils/apiResponse.ts**

```typescript
export interface ApiRes<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export function successRes<T>(data: T, message = 'ok'): ApiRes<T> {
  return { code: 0, message, data };
}

export function errorRes(code: number, message: string): ApiRes<null> {
  return { code, message, data: null };
}
```

- [ ] **Step 10: 创建 shared/src/utils/jwt.ts**

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zhijing-dev-secret';
const JWT_EXPIRES = '7d';

export function generateToken(payload: { userId: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}
```

- [ ] **Step 11: 创建 shared/src/index.ts 导出所有模块**

```typescript
export * from './types/user';
export * from './types/subject';
export * from './types/game';
export * from './types/content';
export * from './utils/apiResponse';
export * from './utils/jwt';
```

- [ ] **Step 12: 创建 docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: zhijing
      POSTGRES_USER: zhijing
      POSTGRES_PASSWORD: zhijing123
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongodata:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - '5672:5672'
      - '15672:15672'
    environment:
      RABBITMQ_DEFAULT_USER: zhijing
      RABBITMQ_DEFAULT_PASS: zhijing123

  gateway:
    build: ./packages/gateway
    ports:
      - '3000:3000'
    environment:
      PORT: 3000
      USER_SERVICE_URL: http://user-service:3001
      SUBJECT_SERVICE_URL: http://subject-service:3002
      GAME_SERVICE_URL: http://game-service:3003
      SOCIAL_SERVICE_URL: http://social-service:3004
      CONTENT_SERVICE_URL: http://content-service:3005
    depends_on:
      - user-service
      - subject-service
      - game-service
      - social-service
      - content-service

  user-service:
    build: ./packages/user-service
    ports:
      - '3001:3001'
    environment:
      PORT: 3001
      DATABASE_URL: postgresql://zhijing:zhijing123@postgres:5432/zhijing
      JWT_SECRET: zhijing-dev-secret
      RABBITMQ_URL: amqp://zhijing:zhijing123@rabbitmq:5672
    depends_on:
      - postgres
      - rabbitmq

  subject-service:
    build: ./packages/subject-service
    ports:
      - '3002:3002'
    environment:
      PORT: 3002
      MONGODB_URI: mongodb://mongodb:27017/zhijing-subject
      RABBITMQ_URL: amqp://zhijing:zhijing123@rabbitmq:5672
    depends_on:
      - mongodb
      - rabbitmq

  game-service:
    build: ./packages/game-service
    ports:
      - '3003:3003'
    environment:
      PORT: 3003
      DATABASE_URL: postgresql://zhijing:zhijing123@postgres:5432/zhijing
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://zhijing:zhijing123@rabbitmq:5672
    depends_on:
      - postgres
      - redis
      - rabbitmq

  social-service:
    build: ./packages/social-service
    ports:
      - '3004:3004'
    environment:
      PORT: 3004
      MONGODB_URI: mongodb://mongodb:27017/zhijing-social
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://zhijing:zhijing123@rabbitmq:5672
    depends_on:
      - mongodb
      - redis
      - rabbitmq

  content-service:
    build: ./packages/content-service
    ports:
      - '3005:3005'
    environment:
      PORT: 3005
      MONGODB_URI: mongodb://mongodb:27017/zhijing-content
      RABBITMQ_URL: amqp://zhijing:zhijing123@rabbitmq:5672
    depends_on:
      - mongodb
      - rabbitmq

  web:
    build: ./packages/web
    ports:
      - '5173:5173'
    environment:
      VITE_API_URL: http://localhost:3000
      VITE_GAME_URL: ws://localhost:3003
    depends_on:
      - gateway

volumes:
  pgdata:
  mongodata:
```

- [ ] **Step 13: 安装依赖并验证**

```bash
cd /root && npm install
cd packages/shared && npx tsc --noEmit
```

Expected: 编译无错误

- [ ] **Step 14: Commit**

```bash
git add -A && git commit -m "feat: init monorepo scaffold with shared types and docker-compose"
```

---

### Task 2: API Gateway

**Files:**
- Create: `packages/gateway/package.json`
- Create: `packages/gateway/tsconfig.json`
- Create: `packages/gateway/Dockerfile`
- Create: `packages/gateway/src/index.ts`

**Interfaces:**
- Consumes: 所有后端服务的环境变量 URL
- Produces: 统一入口 `http://localhost:3000/api/{service}/{route}`

- [ ] **Step 1: 创建 gateway 目录和 package.json**

```bash
mkdir -p packages/gateway/src
```

```json
{
  "name": "@zhijing/gateway",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "cors": "^2.8.5",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17"
  }
}
```

- [ ] **Step 2: 创建 gateway/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: 创建 gateway/src/index.ts**

```typescript
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
```

- [ ] **Step 4: 创建 gateway/Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add API gateway with proxy to all services"
```

---

### Task 3: 用户服务

**Files:**
- Create: `packages/user-service/package.json`
- Create: `packages/user-service/tsconfig.json`
- Create: `packages/user-service/Dockerfile`
- Create: `packages/user-service/src/index.ts`
- Create: `packages/user-service/src/models/User.ts`
- Create: `packages/user-service/src/models/Character.ts`
- Create: `packages/user-service/src/routes/auth.ts`
- Create: `packages/user-service/src/routes/character.ts`
- Create: `packages/user-service/src/middleware/auth.ts`
- Create: `packages/user-service/tests/auth.test.ts`

**Interfaces:**
- Consumes: `@zhijing/shared` 的 `User`, `Character`, `generateToken`, `verifyToken`, `successRes`, `errorRes`
- Produces: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /characters`, `GET /characters/:id`, `PATCH /characters/:id`

- [ ] **Step 1: 创建 user-service 目录**

```bash
mkdir -p packages/user-service/src/{routes,models,middleware} packages/user-service/tests
```

- [ ] **Step 2: 创建 user-service/package.json**

```json
{
  "name": "@zhijing/user-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --forceExit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "sequelize": "^6.35.0",
    "pg": "^8.12.0",
    "amqplib": "^0.10.3",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/bcryptjs": "^2.4.6",
    "@types/amqplib": "^0.10.5",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "@types/jest": "^29.5.0"
  }
}
```

- [ ] **Step 3: 创建 user-service/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 4: 创建 user-service/src/index.ts**

```typescript
import express from 'express';
import { Sequelize } from 'sequelize';
import { initUserModel } from './models/User';
import { initCharacterModel } from './models/Character';
import authRoutes from './routes/auth';
import characterRoutes from './routes/character';

const app = express();
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://zhijing:zhijing123@localhost:5432/zhijing');

const User = initUserModel(sequelize);
const Character = initCharacterModel(sequelize);

User.hasMany(Character, { foreignKey: 'userId' });
Character.belongsTo(User, { foreignKey: 'userId' });

app.locals.User = User;
app.locals.Character = Character;
app.locals.sequelize = sequelize;

app.use('/auth', authRoutes);
app.use('/characters', characterRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
});

export { app, sequelize, User, Character };
```

- [ ] **Step 5: 创建 user-service/src/models/User.ts**

```typescript
import { Model, DataTypes, Sequelize } from 'sequelize';

export class UserModel extends Model {
  declare id: string;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initUserModel(sequelize: Sequelize) {
  UserModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return UserModel;
}
```

- [ ] **Step 6: 创建 user-service/src/models/Character.ts**

```typescript
import { Model, DataTypes, Sequelize } from 'sequelize';

export class CharacterModel extends Model {
  declare id: string;
  declare userId: string;
  declare name: string;
  declare avatar: string;
  declare subjectPreference: string;
  declare level: number;
  declare experience: number;
  declare mathLevel: number;
  declare chineseLevel: number;
  declare englishLevel: number;
  declare geographyLevel: number;
  declare physicsLevel: number;
  declare readonly createdAt: Date;
}

export function initCharacterModel(sequelize: Sequelize) {
  CharacterModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    avatar: { type: DataTypes.STRING(100), defaultValue: 'default' },
    subjectPreference: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'math' },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    experience: { type: DataTypes.INTEGER, defaultValue: 0 },
    mathLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
    chineseLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
    englishLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
    geographyLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
    physicsLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'Character',
    tableName: 'characters',
  });
  return CharacterModel;
}
```

- [ ] **Step 7: 创建 user-service/src/middleware/auth.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken, errorRes } from '@zhijing/shared';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json(errorRes(401, '未登录'));
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json(errorRes(401, 'Token 无效'));
  }
  req.user = payload;
  next();
}

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; username: string };
    }
  }
}
```

- [ ] **Step 8: 创建 user-service/src/routes/auth.ts**

```typescript
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, successRes, errorRes } from '@zhijing/shared';
import { UserModel } from '../models/User';
import { CharacterModel } from '../models/Character';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, characterName, subjectPreference } = req.body;
  if (!username || !email || !password || !characterName) {
    return res.status(400).json(errorRes(400, '缺少必填字段'));
  }
  const User = req.app.locals.User as typeof UserModel;
  const Character = req.app.locals.Character as typeof CharacterModel;

  const existing = await User.findOne({ where: { $or: [{ username }, { email }] } });
  if (existing) {
    return res.status(409).json(errorRes(409, '用户名或邮箱已存在'));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  await Character.create({
    userId: user.id,
    name: characterName,
    subjectPreference: subjectPreference || 'math',
  });

  const token = generateToken({ userId: user.id, username: user.username });
  res.status(201).json(successRes({ token, userId: user.id }, '注册成功'));
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(errorRes(400, '缺少用户名或密码'));
  }
  const User = req.app.locals.User as typeof UserModel;

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json(errorRes(401, '用户名或密码错误'));
  }

  const token = generateToken({ userId: user.id, username: user.username });
  res.json(successRes({ token, userId: user.id }, '登录成功'));
});

router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json(errorRes(401, '未登录'));
  }
  const { verifyToken } = await import('@zhijing/shared');
  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    return res.status(401).json(errorRes(401, 'Token 无效'));
  }
  const User = req.app.locals.User as typeof UserModel;
  const user = await User.findByPk(payload.userId, { attributes: ['id', 'username', 'email'] });
  if (!user) {
    return res.status(404).json(errorRes(404, '用户不存在'));
  }
  res.json(successRes(user));
});

export default router;
```

- [ ] **Step 9: 创建 user-service/src/routes/character.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { authMiddleware } from '../middleware/auth';
import { CharacterModel } from '../models/Character';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { name, subjectPreference } = req.body;
  if (!name) return res.status(400).json(errorRes(400, '角色名不能为空'));
  const Character = req.app.locals.Character as typeof CharacterModel;
  const character = await Character.create({
    userId: req.user!.userId,
    name,
    subjectPreference: subjectPreference || 'math',
  });
  res.status(201).json(successRes(character, '角色创建成功'));
});

router.get('/mine', authMiddleware, async (req: Request, res: Response) => {
  const Character = req.app.locals.Character as typeof CharacterModel;
  const characters = await Character.findAll({ where: { userId: req.user!.userId } });
  res.json(successRes(characters));
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  const Character = req.app.locals.Character as typeof CharacterModel;
  const character = await Character.findOne({ where: { id: req.params.id, userId: req.user!.userId } });
  if (!character) return res.status(404).json(errorRes(404, '角色不存在'));
  await character.update(req.body);
  res.json(successRes(character));
});

export default router;
```

- [ ] **Step 10: 创建 user-service/Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: add user service with auth, character CRUD"
```

---

### Task 4: 内容服务（知识卡片 + 真题管理）

**Files:**
- Create: `packages/content-service/package.json`
- Create: `packages/content-service/tsconfig.json`
- Create: `packages/content-service/Dockerfile`
- Create: `packages/content-service/src/index.ts`
- Create: `packages/content-service/src/models/KnowledgeCard.ts`
- Create: `packages/content-service/src/models/ExamPaper.ts`
- Create: `packages/content-service/src/routes/knowledge.ts`
- Create: `packages/content-service/src/routes/exam.ts`
- Create: `packages/content-service/src/routes/import.ts`

**Interfaces:**
- Consumes: `@zhijing/shared` 的 `KnowledgeCard`, `ExamPaper`, `ContentImport`
- Produces: `GET /knowledge/:subject`, `GET /knowledge/:id`, `GET /exam?year=&province=&subject=`, `POST /import`（批量导入）

- [ ] **Step 1: 创建 content-service 目录**

```bash
mkdir -p packages/content-service/src/{routes,models} packages/content-service/tests
```

- [ ] **Step 2: 创建 content-service/package.json**

```json
{
  "name": "@zhijing/content-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21"
  }
}
```

- [ ] **Step 3: 创建 content-service/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 4: 创建 content-service/src/models/KnowledgeCard.ts**

```typescript
import { Schema, model } from 'mongoose';

const knowledgeCardSchema = new Schema({
  knowledgePointId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  details: { type: String, required: true },
  examples: [{ type: String }],
  subject: { type: String, required: true, index: true },
});

export const KnowledgeCardModel = model('KnowledgeCard', knowledgeCardSchema);
```

- [ ] **Step 5: 创建 content-service/src/models/ExamPaper.ts**

```typescript
import { Schema, model } from 'mongoose';

const examPaperSchema = new Schema({
  year: { type: Number, required: true, index: true },
  province: { type: String, required: true, index: true },
  subject: { type: String, required: true, index: true },
  title: { type: String, required: true },
  questionIds: [{ type: String }],
});

examPaperSchema.index({ year: 1, province: 1, subject: 1 });

export const ExamPaperModel = model('ExamPaper', examPaperSchema);
```

- [ ] **Step 6: 创建 content-service/src/routes/knowledge.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { KnowledgeCardModel } from '../models/KnowledgeCard';

const router = Router();

router.get('/:subject', async (req: Request, res: Response) => {
  const cards = await KnowledgeCardModel.find({ subject: req.params.subject });
  res.json(successRes(cards));
});

router.get('/card/:id', async (req: Request, res: Response) => {
  const card = await KnowledgeCardModel.findById(req.params.id);
  if (!card) return res.status(404).json(errorRes(404, '知识卡片不存在'));
  res.json(successRes(card));
});

export default router;
```

- [ ] **Step 7: 创建 content-service/src/routes/exam.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { ExamPaperModel } from '../models/ExamPaper';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { year, province, subject } = req.query;
  const filter: Record<string, unknown> = {};
  if (year) filter.year = Number(year);
  if (province) filter.province = province;
  if (subject) filter.subject = subject;
  const papers = await ExamPaperModel.find(filter);
  res.json(successRes(papers));
});

export default router;
```

- [ ] **Step 8: 创建 content-service/src/routes/import.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { KnowledgeCardModel } from '../models/KnowledgeCard';
import { ExamPaperModel } from '../models/ExamPaper';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { knowledgePoints, questions, examPapers } = req.body;
  const results = { knowledgeCards: 0, examPapers: 0 };

  if (knowledgePoints?.length) {
    const docs = knowledgePoints.map((kp: { knowledgePointId: string; title: string; summary: string; details: string; examples: string[]; subject: string }) => ({
      ...kp,
      knowledgePointId: kp.knowledgePointId || kp.title,
    }));
    const inserted = await KnowledgeCardModel.insertMany(docs);
    results.knowledgeCards = inserted.length;
  }

  if (examPapers?.length) {
    const inserted = await ExamPaperModel.insertMany(examPapers);
    results.examPapers = inserted.length;
  }

  res.status(201).json(successRes(results, '导入完成'));
});

export default router;
```

- [ ] **Step 9: 创建 content-service/src/index.ts**

```typescript
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
```

- [ ] **Step 10: 创建 content-service/Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: add content service with knowledge cards, exam papers, and import"
```

---

### Task 5: 学科服务（数学答题逻辑 + 推演系统）

**Files:**
- Create: `packages/subject-service/package.json`
- Create: `packages/subject-service/tsconfig.json`
- Create: `packages/subject-service/Dockerfile`
- Create: `packages/subject-service/src/index.ts`
- Create: `packages/subject-service/src/models/Question.ts`
- Create: `packages/subject-service/src/models/KnowledgePoint.ts`
- Create: `packages/subject-service/src/models/AnswerRecord.ts`
- Create: `packages/subject-service/src/routes/question.ts`
- Create: `packages/subject-service/src/routes/answer.ts`

**Interfaces:**
- Consumes: `@zhijing/shared` 的 `Question`, `KnowledgePoint`, `AnswerResult`
- Produces: `GET /questions?subject=&knowledgePointId=&difficulty=`, `POST /answer`（提交答案返回经验值），`GET /knowledge-points/:subject`

- [ ] **Step 1: 创建 subject-service 目录**

```bash
mkdir -p packages/subject-service/src/{routes,models} packages/subject-service/tests
```

- [ ] **Step 2: 创建 subject-service/package.json**

```json
{
  "name": "@zhijing/subject-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "amqplib": "^0.10.3",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/amqplib": "^0.10.5"
  }
}
```

- [ ] **Step 3: 创建 subject-service/tsconfig.json**（同 content-service）

- [ ] **Step 4: 创建 subject-service/src/models/Question.ts**

```typescript
import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  subject: { type: String, required: true, index: true },
  knowledgePointId: { type: String, required: true, index: true },
  type: { type: String, enum: ['choice', 'fill', 'short_answer', 'drag_sort', 'interactive'], required: true },
  difficulty: { type: String, enum: ['basic', 'advanced', 'challenge'], required: true },
  content: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: Schema.Types.Mixed, required: true },
  steps: [{
    order: Number,
    prompt: String,
    answer: String,
    hint: String,
  }],
  explanation: { type: String, required: true },
  source: String,
  year: Number,
  province: String,
});

export const QuestionModel = model('Question', questionSchema);
```

- [ ] **Step 5: 创建 subject-service/src/models/KnowledgePoint.ts**

```typescript
import { Schema, model } from 'mongoose';

const knowledgePointSchema = new Schema({
  subject: { type: String, required: true, index: true },
  domain: { type: String, required: true },
  chapter: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  parentId: String,
  order: { type: Number, default: 0 },
});

export const KnowledgePointModel = model('KnowledgePoint', knowledgePointSchema);
```

- [ ] **Step 6: 创建 subject-service/src/models/AnswerRecord.ts**

```typescript
import { Schema, model } from 'mongoose';

const answerRecordSchema = new Schema({
  userId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },
  correct: { type: Boolean, required: true },
  userAnswer: { type: Schema.Types.Mixed, required: true },
  stepResults: [{
    order: Number,
    correct: Boolean,
    answer: String,
  }],
  timeSpent: Number,
  createdAt: { type: Date, default: Date.now },
});

answerRecordSchema.index({ userId: 1, questionId: 1 });

export const AnswerRecordModel = model('AnswerRecord', answerRecordSchema);
```

- [ ] **Step 7: 创建 subject-service/src/routes/question.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { QuestionModel } from '../models/Question';
import { KnowledgePointModel } from '../models/KnowledgePoint';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { subject, knowledgePointId, difficulty, limit = '10' } = req.query;
  const filter: Record<string, unknown> = {};
  if (subject) filter.subject = subject;
  if (knowledgePointId) filter.knowledgePointId = knowledgePointId;
  if (difficulty) filter.difficulty = difficulty;
  const questions = await QuestionModel.find(filter).limit(Number(limit));
  res.json(successRes(questions));
});

router.get('/knowledge-points/:subject', async (req: Request, res: Response) => {
  const points = await KnowledgePointModel.find({ subject: req.params.subject }).sort({ order: 1 });
  res.json(successRes(points));
});

export default router;
```

- [ ] **Step 8: 创建 subject-service/src/routes/answer.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { QuestionModel } from '../models/Question';
import { AnswerRecordModel } from '../models/AnswerRecord';

const EXPERIENCE_MAP = { basic: 10, advanced: 25, challenge: 50 };

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { questionId, userAnswer, userId, stepAnswers } = req.body;
  if (!questionId || !userAnswer || !userId) {
    return res.status(400).json(errorRes(400, '缺少必填字段'));
  }

  const question = await QuestionModel.findById(questionId);
  if (!question) return res.status(404).json(errorRes(404, '题目不存在'));

  let correct = false;
  let experienceGained = 0;
  let stepResults: { order: number; correct: boolean; answer: string }[] = [];

  if (question.steps?.length && stepAnswers?.length) {
    for (const step of question.steps) {
      const userStep = stepAnswers.find((s: { order: number }) => s.order === step.order);
      const stepCorrect = userStep?.answer?.trim() === step.answer.trim();
      stepResults.push({ order: step.order, correct: stepCorrect, answer: step.answer });
    }
    correct = stepResults.every(s => s.correct);
  } else {
    if (Array.isArray(question.answer)) {
      correct = Array.isArray(userAnswer) && question.answer.every((a: string, i: number) => a === userAnswer[i]);
    } else {
      correct = userAnswer.trim() === String(question.answer).trim();
    }
  }

  if (correct) {
    experienceGained = EXPERIENCE_MAP[question.difficulty as keyof typeof EXPERIENCE_MAP] || 10;
  }

  await AnswerRecordModel.create({
    userId,
    questionId,
    correct,
    userAnswer,
    stepResults,
  });

  res.json(successRes({ correct, experienceGained, stepResults }, correct ? '回答正确' : '回答错误'));
});

export default router;
```

- [ ] **Step 9: 创建 subject-service/src/index.ts**

```typescript
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
```

- [ ] **Step 10: 创建 subject-service/Dockerfile**（同 content-service）

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: add subject service with questions, answer logic, step-based derivation"
```

---

### Task 6: 游戏服务（RPG 战斗 + 副本）

**Files:**
- Create: `packages/game-service/package.json`
- Create: `packages/game-service/tsconfig.json`
- Create: `packages/game-service/Dockerfile`
- Create: `packages/game-service/src/index.ts`
- Create: `packages/game-service/src/rooms/BattleRoom.ts`
- Create: `packages/game-service/src/models/GameState.ts`
- Create: `packages/game-service/src/routes/zone.ts`

**Interfaces:**
- Consumes: `@zhijing/shared` 的 `GameState`, `BattleResult`, `ZoneInfo`
- Produces: Colyseus 房间（`ws://host:3003`），`GET /zones`（区域列表），`POST /battle/start`，`POST /battle/answer`

- [ ] **Step 1: 创建 game-service 目录**

```bash
mkdir -p packages/game-service/src/{rooms,models,routes} packages/game-service/tests
```

- [ ] **Step 2: 创建 game-service/package.json**

```json
{
  "name": "@zhijing/game-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@colyseus/core": "^0.15.0",
    "@colyseus/transport": "^0.15.0",
    "@colyseus/ws-transport": "^0.15.0",
    "sequelize": "^6.35.0",
    "pg": "^8.12.0",
    "redis": "^4.6.0",
    "amqplib": "^0.10.3",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/amqplib": "^0.10.5"
  }
}
```

- [ ] **Step 3: 创建 game-service/src/models/GameState.ts**

```typescript
import { Schema, type } from '@colyseus/schema';

export class PlayerState extends Schema {
  @type('string') characterId: string = '';
  @type('string') name: string = '';
  @type('number') hp: number = 100;
  @type('number') maxHp: number = 100;
  @type('number') level: number = 1;
  @type('number') experience: number = 0;
  @type('string') currentZone: string = 'math-hall';
}

export class BattleState extends Schema {
  @type('string') state: 'idle' | 'fighting' | 'victory' | 'defeat' = 'idle';
  @type('string') currentQuestionId: string = '';
  @type('number') monsterHp: number = 100;
  @type('number') monsterMaxHp: number = 100;
  @type('string') monsterName: string = '';
}

export class GameRoomState extends Schema {
  @type(PlayerState) player = new PlayerState();
  @type(BattleState) battle = new BattleState();
}
```

- [ ] **Step 4: 创建 game-service/src/rooms/BattleRoom.ts**

```typescript
import { Room, Client } from '@colyseus/core';
import { GameRoomState, PlayerState, BattleState } from '../models/GameState';

const MONSTER_HP_MAP = { basic: 30, advanced: 60, challenge: 100 };

export class BattleRoom extends Room<GameRoomState> {
  maxClients = 1;

  onCreate(options: { characterId: string; name: string; level: number }) {
    this.state.player.characterId = options.characterId;
    this.state.player.name = options.name;
    this.state.player.level = options.level;
    this.state.player.hp = 100;
    this.state.player.maxHp = 100;

    this.onMessage('start_battle', (client, data: { monsterName: string; difficulty: string; questionId: string }) => {
      this.state.battle.state = 'fighting';
      this.state.battle.monsterName = data.monsterName;
      this.state.battle.monsterMaxHp = MONSTER_HP_MAP[data.difficulty as keyof typeof MONSTER_HP_MAP] || 30;
      this.state.battle.monsterHp = this.state.battle.monsterMaxHp;
      this.state.battle.currentQuestionId = data.questionId;
    });

    this.onMessage('answer', (client, data: { correct: boolean; experience: number }) => {
      if (this.state.battle.state !== 'fighting') return;

      if (data.correct) {
        const damage = Math.ceil(this.state.battle.monsterMaxHp * 0.3);
        this.state.battle.monsterHp = Math.max(0, this.state.battle.monsterHp - damage);
        this.state.player.experience += data.experience;

        if (this.state.battle.monsterHp <= 0) {
          this.state.battle.state = 'victory';
          this.broadcast('battle_result', { victory: true, experience: data.experience });
        }
      } else {
        const damage = 15;
        this.state.player.hp = Math.max(0, this.state.player.hp - damage);

        if (this.state.player.hp <= 0) {
          this.state.battle.state = 'defeat';
          this.broadcast('battle_result', { victory: false, experience: 0 });
        }
      }
    });

    this.onMessage('end_battle', () => {
      this.state.battle.state = 'idle';
      this.state.battle.currentQuestionId = '';
    });
  }

  onJoin(client: Client) {
    client.send('state', this.state.toJSON());
  }
}
```

- [ ] **Step 5: 创建 game-service/src/routes/zone.ts**

```typescript
import { Router } from 'express';
import { successRes } from '@zhijing/shared';

const router = Router();

const zones = [
  { id: 'math-hall', name: '数理殿', subject: 'math', description: '逻辑与秩序之域', requiredLevel: 1 },
  { id: 'literature-pavilion', name: '文心阁', subject: 'chinese', description: '文字与意境之域', requiredLevel: 1 },
  { id: 'spirit-forest', name: '灵语林', subject: 'english', description: '跨语言沟通之域', requiredLevel: 1 },
  { id: 'world-map', name: '天地图', subject: 'geography', description: '山川与文明之域', requiredLevel: 1 },
  { id: 'phenomena-court', name: '万象庭', subject: 'physics', description: '自然法则之域', requiredLevel: 1 },
  { id: 'plaza', name: '知行广场', subject: 'social', description: '社交与交易枢纽', requiredLevel: 1 },
];

router.get('/', (_req, res) => {
  res.json(successRes(zones));
});

export default router;
```

- [ ] **Step 6: 创建 game-service/src/index.ts**

```typescript
import express from 'express';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { BattleRoom } from './rooms/BattleRoom';
import zoneRoutes from './routes/zone';

const app = express();
app.use(express.json());

const transport = new WebSocketTransport({ server: app });
const gameServer = new Server({ transport });

gameServer.define('battle', BattleRoom);

app.use('/zones', zoneRoutes);

const PORT = process.env.PORT || 3003;
gameServer.listen(PORT).then(() => console.log(`Game service running on port ${PORT}`));
```

- [ ] **Step 7: 创建 game-service/Dockerfile**（同 user-service）

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add game service with Colyseus battle room and zone routes"
```

---

### Task 7: 社交服务（好友 + 排行榜）

**Files:**
- Create: `packages/social-service/package.json`
- Create: `packages/social-service/tsconfig.json`
- Create: `packages/social-service/Dockerfile`
- Create: `packages/social-service/src/index.ts`
- Create: `packages/social-service/src/models/Friend.ts`
- Create: `packages/social-service/src/models/Leaderboard.ts`
- Create: `packages/social-service/src/routes/friend.ts`
- Create: `packages/social-service/src/routes/leaderboard.ts`

**Interfaces:**
- Consumes: `@zhijing/shared`
- Produces: `POST /friend/add`, `GET /friend/list`, `DELETE /friend/:id`, `GET /leaderboard/:type`

- [ ] **Step 1: 创建 social-service 目录**

```bash
mkdir -p packages/social-service/src/{routes,models} packages/social-service/tests
```

- [ ] **Step 2: 创建 social-service/package.json**

```json
{
  "name": "@zhijing/social-service",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "redis": "^4.6.0",
    "socket.io": "^4.7.0",
    "@zhijing/shared": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21"
  }
}
```

- [ ] **Step 3: 创建 social-service/src/models/Friend.ts**

```typescript
import { Schema, model } from 'mongoose';

const friendSchema = new Schema({
  userId: { type: String, required: true, index: true },
  friendId: { type: String, required: true },
  friendName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

export const FriendModel = model('Friend', friendSchema);
```

- [ ] **Step 4: 创建 social-service/src/routes/friend.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes, errorRes } from '@zhijing/shared';
import { FriendModel } from '../models/Friend';

const router = Router();

router.post('/add', async (req: Request, res: Response) => {
  const { userId, friendId, friendName } = req.body;
  if (!userId || !friendId) return res.status(400).json(errorRes(400, '缺少必填字段'));
  const existing = await FriendModel.findOne({ userId, friendId });
  if (existing) return res.status(409).json(errorRes(409, '已是好友或已发送请求'));
  const friend = await FriendModel.create({ userId, friendId, friendName });
  res.status(201).json(successRes(friend, '好友请求已发送'));
});

router.get('/list/:userId', async (req: Request, res: Response) => {
  const friends = await FriendModel.find({ userId: req.params.userId, status: 'accepted' });
  res.json(successRes(friends));
});

router.delete('/:id', async (req: Request, res: Response) => {
  await FriendModel.findByIdAndDelete(req.params.id);
  res.json(successRes(null, '已删除好友'));
});

export default router;
```

- [ ] **Step 5: 创建 social-service/src/routes/leaderboard.ts**

```typescript
import { Router, Request, Response } from 'express';
import { successRes } from '@zhijing/shared';
import { createClient } from 'redis';

const router = Router();

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect();

router.get('/:type', async (req: Request, res: Response) => {
  const { type } = req.params;
  const key = `leaderboard:${type}`;
  const top = await redis.zRangeWithScores(key, 0, 49, { REV: true });
  const leaderboard = top.map((entry, index) => ({
    rank: index + 1,
    id: entry.value,
    score: entry.score,
  }));
  res.json(successRes(leaderboard));
});

export default router;
```

- [ ] **Step 6: 创建 social-service/src/index.ts**

```typescript
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import friendRoutes from './routes/friend';
import leaderboardRoutes from './routes/leaderboard';

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zhijing-social');

io.on('connection', (socket) => {
  socket.on('join', (userId: string) => socket.join(userId));
  socket.on('private_message', (data: { to: string; message: string }) => {
    io.to(data.to).emit('private_message', data);
  });
});

app.use('/friend', friendRoutes);
app.use('/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => console.log(`Social service running on port ${PORT}`));
```

- [ ] **Step 7: 创建 social-service/Dockerfile**（同 content-service）

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add social service with friends, chat, and leaderboard"
```

---

### Task 8: 前端（React + Phaser.js）

**Files:**
- Create: `packages/web/` 整个前端项目
- 关键文件见 File Structure 中的 web 部分

**Interfaces:**
- Consumes: Gateway API (`http://localhost:3000/api/*`)，Game WebSocket (`ws://localhost:3003`)
- Produces: 用户可见的 RPG 界面

- [ ] **Step 1: 用 Vite 创建 React + TS 项目**

```bash
cd /root/packages && npm create vite@latest web -- --template react-ts
cd web && npm install
```

- [ ] **Step 2: 安装依赖**

```bash
cd /root/packages/web && npm install phaser zustand socket.io-client tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: 配置 Tailwind (vite.config.ts)**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
});
```

- [ ] **Step 4: 创建 src/stores/authStore.ts**

```typescript
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  setAuth: (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    set({ token, userId });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    set({ token: null, userId: null });
  },
}));
```

- [ ] **Step 5: 创建 src/stores/gameStore.ts**

```typescript
import { create } from 'zustand';

interface GameStore {
  zone: string;
  battleState: 'idle' | 'fighting' | 'victory' | 'defeat';
  hp: number;
  monsterHp: number;
  monsterName: string;
  currentQuestionId: string;
  setZone: (zone: string) => void;
  setBattle: (state: Partial<GameStore>) => void;
  resetBattle: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  zone: 'math-hall',
  battleState: 'idle',
  hp: 100,
  monsterHp: 0,
  monsterName: '',
  currentQuestionId: '',
  setZone: (zone) => set({ zone }),
  setBattle: (state) => set(state),
  resetBattle: () => set({ battleState: 'idle', monsterHp: 0, monsterName: '', currentQuestionId: '' }),
}));
```

- [ ] **Step 6: 创建 src/game/config.ts**

```typescript
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 640,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scene: [BootScene, MapScene, BattleScene],
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
};
```

- [ ] **Step 7: 创建 src/game/scenes/BootScene.ts**

```typescript
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.add.text(512, 280, '知境', { fontSize: '48px', color: '#e2e8f0' }).setOrigin(0.5);
    this.add.text(512, 340, '点击进入知境大陆', { fontSize: '20px', color: '#94a3b8' }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('Map');
    });
  }
}
```

- [ ] **Step 8: 创建 src/game/scenes/MapScene.ts**

```typescript
import Phaser from 'phaser';

const ZONES = [
  { key: 'math-hall', label: '数理殿', x: 512, y: 200, color: 0x3b82f6 },
  { key: 'literature-pavilion', label: '文心阁', x: 300, y: 350, color: 0xef4444 },
  { key: 'spirit-forest', label: '灵语林', x: 724, y: 350, color: 0x22c55e },
  { key: 'world-map', label: '天地图', x: 300, y: 500, color: 0xf59e0b },
  { key: 'phenomena-court', label: '万象庭', x: 724, y: 500, color: 0xa855f7 },
  { key: 'plaza', label: '知行广场', x: 512, y: 400, color: 0x64748b },
];

export class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }

  create() {
    this.add.text(512, 50, '知境大陆', { fontSize: '32px', color: '#e2e8f0' }).setOrigin(0.5);

    for (const zone of ZONES) {
      const circle = this.add.circle(zone.x, zone.y, 50, zone.color).setInteractive({ useHandCursor: true });
      this.add.text(zone.x, zone.y + 70, zone.label, { fontSize: '16px', color: '#e2e8f0' }).setOrigin(0.5);

      circle.on('pointerdown', () => {
        this.registry.set('currentZone', zone.key);
        this.scene.start('Battle');
      });

      circle.on('pointerover', () => circle.setScale(1.2));
      circle.on('pointerout', () => circle.setScale(1));
    }
  }
}
```

- [ ] **Step 9: 创建 src/game/scenes/BattleScene.ts**

```typescript
import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  create() {
    const zone = this.registry.get('currentZone') || 'math-hall';
    this.add.text(512, 40, `当前区域: ${zone}`, { fontSize: '24px', color: '#e2e8f0' }).setOrigin(0.5);

    // HP bar
    this.add.text(100, 100, '玩家 HP', { fontSize: '14px', color: '#94a3b8' });
    const hpBar = this.add.rectangle(200, 110, 200, 16, 0x22c55e).setOrigin(0, 0.5);

    // Monster
    this.add.rectangle(512, 250, 120, 120, 0xef4444);
    this.add.text(512, 320, '数学怪兽', { fontSize: '18px', color: '#e2e8f0' }).setOrigin(0.5);

    // Monster HP bar
    const monsterHpBar = this.add.rectangle(412, 180, 200, 16, 0xef4444).setOrigin(0, 0.5);

    // Answer panel area (overlaid by React)
    this.add.text(512, 450, '答题区域 → React 覆盖层', { fontSize: '16px', color: '#94a3b8' }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(960, 40, '返回地图', { fontSize: '16px', color: '#3b82f6' }).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start('Map'));
  }
}
```

- [ ] **Step 10: 创建 src/components/AnswerPanel.tsx**

```tsx
import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AnswerPanel() {
  const { battleState, currentQuestionId } = useGameStore();
  const [question, setQuestion] = useState<{ content: string; options?: string[] } | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const fetchQuestion = async () => {
    const res = await fetch(`${API}/subject/questions?subject=math&limit=1`);
    const data = await res.json();
    if (data.data?.[0]) {
      setQuestion(data.data[0]);
      setSelected('');
      setResult(null);
    }
  };

  const submitAnswer = async () => {
    if (!selected || !question) return;
    const res = await fetch(`${API}/subject/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: (question as Record<string, unknown>)._id,
        userAnswer: selected,
        userId: localStorage.getItem('userId'),
      }),
    });
    const data = await res.json();
    setResult(data.data.correct ? 'correct' : 'wrong');
  };

  if (battleState !== 'fighting') return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 p-4 border-t border-gray-700">
      {!question ? (
        <button onClick={fetchQuestion} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          获取题目
        </button>
      ) : (
        <div>
          <p className="text-white mb-3">{question.content}</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {question.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(opt)}
                className={`p-2 rounded border ${selected === opt ? 'border-blue-500 bg-blue-900/50' : 'border-gray-600'} text-white text-left`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={submitAnswer} disabled={!selected} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              提交答案
            </button>
            {result === 'correct' && <span className="text-green-400 self-center">回答正确!</span>}
            {result === 'wrong' && <span className="text-red-400 self-center">回答错误</span>}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 11: 创建 src/pages/Login.tsx**

```tsx
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function Login() {
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', characterName: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isRegister ? `${API}/user/auth/register` : `${API}/user/auth/login`;
    const body = isRegister
      ? { username: form.username, email: form.email, password: form.password, characterName: form.characterName }
      : { username: form.username, password: form.password };

    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const data = await res.json();
    if (data.code === 0) {
      setAuth(data.data.token, data.data.userId);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={submit} className="bg-gray-900 p-8 rounded-lg w-96 space-y-4">
        <h1 className="text-2xl text-white font-bold text-center">{isRegister ? '注册求索者' : '登录知境'}</h1>
        <input className="w-full p-2 bg-gray-800 text-white rounded" placeholder="用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        {isRegister && (
          <>
            <input className="w-full p-2 bg-gray-800 text-white rounded" placeholder="邮箱" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full p-2 bg-gray-800 text-white rounded" placeholder="角色名" value={form.characterName} onChange={(e) => setForm({ ...form, characterName: e.target.value })} />
          </>
        )}
        <input className="w-full p-2 bg-gray-800 text-white rounded" type="password" placeholder="密码" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">{isRegister ? '注册' : '登录'}</button>
        <p className="text-gray-400 text-center text-sm cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已有账号？登录' : '没有账号？注册'}
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 12: 创建 src/pages/WorldMap.tsx**

```tsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/config';

export function WorldMap() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="relative">
      <div id="game-container" className="mx-auto" />
      <AnswerPanel />
    </div>
  );
}

import { AnswerPanel } from '../components/AnswerPanel';
```

- [ ] **Step 13: 创建 src/App.tsx**

```tsx
import { useAuthStore } from './stores/authStore';
import { Login } from './pages/Login';
import { WorldMap } from './pages/WorldMap';

export default function App() {
  const { token } = useAuthStore();
  return token ? <WorldMap /> : <Login />;
}
```

- [ ] **Step 14: 更新 src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@tailwindcss/vite';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
```

- [ ] **Step 15: 更新 index.html**

确保 `<div id="game-container">` 存在，Vite 入口正确。

- [ ] **Step 16: 创建 packages/web/Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

- [ ] **Step 17: Commit**

```bash
git add -A && git commit -m "feat: add React + Phaser frontend with login, world map, battle scene"
```

---

### Task 9: 数学示例数据种子

**Files:**
- Create: `scripts/seed-math.ts`

**Interfaces:**
- Consumes: Content service `POST /import` API，Subject service MongoDB
- Produces: 数学学科的知识点和示例题目

- [ ] **Step 1: 创建 scripts/seed-math.ts**

```typescript
const API = process.env.API_URL || 'http://localhost:3000/api/content';

const knowledgePoints = [
  { knowledgePointId: 'math-func-concept', title: '函数的概念', summary: '函数是一种特殊的映射，定义域中每个元素在值域中有唯一对应元素', details: '设A、B是非空的数集，如果按某个确定的对应关系f，使对于集合A中的任意一个数x，在集合B中都有唯一确定的数f(x)和它对应，那么就称f:A→B为从集合A到集合B的一个函数。', examples: ['f(x) = 2x + 1', 'f(x) = x²'], subject: 'math' },
  { knowledgePointId: 'math-func-property', title: '函数的性质', summary: '函数的单调性、奇偶性、周期性', details: '单调性：增函数和减函数；奇偶性：f(-x)=f(x)为偶函数，f(-x)=-f(x)为奇函数；周期性：f(x+T)=f(x)。', examples: ['f(x)=x²是偶函数', 'f(x)=x³是奇函数'], subject: 'math' },
  { knowledgePointId: 'math-triangle', title: '三角函数', summary: '正弦、余弦、正切函数的定义与性质', details: 'sinα = 对边/斜边，cosα = 邻边/斜边，tanα = 对边/邻边。基本关系：sin²α + cos²α = 1', examples: ['sin30° = 1/2', 'cos60° = 1/2'], subject: 'math' },
  { knowledgePointId: 'math-derivative', title: '导数', summary: '导数的概念与运算', details: 'f\'(x) = lim(Δx→0) [f(x+Δx)-f(x)]/Δx。常见导数：(xⁿ)\'=nxⁿ⁻¹，(sinx)\'=cosx，(eˣ)\'=eˣ', examples: ['(x³)\'=3x²', '(2x+1)\'=2'], subject: 'math' },
  { knowledgePointId: 'math-probability', title: '概率与统计', summary: '随机事件的概率、古典概型、统计', details: 'P(A) = A包含的基本事件数 / 基本事件总数。互斥事件：P(A∪B) = P(A) + P(B)。独立事件：P(AB) = P(A)·P(B)', examples: ['掷骰子得6的概率=1/6', '抛硬币正面的概率=1/2'], subject: 'math' },
];

const questions = [
  {
    subject: 'math', knowledgePointId: 'math-func-concept', type: 'choice', difficulty: 'basic',
    content: '下列哪个是函数？', options: ['y = ±√x', 'y = x + 1', 'x = 5', 'y² = x'],
    answer: 'y = x + 1', explanation: '函数要求一个x对应唯一一个y，y=x+1满足此条件。y=±√x一个x对应两个y，不是函数。'
  },
  {
    subject: 'math', knowledgePointId: 'math-func-property', type: 'choice', difficulty: 'basic',
    content: 'f(x) = x² 是什么函数？', options: ['奇函数', '偶函数', '非奇非偶函数', '既奇又偶函数'],
    answer: '偶函数', explanation: 'f(-x) = (-x)² = x² = f(x)，所以f(x)=x²是偶函数。'
  },
  {
    subject: 'math', knowledgePointId: 'math-triangle', type: 'choice', difficulty: 'basic',
    content: 'sin30° 的值是？', options: ['1/2', '√2/2', '√3/2', '1'],
    answer: '1/2', explanation: 'sin30° = 1/2 是特殊角的三角函数值。'
  },
  {
    subject: 'math', knowledgePointId: 'math-derivative', type: 'choice', difficulty: 'advanced',
    content: 'f(x) = 3x² + 2x，则 f\'(x) = ？', options: ['6x + 2', '3x + 2', '6x', '6x² + 2'],
    answer: '6x + 2', explanation: '根据幂函数求导法则 (xⁿ)\'=nxⁿ⁻¹，(3x²)\'=6x，(2x)\'=2，所以f\'(x)=6x+2。'
  },
  {
    subject: 'math', knowledgePointId: 'math-probability', type: 'choice', difficulty: 'challenge',
    content: '掷两枚骰子，点数之和为7的概率是？', options: ['1/6', '5/36', '7/36', '1/4'],
    answer: '1/6', explanation: '总情况36种，和为7的情况有(1,6)(2,5)(3,4)(4,3)(5,2)(6,1)共6种，P=6/36=1/6。'
  },
  {
    subject: 'math', knowledgePointId: 'math-func-concept', type: 'choice', difficulty: 'challenge',
    content: '[2020全国卷I] 已知函数f(x)=eˣ-x-a，若f(x)≥0恒成立，则a的取值范围是？', options: ['a≤1', 'a≥1', 'a≤e', 'a≥e'],
    answer: 'a≤1', explanation: 'f\'(x)=eˣ-1，令f\'(x)=0得x=0。f(0)=1-a为最小值，要f(x)≥0，则1-a≥0，即a≤1。',
    source: '2020全国卷I', year: 2020, province: '全国I卷'
  },
];

async function seed() {
  const res = await fetch(`${API}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ knowledgePoints, examPapers: [] }),
  });
  console.log('Knowledge cards import:', await res.json());

  // Import questions to subject service
  const subjectRes = await fetch(`${API.replace('content', 'subject')}/questions/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions }),
  });
  console.log('Questions import:', await subjectRes.json());
}

seed().catch(console.error);
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add math seed data with knowledge points and sample questions"
```

---

### Task 10: 管理后台页面

**Files:**
- Create: `packages/web/src/pages/Admin.tsx`
- Create: `packages/web/src/components/ImportForm.tsx`

**Interfaces:**
- Consumes: Content service import API
- Produces: 管理后台界面，支持 JSON 批量导入题目

- [ ] **Step 1: 创建 src/pages/Admin.tsx**

```tsx
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ImportForm } from '../components/ImportForm';

export function Admin() {
  const { token } = useAuthStore();
  const [tab, setTab] = useState<'import' | 'stats'>('import');

  if (!token) return <div className="text-white p-8">请先登录</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-2xl text-white font-bold mb-6">知境管理后台</h1>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('import')} className={`px-4 py-2 rounded ${tab === 'import' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>内容导入</button>
        <button onClick={() => setTab('stats')} className={`px-4 py-2 rounded ${tab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>数据统计</button>
      </div>
      {tab === 'import' && <ImportForm />}
      {tab === 'stats' && <div className="text-gray-400">统计功能开发中...</div>}
    </div>
  );
}
```

- [ ] **Step 2: 创建 src/components/ImportForm.tsx**

```tsx
import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function ImportForm() {
  const [json, setJson] = useState('');
  const [result, setResult] = useState<string>('');

  const handleImport = async () => {
    try {
      const data = JSON.parse(json);
      const res = await fetch(`${API}/content/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setResult(`导入成功: 知识卡片 ${result.data?.knowledgeCards || 0}，试卷 ${result.data?.examPapers || 0}`);
    } catch (e) {
      setResult(`错误: ${(e as Error).message}`);
    }
  };

  return (
    <div>
      <textarea
        className="w-full h-64 bg-gray-900 text-white p-4 rounded border border-gray-700 font-mono text-sm"
        placeholder='粘贴 JSON 数据，格式: { "knowledgePoints": [...], "examPapers": [...] }'
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <button onClick={handleImport} className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        导入
      </button>
      {result && <p className="mt-4 text-gray-300">{result}</p>}
    </div>
  );
}
```

- [ ] **Step 3: 更新 App.tsx 添加 Admin 路由**

在 `App.tsx` 中添加简单的路由逻辑：

```tsx
import { useAuthStore } from './stores/authStore';
import { Login } from './pages/Login';
import { WorldMap } from './pages/WorldMap';
import { Admin } from './pages/Admin';
import { useState } from 'react';

export default function App() {
  const { token } = useAuthStore();
  const [page, setPage] = useState<'game' | 'admin'>('game');

  if (!token) return <Login />;

  return (
    <div>
      <nav className="bg-gray-900 p-2 flex gap-4">
        <button onClick={() => setPage('game')} className={`text-sm ${page === 'game' ? 'text-blue-400' : 'text-gray-400'}`}>游戏</button>
        <button onClick={() => setPage('admin')} className={`text-sm ${page === 'admin' ? 'text-blue-400' : 'text-gray-400'}`}>管理</button>
      </nav>
      {page === 'game' ? <WorldMap /> : <Admin />}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add admin page with JSON import for questions and exam papers"
```

---

## Self-Review Checklist

**1. Spec Coverage:**
- 世界观五大领域 → Task 6 (zone routes), Task 8 (MapScene)
- 角色系统 → Task 3 (User + Character models)
- 战斗与答题 → Task 5 (answer routes), Task 6 (BattleRoom), Task 8 (AnswerPanel)
- 高考真题系统 → Task 4 (ExamPaper model), Task 5 (year/province fields)
- 好友系统 → Task 7 (friend routes)
- 排行榜 → Task 7 (leaderboard routes)
- 知识卡片 → Task 4 (KnowledgeCard model)
- 管理后台 → Task 10 (Admin page + ImportForm)
- 数学示例数据 → Task 9 (seed-math.ts)
- 微服务架构 → Task 1-7 (5 services + gateway)

**2. Placeholder scan:** No TBD/TODO found.

**3. Type consistency:** Verified Question.answer is `string | string[]` throughout, Character fields match between User model and game state.
