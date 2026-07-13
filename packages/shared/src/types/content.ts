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
