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
