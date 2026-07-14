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
