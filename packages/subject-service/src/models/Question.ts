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
