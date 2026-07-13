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
