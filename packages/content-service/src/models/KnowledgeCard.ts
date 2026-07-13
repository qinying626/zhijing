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
