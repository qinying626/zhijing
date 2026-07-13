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
