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
