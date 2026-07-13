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
