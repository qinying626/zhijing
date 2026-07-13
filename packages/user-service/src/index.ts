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
